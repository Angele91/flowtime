import { clearInterval, setInterval } from "worker-timers";
import { deepSignal } from "deepsignal/react";
import localforage from "localforage";

export const cowbellsAudio = new Audio("/cowbells.wav");

export interface State {
  isStarted: boolean;
  isPaused: boolean;
  mode: "work" | "break";
  seconds: number;
  internal: {
    intervalId: number;
  };
  workCalibration?: number;
  breakCalibration?: number;
  workHistory: number[];
  breakHistory: number[];
  keepRunningValue: number;
  showDebugInfo?: boolean;
}

export const state = deepSignal<State>({
  isStarted: false,
  isPaused: false,
  mode: "work",
  seconds: 0,
  internal: {
    intervalId: -1,
  },
  workCalibration: undefined as undefined | number,
  breakCalibration: undefined as undefined | number,
  workHistory: [] as number[],
  breakHistory: [] as number[],
  keepRunningValue: 5 as number,
});

export const calibrate = (sessionDuration: number) => {
  if (state.mode === "work") {
    calibrateWorkTime(sessionDuration);
  } else {
    calibrateBreakTime(sessionDuration);
  }
};

export const restartInMode = (mode: "work" | "break") => {
  calibrate(state.seconds);
  state.seconds = 0;
  state.mode = mode;

  startClock();
};

export const calibrateWorkTime = (sessionDuration: number) => {
  // when calibrating the work time we get the average of work times
  // we get the current session duration, we sum it to the total, and get the average
  const newHistory = [...state.workHistory, sessionDuration];
  const average = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;
  state.workCalibration = average;

  state.workHistory = newHistory.filter((v) => v !== 0);
};

export const calibrateBreakTime = (sessionDuration: number) => {
  // when calibrating the break time we get the average of break times
  // we get the current session duration, we sum it to the total, and get the average
  const newHistory = [...state.breakHistory, sessionDuration];
  const average = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;
  state.breakCalibration = average;

  state.breakHistory = newHistory.filter((v) => v !== 0);
};

export const stopClock = () => {
  state.isStarted = false;
  calibrate(state.seconds);
  state.seconds = 0;
  clearInterval(state.internal.intervalId);

  state.mode = state.mode === "work" ? "break" : "work";
};

export const pauseClock = () => {
  state.isPaused = true;
  clearInterval(state.internal.intervalId);
};

export const playCowbell = () => {
  cowbellsAudio.play();
  cowbellsAudio.loop = true;
};

export const tick = () => {
  state.seconds++;

  if (state.workCalibration) {
    if (state.mode === "work" && state.seconds >= state.workCalibration) {
      pauseClock();
      playCowbell();
      (
        document.getElementById("recalibration-dialog") as HTMLDialogElement
      ).showModal();
    }
  }

  if (state.breakCalibration) {
    if (state.mode === "break" && state.seconds >= state.breakCalibration) {
      pauseClock();
      playCowbell();
      (
        document.getElementById("recalibration-dialog") as HTMLDialogElement
      ).showModal();
    }
  }
};

export const startClock = () => {
  if (state.internal.intervalId !== -1) {
    clearInterval(state.internal.intervalId);
  }

  state.isStarted = true;

  if (state.isPaused) {
    state.isPaused = false;
  }

  state.internal.intervalId = setInterval(tick, 1000);
};

export const persistState = () => {
  localforage.setItem("flowtime-state", JSON.stringify(state));
};
