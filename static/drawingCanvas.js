/**
 * A class for creating a drawing canvas within a specified parent element.
 */
class DrawingCanvas {
    /**
     * Creates a new DrawingCanvas instance.
     *
     * @param {string} parentDivClass - CSS selector for the parent div element.
     * @param {string} canvasColor - Background color of the canvas.
     * @param {string} strokeStyle - Color of the drawing stroke.
     */
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
    
    /**
     * Adjusts the container's styles for proper canvas display.
     * @private
     */
    #adjustContainer(){
        this.canvasContainer.style.position = 'relative';
        this.canvasContainer.style.overflow = 'hidden';
    }

    /**
     * Creates the canvas element and appends it to the container.
     * @private
     */
    #createCanvas(){
        this.canvas = document.createElement('canvas');
        this.canvasContainer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Resizes the canvas to fit the container and clears it.
     * @private
     */
    #resizeCanvas(){
        this.canvas.width = this.canvasContainer.clientWidth;
        this.canvas.height = this.canvasContainer.clientHeight;
        this.clearCanvas();
    }

    /**
     * Creates event listeners for drawing.
     * @private
     */
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

    /**
     * Clears the canvas with the specified background color.
     */
    clearCanvas(){
        this.ctx.fillStyle = this.canvasColor; // set white background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Begins the drawing process.
     * @private
     * @param {MouseEvent|TouchEvent} event - The event object.
     */
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

    /**
     * Draws on the canvas.
     * @private
     * @param {MouseEvent|TouchEvent} event - The event object.
     */
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
    
    /**
     * Ends the drawing process.
     * @private
     */
    #endDraw(){
        this.userIsDrawing = false;
        this.onDrawEnd();
    }

    /**
     * Called when drawing begins. Can be overridden to add custom functionality.
     */
    onDrawBegin(){}

    /**
     * Called when drawing ends. Can be overridden to add custom functionality.
     */
    onDrawEnd(){}
}

export default DrawingCanvas;