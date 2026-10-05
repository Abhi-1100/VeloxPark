import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserParkingInfo from '../src/pages/user/UserParkingInfo';

vi.mock('../src/services/userParkingService', () => ({
  subscribeToVehicle: vi.fn((plate, onData) => { onData({ current: { plate, state: 'parked', status: 'parked', entry: '2026-10-03T05:00:00Z', rateAtEntry: 20 }, previous: [] }); return () => {}; }),
  loadLocalVehicle: vi.fn(),
}));

describe('UserParkingInfo smoke state', () => {
  it('renders the zero state without fake vehicle data', () => { localStorage.clear(); render(<MemoryRouter><UserParkingInfo /></MemoryRouter>); expect(screen.getByText('How it works')).toBeTruthy(); expect(screen.queryByText('Currently parked')).toBeNull(); });
});
