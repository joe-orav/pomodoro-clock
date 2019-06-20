let intervalId;


const PomodoroStep = props => {
    var labelToLower = props.label.toLowerCase();

    return (
        <div>
            <p id={labelToLower + "-label"}>{"Set " + props.label + " Length"}</p>
            <button id={labelToLower + "-increment"}>+</button>
            <p id={labelToLower + "-length"}>{props.length}</p>
            <button id={labelToLower + "-decrement"}>-</button>
        </div>
    )
}

class PomodoroClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerRunning: false,
            label: "Session",
            sessionTime: 25,
            breakTime: 5,
            timeRemaining: formatTime(25)
        }
        this.handleTimerState = this.handleTimerState.bind(this);
        this.handleTimerUpdate = this.handleTimerUpdate.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleTimerState() {
        if (this.state.timerRunning) {
            this.setState({
                timerRunning: false
            });
            clearInterval(intervalId);
        } else {
            this.setState({
                timerRunning: true
            });
            intervalId = setInterval(this.handleTimerUpdate, 1000);
        }
    }

    handleTimerUpdate() {
        let timeArr = this.state.timeRemaining.split(":");
        let minutes = Number.parseInt(timeArr[0]);
        let seconds = Number.parseInt(timeArr[1]);

        if (minutes == 0 && seconds == 0) {
            switch (this.state.label) {
                case "Session":
                    this.setState({
                        label: "Break",
                        timeRemaining: formatTime(this.state.breakTime)
                    })
                    break;
                case "Break":
                    this.setState({
                        label: "Session",
                        timeRemaining: formatTime(this.state.sessionTime)
                    })
            }
        } else {
            if(seconds == 0) {
                seconds = 59;
                minutes -= 1;
            } else {
                seconds -= 1;
            }

            this.setState({
                timeRemaining: formatTime(minutes, seconds)
            })
        }
    }

    handleReset() {
        this.setState({
            timerRunning: false,
            label: "Session",
            sessionTime: 25,
            breakTime: 5,
            timeRemaining: formatTime(25)
        });

        clearInterval(intervalId);
    }

    render() {
        return (
            <div id="app-container">
                <div id="timer-display">
                    <h2 id="timer-label">{this.state.label}</h2>
                    <p id="time-left">{this.state.timeRemaining}</p>
                </div>
                <div id="timer-controls">
                    <button id="start_stop" onClick={this.handleTimerState}>Start/Stop</button>
                    <button id="reset" onClick={this.handleReset}>Reset</button>
                </div>
                <div id="steps">
                    <PomodoroStep label="Session" length={this.state.sessionTime}/>
                    <PomodoroStep label="Break" length={this.state.breakTime}/>
                </div>
            </div>
        )
    }
}

function setTimeLength(value, increment) {
    switch (value) {
        case 1:
            return increment ? value + 1 : value;
        case 60:
            return increment ? value : value - 1;
        default:
            return increment ? value + 1 : value - 1;
    }
}

function formatTime(minutes, seconds = "00") {
    if (minutes < 10 && minutes !== "00") {
        minutes = "0" + minutes;
    }

    if (seconds < 10 && seconds !== "00") {
        seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
}

ReactDOM.render(<PomodoroClock />, document.getElementById("app-root"));