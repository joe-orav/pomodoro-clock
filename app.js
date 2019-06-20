const SESSION = {label: "Session", time: 25};
const BREAK = {label: "Break", time: 5};

let intervalId;

const PomodoroStep = props => {
    let stepToLower = props.step.label.toLowerCase();

    return (
        <p id={stepToLower + "-label"}>
            {"Set " + props.step.label + " Length"} 
            <a href="#" id={stepToLower + "-increment"} onClick={() => props.onClick(true)}>+</a>
                <span id={stepToLower + "-length"}>{props.step.time}</span>
            <a href="#" id={stepToLower + "-decrement"} onClick={() => props.onClick(false)}>-</a>
        </p>
    )
}

class PomodoroClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRemaining: "25:00",
            step: SESSION,
            timerRunning: false
        }
        this.handleTimerState = this.handleTimerState.bind(this);
        this.handleTimerUpdate = this.handleTimerUpdate.bind(this);
        this.handleTimerSettings = this.handleTimerSettings.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleTimerState() {
        if(this.state.timerRunning) {
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
        let timerArr = this.state.timeRemaining.split(":");
        var minutes = Number.parseInt(timerArr[0]);
        var seconds = Number.parseInt(timerArr[1]);
        
        if(minutes == 0 && seconds == 0) {
            var nextStep = this.state.step == SESSION ? BREAK: SESSION;
            var currentTimeRemaining = nextStep.time;
            
            this.setState({
                step: nextStep,
                timeRemaining: (currentTimeRemaining < 10 ? "0" + currentTimeRemaining : currentTimeRemaining) + ":00"
            });

        } else {
            if(seconds == 0) {
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
    }

    handleTimerSettings(step, increment) {

        // let newLength;

        // if(!this.state.timerRunning) {
        //     if(step == SESSION) {
        //         newLength = this.setTimeLength(this.state.sessionLength, increment);

        //         this.setState({
        //             sessionLength: newLength,
        //         })

        //     } else if(step == BREAK) {
        //         newLength = this.setTimeLength(this.state.breakLength, increment);

        //         this.setState({
        //             breakLength: newLength
        //         })
        //     }

        //     this.setState({
        //         timeRemaining: (newLength < 10 ? "0" + newLength: newLength) + ":00"
        //     })
        // }



    }

    handleReset() {
        this.setState({
            timeRemaining: "25:00",
            sessionLength: 25,
            breakLength: 5,
            step: SESSION,
            timerRunning: false
        });
    }

    setTimeLength(value, increment) {
        switch(value) {
            case 1:
                return increment ? value + 1: value;
            case 60:
                return increment ? value: value - 1;
            default:
                return increment ? value + 1: value - 1;
        }
    }

    render() {
        return (
            <div id="app-container">
                <div id="timer-display">
                    <h2 id="timer-label">{this.state.step.label}</h2>
                    <p id="time-left">{this.state.timeRemaining}</p>
                </div>
                <div id="timer-controls">
                    <button id="start_stop" onClick={this.handleTimerState}>Start/Stop</button>
                    <button id="reset" onClick={this.handleReset}>Reset</button>
                </div>
                <div id="steps">
                    <PomodoroStep step={SESSION} onClick={(increment) => this.handleTimerSettings(SESSION, increment)}/>
                    <PomodoroStep step={BREAK} onClick={(increment) => this.handleTimerSettings(BREAK, increment)}/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<PomodoroClock />, document.getElementById("app-root"));