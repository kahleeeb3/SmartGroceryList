function enableDrawing(){
    const canvasContainer = document.querySelector(".canvas");
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 1; // lines should be 1 pixel

    function clear_canvas(){
        ctx.fillStyle = "white"; // set white background
        ctx.fillRect(0, 0, canvas.width, canvas.height); // clear the screen
    }
    
    function resizeCanvas() {
        canvas.width = canvasContainer.clientWidth;
        canvas.height = canvasContainer.clientHeight;
        clear_canvas();
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas); // window resize

    let drawTimer; // store draw timer
    let drawTimerLimit = 3000; // 3 seconds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity; // bounding box
    const pad = 10; // padding around bounding box

    function beginDraw(event){
        const touch = event.touches[0];
        event.preventDefault(); // prevent scrolling
        ctx.beginPath();
        ctx.moveTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
        canvas.addEventListener("touchmove", draw, { passive: false });
        drawTimerReset(startNewTimer = false); // clear existing timer, don't start a new one
    }

    function draw(event){
        const touch = event.touches[0];
        event.preventDefault(); // prevent scrolling

        // where the line is going to
        let x = touch.clientX - canvas.offsetLeft;
        let y = touch.clientY - canvas.offsetTop;

        // Update bounding box
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);

        // draw the line between point
        ctx.strokeStyle = "black";
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function endDraw(){
        canvas.removeEventListener("touchmove", draw);
        drawTimerReset(startNewTimer = true); // clear existing timer AND start a new one
    }

    function drawTimerReset(startNewTimer) {
        // clear existing timer
        if (drawTimer) {
            clearTimeout(drawTimer);
        }
        if (startNewTimer == true){
            drawTimer = setTimeout(drawTimerEnd, drawTimerLimit);
        }
    }

    function drawTimerEnd(){

        // define bounding box param
        let boundX = minX-pad;
        let boundY = minY-pad;
        let boundWidth = maxX-minX+2*pad;
        let boundHeight = maxY-minY+2*pad;

        // draw box slight outside the bounding area
        ctx.strokeStyle = "red";
        ctx.strokeRect(boundX-1, boundY-1, boundWidth+2, boundHeight+2);
        
        // Copy section of original canvas to a new canvas and extract data
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = boundWidth;
        croppedCanvas.height = boundHeight;
        croppedCtx.drawImage(
            canvas, // source canvas
            boundX, boundY, boundWidth, boundHeight, // source area
            0, 0, boundWidth, boundHeight // where to draw on cropped canvas
        );
        
        // Send data back to the flask server
        fetch('process_canvas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ image: canvas.toDataURL() }) // send whole canvas
            body: JSON.stringify({ image: croppedCanvas.toDataURL() }) // send cropped canvas
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            clear_canvas();
        })
        .catch(error => console.error('Error:', error));

        // reset bounding box
        minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    }

    canvas.addEventListener("touchstart", beginDraw, { passive: false });
    canvas.addEventListener("touchend", endDraw);
}

// Listen for all content to be loaded
document.addEventListener("DOMContentLoaded", enableDrawing);