class DrawingCanvas {
    constructor(parentDivClass, canvasColor, strokeStyle) {
        
        this.canvasContainer = document.querySelector(parentDivClass);
        this.canvasColor = canvasColor;
        this.strokeStyle = strokeStyle;
        this.userIsDrawing = false;

        this.#adjustContainer();
        this.#createCanvas();
        this.#resizeCanvas();

        // Bound methods to keep the correct `this`
        this._resizeCanvas = this.#resizeCanvas.bind(this);
        this._beginDraw = this.#beginDraw.bind(this);
        this._draw = this.#draw.bind(this);
        this._endDraw = this.#endDraw.bind(this);

        // Event listeners
        window.addEventListener("resize", this._resizeCanvas);
        this.canvas.addEventListener("touchstart", this._beginDraw, { passive: false });
        this.canvas.addEventListener("touchmove", this._draw, { passive: false });
        this.canvas.addEventListener("touchend", this._endDraw);
    }
    
    #adjustContainer(){
        this.canvasContainer.style.position = 'relative';
        this.canvasContainer.style.overflow = 'hidden';
    }

    #createCanvas(){
        this.canvas = document.createElement('canvas');
        this.canvasContainer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    #resizeCanvas(){
        this.canvas.width = this.canvasContainer.clientWidth;
        this.canvas.height = this.canvasContainer.clientHeight;
        this.clearCanvas();
    }

    clearCanvas(){
        this.ctx.fillStyle = this.canvasColor; // set white background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    #beginDraw(event){
        const touch = event.touches[0];
        event.preventDefault(); // prevent scrolling

        // Get the position of the canvas relative to the viewport
        const rect = this.canvas.getBoundingClientRect();

        this.ctx.beginPath();
        this.ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
        this.userIsDrawing = true;
    }

    #draw(event){
        if (!this.userIsDrawing) return;

        event.preventDefault(); // prevent scrolling
        const touch = event.touches[0];

        // Get the position of the canvas relative to the viewport
        const rect = this.canvas.getBoundingClientRect();

        // where the line is going to
        let x = touch.clientX - rect.left;
        let y = touch.clientY - rect.top;

        // draw the line between point
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
    
    #endDraw(){
        this.userIsDrawing = false;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // const drawing = new DrawingCanvas(".drawingCanvas", "white", "black");
});



/*
function endDraw(){
    canvas.removeEventListener("touchmove", draw);
}

function draw(event){
    const touch = event.touches[0];
    event.preventDefault(); // prevent scrolling

    // Get the position of the canvas relative to the viewport
    const rect = canvas.getBoundingClientRect();
    
    // where the line is going to
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    // draw the line between point
    ctx.strokeStyle = "black";
    ctx.lineTo(x, y);
    ctx.stroke();
}

function beginDraw(event){
    const touch = event.touches[0];
    event.preventDefault(); // prevent scrolling

    // Get the position of the canvas relative to the viewport
    const rect = canvas.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    canvas.addEventListener("touchmove", draw, { passive: false });
}

function clearCanvas(){
    ctx.fillStyle = "white"; // set white background
    ctx.fillRect(0, 0, canvas.width, canvas.height); // clear the screen
}

function resizeCanvas(){
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    clearCanvas();
}

function enableDrawing(){
    // Get the parent div provided
    canvasContainer = document.querySelector(".drawingCanvas");
    
    // adjust the parent to prevent overflow
    canvasContainer.style.position = 'relative';
    canvasContainer.style.overflow = 'hidden';

    // create canvas element
    canvas = document.createElement('canvas');
    canvasContainer.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resizeCanvas();

    // enable interaction with the canvas
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("touchstart", beginDraw, { passive: false });
    canvas.addEventListener("touchend", endDraw);
}


// Listen for all content to be loaded
document.addEventListener("DOMContentLoaded", enableDrawing);
*/