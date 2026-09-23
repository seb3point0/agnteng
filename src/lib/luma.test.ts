import { describe, expect, it } from 'vitest';
import { getEventAudience, getSupporterNames, type LumaGuest } from './luma';

function guest(overrides: Partial<LumaGuest> = {}): LumaGuest {
  return { name: 'Guest', checked_in_at: null, ...overrides };
}

describe('getEventAudience', () => {
  const eventStartAt = '2026-01-01T00:00:00.000Z';

  it('uses everyone registered before the event starts', () => {
    const guests = [
      guest({ checked_in_at: null }),
      guest({ checked_in_at: '2025-12-01T00:00:00.000Z' }),
    ];
    const audience = getEventAudience(guests, '2999-01-01T00:00:00.000Z');
    expect(audience.usingCheckedInOnly).toBe(false);
    expect(audience.totalGuests).toBe(2);
  });

  it('filters to checked-in guests once the event has started', () => {
    const guests = [guest({ checked_in_at: null }), guest({ checked_in_at: eventStartAt })];
    const audience = getEventAudience(guests, eventStartAt);
    expect(audience.usingCheckedInOnly).toBe(true);
    expect(audience.checkedInCount).toBe(1);
  });

  it('groups roles and rounds percentages to sum to 100', () => {
    const guests: LumaGuest[] = [
      guest({
        checked_in_at: eventStartAt,
        registration_answers: [{ question_id: 'f3mmzh5t', answer: 'Founder' }],
      }),
      guest({
        checked_in_at: eventStartAt,
        registration_answers: [{ question_id: 'f3mmzh5t', answer: 'Engineer' }],
      }),
      guest({
        checked_in_at: eventStartAt,
        registration_answers: [{ question_id: 'f3mmzh5t', answer: 'Researcher' }],
      }),
    ];
    const audience = getEventAudience(guests, eventStartAt);
    const total = audience.roles.reduce((sum, r) => sum + r.pct, 0);
    expect(total).toBe(100);
    expect(audience.roles.find((r) => r.label === 'Engineers')?.pct).toBe(67);
  });

  it('ignores registration answers with an unexpected shape', () => {
    const guests: LumaGuest[] = [
      guest({
        checked_in_at: eventStartAt,
        registration_answers: [{ question_id: 'f3mmzh5t', answer: { unexpected: true } }],
      }),
    ];
    expect(() => getEventAudience(guests, eventStartAt)).not.toThrow();
  });

  it('returns zero audience for an empty guest list', () => {
    const audience = getEventAudience([], eventStartAt);
    expect(audience.totalGuests).toBe(0);
    expect(audience.roles).toEqual([]);
  });
});

describe('getSupporterNames', () => {
  it('matches only the supporter ticket type', () => {
    const guests: LumaGuest[] = [
      guest({ name: 'Ada', event_ticket: { name: 'Supporter ❤️' } }),
      guest({ name: 'Grace', event_ticket: { name: 'Free' } }),
    ];
    expect(getSupporterNames(guests)).toEqual(['Ada']);
  });
});
