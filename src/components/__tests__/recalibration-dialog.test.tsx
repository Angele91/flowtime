import { RecalibrationDialog } from '../recalibration-dialog';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/react';
import { state } from '@/utils';

describe('RecalibrationDialog', () => {

  it('updates workCalibration state when keepRunning is called', async () => {
    state.workCalibration = 50;
    state.keepRunningValue = 10;

    const { getByText } = render(<RecalibrationDialog />);
    const button = getByText('Yes, keep it running!');
    userEvent.click(button);

    await waitFor(() => {
      expect(state.workCalibration).toBe(650);
    })
  });
});