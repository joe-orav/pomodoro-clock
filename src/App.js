import React, { useEffect, useReducer, useRef } from 'react';
import pause from "./img/pause.png";
import play from "./img/play.png";
import reload from "./img/reload.png";

const
    SESSION = "Session",
    BREAK = "Break",
    TOGGLE_TIMER = "TOGGLE_TIMER",
    CHANGE_SESSION_LENGTH = "CHANGE_SESSION_LENGTH",
    CHANGE_BREAK_LENGTH = "CHANGE_BREAK_LENGTH",
    UPDATE_TIME = "UPDATE_TIME",
    RESET_CLOCK = "RESET_CLOCK";

let initialState = {
    timerRunning: false,
    label: SESSION,
    sessionTime: 25,
    breakTime: 5,
    timeRemaining: "25:00"
}

const PomodoroStep = props => {
    var labelToLower = props.label.toLowerCase();

    return (
        <div className="time-length-container">
            <p id={labelToLower + "-label"} className="control-label">{"Set " + props.label + " Length:"}</p>
            <div className="time-length-controls">
                <button id={labelToLower + "-increment"} className="control-btn" onClick={() => props.onClick(1)} disabled={props.length >= 60}>▲</button>
                <p id={labelToLower + "-length"} className="time-length">{props.length}</p>
                <button id={labelToLower + "-decrement"} className="control-btn" onClick={() => props.onClick(-1)} disabled={props.length <= 1}>▼</button>
            </div>
        </div>
    )
}

function reducer(state, action) {
    let newTimeRemaining;

    switch (action.type) {
        case TOGGLE_TIMER:
            return { ...state, timerRunning: !state.timerRunning }
        case CHANGE_SESSION_LENGTH:
            let newSessionTime = state.sessionTime + action.lengthChange;
            newTimeRemaining = state.label === SESSION ?
                `${newSessionTime < 10 ? "0" : ""}${newSessionTime}:00` : state.timeRemaining

            return { ...state, sessionTime: newSessionTime, timeRemaining: newTimeRemaining }
        case CHANGE_BREAK_LENGTH:
            let newBreakTime = state.breakTime + action.lengthChange;
            newTimeRemaining = state.label === BREAK ?
                `${newBreakTime < 10 ? "0" : ""}${newBreakTime}:00` : state.timeRemaining

            return { ...state, breakTime: newBreakTime, timeRemaining: newTimeRemaining }
        case UPDATE_TIME:
            if (state.timeRemaining === "00:00") {
                let newLabel;

                if (state.label === SESSION) {
                    newLabel = BREAK;
                    newTimeRemaining = `${state.breakTime < 10 ? "0" : ""}${state.breakTime}:00`
                } else if (state.label === BREAK) {
                    newLabel = SESSION;
                    newTimeRemaining = `${state.sessionTime < 10 ? "0" : ""}${state.sessionTime}:00`
                }

                return { ...state, label: newLabel, timeRemaining: newTimeRemaining }

            } else {
                const [minutes, seconds] = state.timeRemaining.split(":");
                let timeInMilliseconds = ((parseInt(minutes) * 60 * 1000) + (parseInt(seconds) * 1000) - 1000);
                let newTime = new Date(timeInMilliseconds);

                let newMinutes = newTime.getMinutes() < 10 ? "0" + newTime.getMinutes() : newTime.getMinutes();
                let newSeconds = newTime.getSeconds() < 10 ? "0" + newTime.getSeconds() : newTime.getSeconds();

                return { ...state, timeRemaining: `${newMinutes}:${newSeconds}` }
            }
        case RESET_CLOCK:
            return initialState
        default:
            return state
    }
}

function PomodoroClockHook() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const alarmAudio = useRef(null);

    function handleStepLength(step, lengthChange) {
        if (!state.timerRunning) {
            switch (step) {
                case SESSION:
                    dispatch({ type: CHANGE_SESSION_LENGTH, lengthChange: lengthChange })
                    break;
                case BREAK:
                    dispatch({ type: CHANGE_BREAK_LENGTH, lengthChange: lengthChange })
                // no default
            }
        }
    }

    function setAppBackground() {
        let backgroundClass = "";

        const [minutes, seconds] = state.timeRemaining.split(":");
        let timeInMilliseconds = ((parseInt(minutes) * 60 * 1000) + (parseInt(seconds) * 1000) - 1000);

        if (state.timerRunning) {
            if (timeInMilliseconds < 10000) {
                backgroundClass = "red-color-loop-animation"
            } else {
                backgroundClass = "color-loop-animation"
            }
        }

        return backgroundClass
    }

    useEffect(() => {
        let intervalId;

        if (state.timerRunning) {
            intervalId = setInterval(() => {
                dispatch({ type: UPDATE_TIME })
            }, 1000)

            return () => {
                clearInterval(intervalId)
            }
        }
    }, [state.timerRunning])

    useEffect(() => {
        if (state.timeRemaining === "00:00") {
            alarmAudio.current.play();
            alarmAudio.current.currentTime = 0;
        }
    }, [state.timeRemaining])

    return (
        <div id="app-container" class={setAppBackground()}>
            <div id="app">
                <h1 id="app-header">Pomodoro Clock</h1>
                <div id="timer-display">
                    <h2 id="timer-label">{state.label}</h2>
                    <p id="time-left">{state.timeRemaining}</p>
                </div>
                <div id="timer-controls">
                    <button id="start_stop" className="timer-btn" onClick={() => dispatch({ type: TOGGLE_TIMER })}><img src={state.timerRunning ? pause : play} alt={state.timerRunning ? "pause" : "play"} /></button>
                    <button id="reset" className="timer-btn" onClick={() => dispatch({ type: RESET_CLOCK })}><img src={reload} alt="reset" /></button>
                </div>
                <div id="steps">
                    <PomodoroStep label={SESSION} length={state.sessionTime} onClick={(lengthChange) => handleStepLength(SESSION, lengthChange)} />
                    <PomodoroStep label={BREAK} length={state.breakTime} onClick={(lengthChange) => handleStepLength(BREAK, lengthChange)} />
                </div>
            </div>
            <audio id="beep" src="soft-bells.mp3" ref={alarmAudio}></audio>
        </div>
    )
}

export default PomodoroClockHook;