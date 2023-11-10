import { InitialSetupDialog } from '../initial-setup-dialog';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import * as utils from '@/utils';

describe('InitialSetupDialog', () => {

  beforeAll(() => {
    vi.spyOn(utils, 'persistState').mockImplementation(() => { });
  })

  it('sets default workCalibration and breakCalibration if not set', async () => {
    render(<InitialSetupDialog />);
    userEvent.click(screen.getByText("I'm done!"));

    await waitFor(() => {
      expect(utils.persistState).toHaveBeenCalled();
    })

    expect(utils.state.$workCalibration?.peek()).toBe(30 * 60);
    expect(utils.state.$breakCalibration?.peek()).toBe(10 * 60);
  });

  it('does not override existing workCalibration and breakCalibration', async () => {
    utils.state.workCalibration = 100;
    utils.state.breakCalibration = 200;

    render(<InitialSetupDialog />);
    await userEvent.click(screen.getByText("I'm done!"));

    expect(utils.state.$workCalibration?.peek()).toBe(100);
    expect(utils.state.$breakCalibration?.peek()).toBe(200);
    expect(utils.persistState).toHaveBeenCalled();
  });
});