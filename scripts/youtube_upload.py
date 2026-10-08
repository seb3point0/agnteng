#!/usr/bin/env python3
"""Upload the event's talk videos to YouTube.

Raw HTTP against the resumable upload protocol — no google-api-python-client,
because the dependency buys nothing here and this way the whole flow is visible
in one file.

Videos land as **private**. That is not a choice: the Data API locks every
upload from an unverified API project to private, silently. `privacyStatus:
public` is accepted and ignored, the call succeeds, and an email arrives later
saying the video was locked. Flip them to public by hand in YouTube Studio.

Credentials, one time:

  1. console.cloud.google.com → new project
  2. APIs & Services → Library → enable "YouTube Data API v3"
  3. APIs & Services → Credentials → Create credentials → OAuth client ID
     → Application type: **Desktop app**
  4. Put the two values in .env:
         YOUTUBE_CLIENT_ID=...
         YOUTUBE_CLIENT_SECRET=...
  5. Run this script. It prints a URL, you approve in the browser, and the
     refresh token is cached at ~/.config/agnteng/youtube-token.json (mode 600)
     so step 5 never repeats.

Quota: an upload costs 1600 units against a 10,000/day default, so six videos a
day. Three is fine.
"""

from __future__ import annotations

import argparse
import http.server
import json
import os
import pathlib
import socket
import sys
import threading
import urllib.error
import urllib.parse
import urllib.request

AUTH = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN = "https://oauth2.googleapis.com/token"
UPLOAD = "https://www.googleapis.com/upload/youtube/v3/videos"
SCOPE = "https://www.googleapis.com/auth/youtube.upload"

TOKEN_FILE = pathlib.Path.home() / ".config" / "agnteng" / "youtube-token.json"
CHUNK = 8 * 1024 * 1024  # 8 MiB per resumable chunk


def die(msg: str) -> None:
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(1)


def env(name: str) -> str:
    v = os.environ.get(name, "").strip()
    if v:
        return v
    for p in (pathlib.Path(".env"),
              pathlib.Path(__file__).resolve().parent.parent / ".env"):
        if p.exists():
            for line in p.read_text().splitlines():
                if line.strip().startswith(f"{name}="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    die(f"{name} is not set — see the header of this script")


def post_form(url: str, data: dict) -> dict:
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(url, data=body,
                                 headers={"Content-Type":
                                          "application/x-www-form-urlencoded"})
    try:
        return json.loads(urllib.request.urlopen(req, timeout=60).read())
    except urllib.error.HTTPError as e:
        die(f"{url} returned HTTP {e.code}: {e.read().decode(errors='replace')[:300]}")


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def consent(client_id: str, client_secret: str) -> dict:
    """Loopback OAuth. A desktop client cannot keep a secret, so Google's own
    flow for it is exactly this: open a browser, catch the redirect locally."""
    port = free_port()
    redirect = f"http://127.0.0.1:{port}"
    got: dict = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):  # noqa: N802
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            got.update({k: v[0] for k, v in q.items()})
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            ok = "code" in got
            self.wfile.write(
                b"<h2>Done - close this tab and go back to the terminal.</h2>"
                if ok else b"<h2>No code returned. Check the terminal.</h2>")

        def log_message(self, *a):  # silence the default stderr logging
            pass

    srv = http.server.HTTPServer(("127.0.0.1", port), Handler)
    threading.Thread(target=srv.handle_request, daemon=True).start()

    url = AUTH + "?" + urllib.parse.urlencode({
        "client_id": client_id, "redirect_uri": redirect,
        "response_type": "code", "scope": SCOPE,
        "access_type": "offline", "prompt": "consent"})
    print("\nOpen this and approve:\n")
    print(f"  {url}\n")
    print("waiting for the redirect…", file=sys.stderr)
    srv.serve_forever() if False else None
    import time
    for _ in range(600):
        if got:
            break
        time.sleep(0.5)
    if "code" not in got:
        die(f"no authorization code received ({got or 'timed out'})")

    tok = post_form(TOKEN, {
        "code": got["code"], "client_id": client_id,
        "client_secret": client_secret, "redirect_uri": redirect,
        "grant_type": "authorization_code"})
    if "refresh_token" not in tok:
        die("Google did not return a refresh token — revoke the app's access "
            "at myaccount.google.com/permissions and run this again")
    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(json.dumps({"refresh_token": tok["refresh_token"]}))
    TOKEN_FILE.chmod(0o600)
    print(f"stored refresh token at {TOKEN_FILE}", file=sys.stderr)
    return tok


def access_token(client_id: str, client_secret: str) -> str:
    if TOKEN_FILE.exists():
        rt = json.loads(TOKEN_FILE.read_text()).get("refresh_token")
        if rt:
            tok = post_form(TOKEN, {
                "refresh_token": rt, "client_id": client_id,
                "client_secret": client_secret, "grant_type": "refresh_token"})
            return tok["access_token"]
    return consent(client_id, client_secret)["access_token"]


def upload(path: pathlib.Path, meta: dict, token: str) -> str:
    size = path.stat().st_size
    body = json.dumps({
        "snippet": {"title": meta["title"], "description": meta["description"],
                    "tags": meta.get("tags", []), "categoryId": "28"},
        # Locked private regardless by an unverified project — stated, not implied.
        "status": {"privacyStatus": "private", "selfDeclaredMadeForKids": False},
    }).encode()

    req = urllib.request.Request(
        UPLOAD + "?" + urllib.parse.urlencode(
            {"uploadType": "resumable", "part": "snippet,status"}),
        data=body, method="POST",
        headers={"Authorization": f"Bearer {token}",
                 "Content-Type": "application/json; charset=UTF-8",
                 "X-Upload-Content-Length": str(size),
                 "X-Upload-Content-Type": "video/mp4"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            session = r.headers["Location"]
    except urllib.error.HTTPError as e:
        die(f"could not start the upload: HTTP {e.code} "
            f"{e.read().decode(errors='replace')[:300]}")

    sent = 0
    with path.open("rb") as fh:
        while sent < size:
            chunk = fh.read(CHUNK)
            last = sent + len(chunk)
            r = urllib.request.Request(
                session, data=chunk, method="PUT",
                headers={"Content-Length": str(len(chunk)),
                         "Content-Range": f"bytes {sent}-{last-1}/{size}"})
            try:
                with urllib.request.urlopen(r, timeout=600) as resp:
                    done = json.loads(resp.read())
                    print(f"    100%", file=sys.stderr)
                    return done["id"]
            except urllib.error.HTTPError as e:
                if e.code != 308:  # 308 = resume incomplete, keep going
                    die(f"upload failed at {sent}: HTTP {e.code} "
                        f"{e.read().decode(errors='replace')[:300]}")
                rng = e.headers.get("Range")
                sent = int(rng.split("-")[1]) + 1 if rng else last
                print(f"    {sent*100//size:3d}%", end="\r", file=sys.stderr)
    die("upload ended without an id")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("metadata", help="JSON file: [{file, title, description, tags}]")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    items = json.loads(pathlib.Path(args.metadata).read_text())
    for it in items:
        p = pathlib.Path(it["file"])
        if not p.exists():
            die(f"missing video: {p}")
        print(f"  {p.name}  ({p.stat().st_size/1e6:.0f} MB)  →  {it['title']}")
    if args.dry_run:
        print("\n(dry run, nothing uploaded)")
        return

    cid, secret = env("YOUTUBE_CLIENT_ID"), env("YOUTUBE_CLIENT_SECRET")
    token = access_token(cid, secret)

    out = []
    for it in items:
        p = pathlib.Path(it["file"])
        print(f"\nuploading {p.name}…", file=sys.stderr)
        vid = upload(p, it, token)
        url = f"https://youtu.be/{vid}"
        print(f"  {url}  (private)")
        out.append({**it, "video_id": vid, "url": url})

    res = pathlib.Path(args.metadata).with_name("youtube.json")
    res.write_text(json.dumps(out, indent=1))
    print(f"\nwrote {res}")
    print("All private — flip them in YouTube Studio when you're ready.")


if __name__ == "__main__":
    main()
