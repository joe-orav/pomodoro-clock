const SESSION = "Session";
const BREAK = "Break";

let intervalId;

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
            step: SESSION,
            timerRunning: false
        }
        this.handleTimerState = this.handleTimerState.bind(this);
        this.handleTimerUpdate = this.handleTimerUpdate.bind(this);
    }

    handleTimerState() {
        if(this.state.timerRunning) {
            clearInterval(intervalId);
            this.setState({
                timerRunning: false
            });
        } else {
            this.setState({
                timerRunning: true
            });
            intervalId = setInterval(this.handleTimerUpdate, 1000);
        }
    }

    handleTimerUpdate() {
        let timerArr = this.state.timeRemaining.split(":");
        var minutes = Number.parseInt(timerArr[0]);
        var seconds = Number.parseInt(timerArr[1]);
        
        if(minutes == 0 && seconds == 0) {
            clearInterval(intervalId);
        } else if(seconds == 0) {
            seconds = 59;
            minutes -= 1;
        } else {
            seconds -= 1;
        }

        minutes = minutes < 10 ? "0" + minutes: minutes;
        seconds = seconds < 10 ? "0" + seconds: seconds;
    
        this.setState({
            timeRemaining: minutes + ":" + seconds
        })
    }

    render() {
        return (
            <div id="app-container">
                <div id="timer-display">
                    <h2 id="timer-label">{this.state.step}</h2>
                    <p id="time-left">{this.state.timeRemaining}</p>
                </div>
                <div id="timer-controls">
                    <button id="start_stop" onClick={this.handleTimerState}>Start/Stop</button>
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