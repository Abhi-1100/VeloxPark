import { describe, expect, it } from 'vitest';
import { calculateAmount, calculateDuration, parseToDate } from '../src/utils/parkingUtils';
import { cleanPlate } from '../src/utils/validation';

describe('user parking calculations', () => {
  it('normalises plates', () => expect(cleanPlate(' ts 15-el 5671 ')).toBe('TS15EL5671'));
  it.each([[0, 0], [29, 0], [30, 0], [31, 20], [60, 20], [61, 20], [135, 40]])('charges %s minutes correctly', (minutes, amount) => expect(calculateAmount({ totalMinutes: minutes }, 20)).toBe(amount));
  it('parses ESP32 UTC timestamps for IST display', () => expect(parseToDate('2026-10-03 05:00:00').toISOString()).toBe('2026-10-03T05:00:00.000Z'));
  it('pairs legacy odd/even scans', () => { expect(calculateDuration('03/10/26 08:00', '03/10/26 09:45').totalMinutes).toBe(105); });
});
