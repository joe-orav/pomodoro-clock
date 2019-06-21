const SESSION = "Session";
const BREAK = "Break";

let intervalId;
let alarmAudio;

const PomodoroStep = props => {
    var labelToLower = props.label.toLowerCase();

    return (
        <div>
            <p id={labelToLower + "-label"}>{"Set " + props.label + " Length"}</p>
            <button id={labelToLower + "-increment"} onClick={() => props.onClick(1)}>+</button>
            <p id={labelToLower + "-length"}>{props.length}</p>
            <button id={labelToLower + "-decrement"} onClick={() => props.onClick(-1)}>-</button>
        </div>
    )
}

class PomodoroClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerRunning: false,
            label: SESSION,
            sessionTime: 25,
            breakTime: 5,
            timeRemaining: formatTime(25)
        }
        this.handleTimerState = this.handleTimerState.bind(this);
        this.handleTimerUpdate = this.handleTimerUpdate.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleTimerSettings = this.handleTimerSettings.bind(this);
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

        if (minutes == 0 && seconds == 1) {
            alarmAudio.play();
            alarmAudio.currentTime = 0;
        }

        if (minutes == 0 && seconds == 0) {
            switch (this.state.label) {
                case SESSION:
                    this.setState({
                        label: BREAK,
                        timeRemaining: formatTime(this.state.breakTime)
                    })
                    break;
                case BREAK:
                    this.setState({
                        label: SESSION,
                        timeRemaining: formatTime(this.state.sessionTime)
                    })
            }
        } else {
            if (seconds == 0) {
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
        alarmAudio.pause();
        alarmAudio.currentTime = 0;

        this.setState({
            timerRunning: false,
            label: SESSION,
            sessionTime: 25,
            breakTime: 5,
            timeRemaining: formatTime(25)
        });

        clearInterval(intervalId);
    }

    handleTimerSettings(step, lengthChange) {
        if (!this.state.timerRunning) {
            switch (step) {
                case SESSION:
                    this.setState({
                        sessionTime: setTimeLength(this.state.sessionTime, lengthChange),
                        timeRemaining: this.state.label == SESSION ? formatTime(setTimeLength(this.state.sessionTime, lengthChange)) : this.state.timeRemaining
                    });
                    break;
                case "Break":
                    this.setState({
                        breakTime: setTimeLength(this.state.breakTime, lengthChange),
                        timeRemaining: this.state.label == BREAK ? formatTime(setTimeLength(this.state.breakTime, lengthChange)) : this.state.timeRemaining
                    });
            }
        }
    }

    componentDidMount() {
        alarmAudio = document.getElementById("beep");
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
                    <PomodoroStep label={SESSION} length={this.state.sessionTime} onClick={(lengthChange) => this.handleTimerSettings(SESSION, lengthChange)} />
                    <PomodoroStep label={BREAK} length={this.state.breakTime} onClick={(lengthChange) => this.handleTimerSettings(BREAK, lengthChange)} />
                </div>
                <audio id="beep" src="soft-bells.mp3"></audio>
            </div>
        )
    }
}

function setTimeLength(length, lengthChange) {
    switch (length) {
        case 1:
            return lengthChange === -1 ? length : length + lengthChange;
        case 60:
            return lengthChange === 1 ? length : length + lengthChange;
        default:
            return length + lengthChange;
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