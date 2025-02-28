class DrawingCanvas {
    constructor(parentDivClass, canvasColor, strokeStyle) {
        
        this.canvasContainer = document.querySelector(parentDivClass);
        this.canvasColor = canvasColor;
        this.strokeStyle = strokeStyle;
        this.userIsDrawing = false;

        this.#adjustContainer();
        this.#createCanvas();
        this.#resizeCanvas();
        this.#createEventListeners();

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

    #createEventListeners(){
        // Event listeners for touchscreen
        window.addEventListener("resize", this.#resizeCanvas.bind(this));
        this.canvas.addEventListener("touchstart", this.#beginDraw.bind(this), { passive: false });
        this.canvas.addEventListener("touchmove", this.#draw.bind(this), { passive: false });
        this.canvas.addEventListener("touchend", this.#endDraw.bind(this));

        // Event listeners for mouse
        this.canvas.addEventListener("mousedown", this.#beginDraw.bind(this), { passive: false });
        this.canvas.addEventListener("mousemove", this.#draw.bind(this), { passive: false });
        this.canvas.addEventListener("mouseup", this.#endDraw.bind(this));
    }

    clearCanvas(){
        this.ctx.fillStyle = this.canvasColor; // set white background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    #beginDraw(event){
        event.preventDefault(); // prevent scrolling

        let x, y;
        if (event.touches) {
            // Handle touch event
            const touch = event.touches[0];
            x = touch.clientX;
            y = touch.clientY;
        } else {
            // Handle mouse event
            x = event.clientX;
            y = event.clientY;
        }

        const rect = this.canvas.getBoundingClientRect();
        this.ctx.beginPath();
        this.ctx.moveTo(x - rect.left, y - rect.top);
        this.userIsDrawing = true;
        this.onDrawBegin();
    }

    #draw(event){
        if (!this.userIsDrawing) return;

        event.preventDefault(); // prevent default action (like scrolling)

        let x, y;
        if (event.touches) {
            // Handle touch event
            const touch = event.touches[0];
            x = touch.clientX;
            y = touch.clientY;
        } else {
            // Handle mouse event
            x = event.clientX;
            y = event.clientY;
        }

        const rect = this.canvas.getBoundingClientRect();
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineTo(x - rect.left, y - rect.top);
        this.ctx.stroke();
    }
    
    #endDraw(){
        this.userIsDrawing = false;
        this.onDrawEnd();
    }

    // These methods are left here for the user
    // to extend functionality with a superclass
    onDrawBegin(){}
    onDrawEnd(){}
}

export default DrawingCanvas;