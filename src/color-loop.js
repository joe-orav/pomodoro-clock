import $ from "jquery-min";

function colorLoopControl() {
    const RAINBOW_LOOP = "color-loop-animation";
    const RED_LOOP = "red-color-loop-animation";
    
    let activeColorLoopClass = RAINBOW_LOOP;
    let timerRunning = false;

    $("#start_stop").click(function () {
        $("#root").toggleClass(activeColorLoopClass);
        timerRunning = !timerRunning;
    });

    $("#reset").click(function () {
        $("#root").removeClass(RED_LOOP).removeClass(RAINBOW_LOOP);
        activeColorLoopClass = RAINBOW_LOOP;
        timerRunning = false;
    });

    setInterval(function () {
        let timeLeft = parseInt($("#time-left").text());

        if(timerRunning) {
            if (timeLeft === 0) {
                $("#root").removeClass(RAINBOW_LOOP).addClass(RED_LOOP);
                activeColorLoopClass = RED_LOOP;
            } else if(timeLeft > 0) {
                $("#root").removeClass(RED_LOOP).addClass(RAINBOW_LOOP);
                activeColorLoopClass = RAINBOW_LOOP;
            }
        } else {
            if (timeLeft === 0) {
                activeColorLoopClass = RED_LOOP;
            } else if(timeLeft > 0) {
                activeColorLoopClass = RAINBOW_LOOP;
            }
        }
    }, 100)
}

export default colorLoopControl