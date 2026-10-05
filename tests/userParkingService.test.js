import { describe, expect, it } from 'vitest';
import { pairLegacyScans, selectPlateSessions } from '../src/services/userParkingService';

describe('legacy pairing and payment state', () => {
  it('keeps an odd scan parked and pairs an even scan exited', () => { const sessions = pairLegacyScans([{ id: '1', plate: 'TS15EL5671', inTime: '03/10/26 08:00' }, { id: '2', plate: 'TS15EL5671', inTime: '03/10/26 09:00' }, { id: '3', plate: 'TS15EL5671', inTime: '03/10/26 10:00' }]); expect(sessions.find((item) => item.status === 'parked')).toBeTruthy(); expect(sessions.find((item) => item.status === 'exited')).toBeTruthy(); });
  it('maps unpaid and paid sessions to distinct states', () => { const unpaid = selectPlateSessions([{ plate: 'TS15EL5671', status: 'exited', amount: 20, entry: '2026-10-03T05:00:00Z' }], 'TS15EL5671').current; const paid = selectPlateSessions([{ plate: 'TS15EL5671', status: 'exited', amount: 20, paymentStatus: 'paid', entry: '2026-10-03T05:00:00Z' }], 'TS15EL5671').current; expect(unpaid.state).toBe('exitedUnpaid'); expect(paid.state).toBe('paid'); });
});
