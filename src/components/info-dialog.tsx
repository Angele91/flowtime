import { state } from "@/utils"

export const InfoDialog = () => {

  return (
    <dialog id="info-dialog" className="modal">
      <div className="modal-box flex flex-col gap-4">
        <h3 className="font-bold text-lg">Information</h3>
        <div className="form-control w-full max-w-xs">
          <label className="label" htmlFor="work">
            <span className="label-text">Calculated Work Time (seconds)</span>
          </label>
          <input
            type="text"
            id="work"
            name="work"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={state.workCalibration}
            onChange={(e) => state.workCalibration = Number(e.target.value)}
          />
          <label className="label">
            <span className="label-text-alt">This has been calculated based on your previous sessions</span>
          </label>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label" htmlFor="break">
            <span className="label-text">Calculated Break Time (seconds)</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            id="break"
            name="break"
            className="input input-bordered w-full max-w-xs"
            value={state.breakCalibration}
            onChange={(e) => state.breakCalibration = Number(e.target.value)}
          />
          <label className="label">
            <span className="label-text-alt">This has been calculated based on your previous sessions</span>
          </label>
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex gap-4">
            <button className="btn">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}