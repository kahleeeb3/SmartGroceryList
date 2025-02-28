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
        this.#drawBoundingBox();
        this.#extractCanvasData();
        this.#sendData();
        this.resetBoundingBox();
    }

    #drawBoundingBox(){
        // define bounding box params
        const pad = 10; // padding around bounding box
        this.boundX = this.minX - pad;
        this.boundY = this.minY - pad;
        this.boundWidth = this.maxX - this.minX + 2 * pad;
        this.boundHeight = this.maxY - this.minY + 2 * pad;

        // draw box
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.boundX - 1, this.boundY - 1, this.boundWidth + 2, this.boundHeight + 2); // add slightly more padding
    }

    #extractCanvasData(){
        // Copy section of original canvas to a new canvas and extract data
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = this.boundWidth;
        croppedCanvas.height = this.boundHeight;
        croppedCtx.drawImage(
            this.canvas, // source canvas
            this.boundX, this.boundY, this.boundWidth, this.boundHeight, // source area
            0, 0, this.boundWidth, this.boundHeight // where to draw on cropped canvas
        );

        this.canvasData = croppedCanvas.toDataURL();
    }

    #sendData(){
        // Send data back to the flask server
        fetch('process_canvas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ image: canvas.toDataURL() }) // send whole canvas
            body: JSON.stringify({ image: this.canvasData }) // send cropped canvas
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.#addToList(data.recognized_text);
            this.clearCanvas();
        })
        .catch(error => console.error('Error:', error));
    }

    #addToList(itemText){
        const myList = document.querySelector('.groceryList'); //select the list
        const newListItem = document.createElement('li');
        newListItem.textContent = itemText;
        myList.appendChild(newListItem);
    }

}

document.addEventListener("DOMContentLoaded", function () {
    const canvasInstance = new TimedDrawingCanvas(".drawingCanvas", "black", "white");
    // window.DrawingCanvas = DrawingCanvas; // Expose the class globally
    // window.TimedDrawingCanvas = TimedDrawingCanvas; // Expose the class globally
});