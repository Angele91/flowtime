import localforage from "localforage"
import { useCallback, useEffect, useState } from "react"
import { State, cowbellsAudio, pauseClock, persistState, startClock, state, stopClock } from "../utils"
import { capitalize } from "lodash"
import { motion } from "framer-motion"
import { RecalibrationDialog } from "../components/recalibration-dialog"
import { InitialSetupDialog } from "../components/initial-setup-dialog"
import { BugAntIcon, InformationCircleIcon } from "@heroicons/react/20/solid"
import { twMerge } from "tailwind-merge"
import { InfoDialog } from "../components/info-dialog"

export const MainRoute = () => {
  const [initialized, setInitialized] = useState(false)

  const init = useCallback(async () => {
    if (initialized) {
      return
    }

    const persistedState = await localforage.getItem("flowtime-state") as string;

    if (persistedState) {
      const parsedPersistedState = JSON.parse(persistedState) as State
      clearInterval(parsedPersistedState.internal.intervalId)
      state.isStarted = parsedPersistedState.isStarted
      state.isPaused = parsedPersistedState.isPaused
      state.mode = parsedPersistedState.mode
      state.seconds = parsedPersistedState.seconds
      state.workCalibration = parsedPersistedState.workCalibration
      state.breakCalibration = parsedPersistedState.breakCalibration
      state.workHistory = parsedPersistedState.workHistory
      state.breakHistory = parsedPersistedState.breakHistory
      state.keepRunningValue = parsedPersistedState.keepRunningValue

      if (parsedPersistedState.isStarted) {
        startClock()
      }
    }

    setInitialized(true)
  }, [initialized])

  useEffect(() => {
    init()

    document.addEventListener('close', () => {
      persistState()
      clearInterval(state.internal.intervalId)
    })
  }, [init])

  useEffect(() => {
    if (!initialized) {
      return
    }

    if (!state.breakCalibration || !state.workCalibration) {
      (document.getElementById("initial-setup-modal") as HTMLDialogElement).showModal()
    }

    const stopCowbellAudio = () => {
      cowbellsAudio.pause()
      cowbellsAudio.currentTime = 0
    }

    document.addEventListener("click", stopCowbellAudio)
    document.addEventListener("touchstart", stopCowbellAudio)
    document.addEventListener("keydown", stopCowbellAudio)
  }, [initialized])

  useEffect(() => {
    if (!initialized) {
      return
    }

    persistState()
  }, [initialized, state.seconds])

  const toggle = () => {
    if (!state.isStarted) {
      startClock()
      return;
    }

    stopClock()
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <RecalibrationDialog />
      <InitialSetupDialog />
      <InfoDialog />
      <div className="card flex flex-row bg-base-100 shadow-xl glass">
        <div className="flex items-center justify-center flex-col gap-2 p-8">
          <span className="countdown font-mono text-2xl">
            {capitalize(state.mode)}
          </span>
          <span className={twMerge(
            "countdown font-mono text-2xl",
            state.mode === "work" ? "text-error" : "text-success",
          )}>
            <span className="hours" style={{ "--value": state.seconds / 3600 } as any}></span>h
            <span style={{ "--value": state.seconds / 60 % 60 } as any}></span>m
            <span style={{ "--value": state.seconds % 60 } as any}></span>s
          </span>
        </div>
        <div className="card-body relative">
          <div className="flex justify-end items-center gap-2">
            <button
              className="btn btn-square btn-outline btn-sm"
              onClick={() => {
                (document.getElementById("info-dialog") as HTMLDialogElement).showModal()
              }}
            >
              <InformationCircleIcon
                className="w-6 h-6"
              />
            </button>
            <button
              className="btn btn-square btn-outline btn-sm"
              onClick={() => {
                state.showDebugInfo = !state.showDebugInfo
              }}
            >
              <BugAntIcon
                className="w-6 h-6"
              />
            </button>
          </div>
          <motion.div
            className="card shadow-xl overflow-hidden max-h-40 overflow-y-auto"
            initial="hidden"
            animate={state.showDebugInfo ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: { opacity: 1, height: "auto" },
            }}
          >
            <h4>Debug Info</h4>
            <pre>
              {JSON.stringify(state, null, 2)}
            </pre>
          </motion.div>

          <button className="btn btn-primary" onClick={toggle}>
            {state.isStarted ? "Stop" : "Start"} {state.mode === "work" ? "Work" : "Break"}
          </button>
          <button className="btn btn-accent" onClick={stopClock}>
            Skip {state.mode === "work" ? "Work" : "Break"}
          </button>
          {state.isStarted && (
            <button className="btn btn-secondary" onClick={state.isPaused ? startClock : pauseClock}>
              {state.isPaused ? "Resume" : "Pause"} {state.mode === "work" ? "Work" : "Break"}
            </button>
          )}
        </div>
      </div>

    </div>
  )
}