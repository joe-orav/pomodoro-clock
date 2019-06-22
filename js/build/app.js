var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SESSION = "Session";
var BREAK = "Break";

var intervalId = void 0;
var alarmAudio = void 0;

var PomodoroStep = function PomodoroStep(props) {
    var labelToLower = props.label.toLowerCase();

    return React.createElement(
        "div",
        { className: "time-length-container" },
        React.createElement(
            "p",
            { id: labelToLower + "-label", className: "control-label" },
            "Set " + props.label + " Length:"
        ),
        React.createElement(
            "div",
            { className: "time-length-controls" },
            React.createElement(
                "button",
                { id: labelToLower + "-increment", className: "control-btn", onClick: function onClick() {
                        return props.onClick(1);
                    } },
                "\u25B2"
            ),
            React.createElement(
                "p",
                { id: labelToLower + "-length", className: "time-length" },
                props.length
            ),
            React.createElement(
                "button",
                { id: labelToLower + "-decrement", className: "control-btn", onClick: function onClick() {
                        return props.onClick(-1);
                    } },
                "\u25BC"
            )
        )
    );
};

var PomodoroClock = function (_React$Component) {
    _inherits(PomodoroClock, _React$Component);

    function PomodoroClock(props) {
        _classCallCheck(this, PomodoroClock);

        var _this = _possibleConstructorReturn(this, (PomodoroClock.__proto__ || Object.getPrototypeOf(PomodoroClock)).call(this, props));

        _this.state = {
            timerRunning: false,
            label: SESSION,
            sessionTime: 25,
            breakTime: 5,
            timeRemaining: formatTime(25)
        };
        _this.handleTimerState = _this.handleTimerState.bind(_this);
        _this.handleTimerUpdate = _this.handleTimerUpdate.bind(_this);
        _this.handleReset = _this.handleReset.bind(_this);
        _this.handleTimerSettings = _this.handleTimerSettings.bind(_this);
        return _this;
    }

    _createClass(PomodoroClock, [{
        key: "handleTimerState",
        value: function handleTimerState() {
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
    }, {
        key: "handleTimerUpdate",
        value: function handleTimerUpdate() {
            var timeArr = this.state.timeRemaining.split(":");
            var minutes = parseInt(timeArr[0]);
            var seconds = parseInt(timeArr[1]);

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
                        });
                        break;
                    case BREAK:
                        this.setState({
                            label: SESSION,
                            timeRemaining: formatTime(this.state.sessionTime)
                        });
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
                });
            }
        }
    }, {
        key: "handleReset",
        value: function handleReset() {
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
    }, {
        key: "handleTimerSettings",
        value: function handleTimerSettings(step, lengthChange) {
            var _this2 = this;

            if (!this.state.timerRunning) {
                switch (step) {
                    case SESSION:
                        this.setState({
                            sessionTime: setTimeLength(this.state.sessionTime, lengthChange)
                        }, function () {
                            return _this2.setState({ timeRemaining: _this2.state.label == SESSION ? formatTime(_this2.state.sessionTime) : _this2.state.timeRemaining });
                        });
                        break;
                    case "Break":
                        this.setState({
                            breakTime: setTimeLength(this.state.breakTime, lengthChange)
                        }, function () {
                            return _this2.setState({ timeRemaining: _this2.state.label == BREAK ? formatTime(_this2.state.breakTime) : _this2.state.timeRemaining });
                        });
                }
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            alarmAudio = document.getElementById("beep");
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return React.createElement(
                "div",
                { id: "app-container" },
                React.createElement(
                    "h1",
                    { id: "app-header" },
                    "Pomodoro Clock"
                ),
                React.createElement(
                    "div",
                    { id: "timer-display" },
                    React.createElement(
                        "h2",
                        { id: "timer-label" },
                        this.state.label
                    ),
                    React.createElement(
                        "p",
                        { id: "time-left" },
                        this.state.timeRemaining
                    )
                ),
                React.createElement(
                    "div",
                    { id: "timer-controls" },
                    React.createElement(
                        "button",
                        { id: "start_stop", className: "timer-btn", onClick: this.handleTimerState },
                        React.createElement("img", { src: this.state.timerRunning ? "./img/pause.png" : "./img/play.png" })
                    ),
                    React.createElement(
                        "button",
                        { id: "reset", className: "timer-btn", onClick: this.handleReset },
                        React.createElement("img", { src: "./img/reload.png" })
                    )
                ),
                React.createElement(
                    "div",
                    { id: "steps" },
                    React.createElement(PomodoroStep, { label: SESSION, length: this.state.sessionTime, onClick: function onClick(lengthChange) {
                            return _this3.handleTimerSettings(SESSION, lengthChange);
                        } }),
                    React.createElement(PomodoroStep, { label: BREAK, length: this.state.breakTime, onClick: function onClick(lengthChange) {
                            return _this3.handleTimerSettings(BREAK, lengthChange);
                        } })
                ),
                React.createElement("audio", { id: "beep", src: "soft-bells.mp3" })
            );
        }
    }]);

    return PomodoroClock;
}(React.Component);

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

function formatTime(minutes) {
    var seconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "00";

    if (minutes < 10 && minutes !== "00") {
        minutes = "0" + minutes;
    }

    if (seconds < 10 && seconds !== "00") {
        seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
}

ReactDOM.render(React.createElement(PomodoroClock, null), document.getElementById("app-root"));