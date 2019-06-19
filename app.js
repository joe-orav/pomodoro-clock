const SESSION = "Session";
const BREAK = "Break";

const PomodoroStep = props => {
    let stepToLower = props.step.toLowerCase();

    return (
        <p id={stepToLower + "-label"}>
            {"Set " + props.step + " Length"} 
            <a href="#" id={stepToLower + "-increment"}>+</a>
                <span id={stepToLower + "-length"}>{props.stepLength}</span>
            <a href="#" id={stepToLower + "-decrement"}>-</a>
        </p>
    )
}

class PomodoroClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRemaining: "25:00",
            sessionLength: 25,
            breakLength: 5,
            step: SESSION
        }
    }

    render() {
        return (
            <div id="app-container">
                <div id="timer-display">
                    <h2 id="timer-label">{this.state.step}</h2>
                    <p id="time-left">{this.state.timeRemaining}</p>
                </div>
                <div id="timer-controls">
                    <button id="start_stop">Start/Stop</button>
                    <button id="reset">Reset</button>
                </div>
                <div id="steps">
                    <PomodoroStep step={SESSION} stepLength={this.state.sessionLength}/>
                    <PomodoroStep step={BREAK} stepLength={this.state.breakLength}/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<PomodoroClock />, document.getElementById("app-root"));