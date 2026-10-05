import { describe, expect, it } from 'vitest';
import { normalizeEntry } from '../src/utils/schemaUtils';

describe('schema normalization', () => {
  it('normalizes legacy entries', () => expect(normalizeEntry({ number_plate: 'TS15EL5671', date_time: '03/10/26 08:00' })).toMatchObject({ plate: 'TS15EL5671', inTime: '03/10/26 08:00' }));
  it('preserves optional payment fields and tolerates absence', () => { expect(normalizeEntry({ plate: 'TS15EL5671', inTime: '2026-10-03T05:00:00Z', paymentStatus: 'paid', paymentRef: '123456789012' })).toMatchObject({ paymentStatus: 'paid', paymentRef: '123456789012' }); expect(normalizeEntry({ plate: 'TS15EL5671', inTime: '2026-10-03T05:00:00Z' }).paymentStatus).toBeUndefined(); });
});
