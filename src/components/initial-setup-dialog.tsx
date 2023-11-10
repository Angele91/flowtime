import { persistState, state } from "../utils"

export const InitialSetupDialog = () => {
  const onDone = () => {
    if (!state.$workCalibration?.peek()) {
      state.workCalibration = 30 * 60
    }

    if (!state.$breakCalibration?.peek()) {
      state.breakCalibration = 10 * 60
    }

    state.breakHistory = [state.breakCalibration!]
    state.workHistory = [state.workCalibration!]

    persistState()
  }

  return (
    <dialog id="initial-setup-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Before getting started, we need to configure your first session</p>
        <div className="flex flex-col gap-2">
          <label className="label" htmlFor="work">
            How much time do you think you can work without needing a break?
          </label>
          <input
            type="range"
            min={5}
            max="60"
            id="work"
            defaultValue={30}
            onChange={(e) => state.workCalibration = e.target.valueAsNumber * 60}
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
        </div>
        <div className="flex flex-col gap-2">
          <label className="label" htmlFor="break">
            How much time do you think you can take a break without needing to work?
          </label>
          <input
            type="range"
            min={5}
            max="60"
            id="break"
            defaultValue={10}
            onChange={(e) => state.breakCalibration = e.target.valueAsNumber * 60}
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
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn"
              onClick={onDone}
            >
              I'm done!
            </button>
          </form>
        </div>
      </div>
    </dialog>

  )
}