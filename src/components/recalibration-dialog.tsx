import { restartInMode, startClock, state } from "../utils"

export const RecalibrationDialog = () => {
  const keepRunning = () => {
    if (state.mode === 'break') {
      state.breakCalibration = (state.breakCalibration ?? 0) + (state.keepRunningValue * 60)
    } else {
      state.workCalibration = (state.workCalibration ?? 0) + (state.keepRunningValue * 60)
    }
    startClock()
  }
  const takeABreak = () => {
    restartInMode(state.mode === "work" ? "break" : "work")
  }

  return (
    <dialog id="recalibration-dialog" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Do you want to keep the timer running?</p>
        <input
          type="range"
          min={5}
          max="60"
          value={state.keepRunningValue}
          onChange={(e) => state.keepRunningValue = e.target.valueAsNumber}
          className="range"
          step="5" />
        <div className="w-full flex justify-between text-xs px-2">
          <span>5m</span>
          <span>10m</span>
          <span>15m</span>
          <span>20m</span>
          <span>25m</span>
          <span>30m</span>
          <span>35m</span>
          <span>40m</span>
          <span>45m</span>
          <span>50m</span>
          <span>55m</span>
          <span>60m</span>
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex gap-4">
            <button
              className="btn"
              onClick={keepRunning}
            >
              Yes, keep it running!
            </button>
            <button
              className="btn"
              onClick={takeABreak}
            >
              No, i want to {state.mode === "work" ? "take a break 😴" : "work 💪"}
            </button>
          </form>
        </div>
      </div>
    </dialog>

  )
}