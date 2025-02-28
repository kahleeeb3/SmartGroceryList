import DrawingCanvas from './drawingCanvas.js';

class TimedDrawingCanvas extends DrawingCanvas {
    constructor(parentDivClass, canvasColor, strokeStyle, timeLimit = 3000) {
        
        super(parentDivClass, canvasColor, strokeStyle);

        this.timer; // stores the timer value
        this.timeLimit = timeLimit;
        this.timerEnd = this.timerEnd.bind(this); // Bind the timerEnd method to this instance
    }

    onDrawBegin(){
        this.timerReset(false);
    }
    onDrawEnd(){
        this.timerReset(true);
    }

    timerReset(startNewTimer) {
        if (this.timer) {
            clearTimeout(this.timer); // clear existing timer
        }
        if (startNewTimer == true){
            this.timer = setTimeout(this.timerEnd, this.timeLimit); // start new timer
        }
    }

    timerEnd(){
        console.log("Timer Ended");
    }

}

document.addEventListener("DOMContentLoaded", function () {
    // const canvasInstance = new TimedDrawingCanvas(".drawingCanvas", "white", "black");
    window.TimedDrawingCanvas = TimedDrawingCanvas; // Expose the class globally
});