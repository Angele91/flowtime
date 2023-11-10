import { InfoDialog } from '../info-dialog';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/react';
import { state } from '@/utils';

describe('InfoDialog', () => {

  it('renders correctly', () => {
    const { getByText } = render(<InfoDialog />);
    expect(getByText('Information')).toBeInTheDocument();
  });

  it('updates workCalibration state when input changes', async () => {
    const { getByLabelText } = render(<InfoDialog />);
    const input = getByLabelText('Calculated Work Time (seconds)');
    userEvent.type(input, '100');

    await waitFor(() => {
      expect(state.$workCalibration?.peek()).toBe(100);
    })
  });

  it('updates breakCalibration state when input changes', async () => {
    const { getByLabelText } = render(<InfoDialog />);
    const input = getByLabelText('Calculated Break Time (seconds)');
    userEvent.type(input, '200');

    await waitFor(() => {
      expect(state.$breakCalibration?.peek()).toBe(200);
    })
  });
});