import DrawingCanvas from './drawingCanvas.js';

class TimedDrawingCanvas extends DrawingCanvas {
    constructor(parentDivClass, canvasColor, strokeStyle, timeLimit = 3000) {
        
        super(parentDivClass, canvasColor, strokeStyle);

        this.timer; // stores the timer value
        this.timeLimit = timeLimit;
    }

    onDrawBegin(){
        this.#timerReset(false);
    }
    onDrawEnd(){
        this.#timerReset(true);
    }

    #timerReset(startNewTimer) {
        if (this.timer) {
            clearTimeout(this.timer); // clear existing timer
        }
        if (startNewTimer == true){
            this.timer = setTimeout(this.#timerEnd.bind(this), this.timeLimit); // start new timer
        }
    }

    #timerEnd(){
        this.clearCanvas();
    }

}

document.addEventListener("DOMContentLoaded", function () {
    const canvasInstance = new TimedDrawingCanvas(".drawingCanvas", "white", "black");
    // window.DrawingCanvas = DrawingCanvas; // Expose the class globally
    // window.TimedDrawingCanvas = TimedDrawingCanvas; // Expose the class globally
});