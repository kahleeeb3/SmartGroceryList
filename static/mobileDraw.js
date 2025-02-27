function enableDrawing(){
    const canvasContainer = document.querySelector(".canvas");
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");

    // Resize canvas to fit parent div
    function resizeCanvas() {
        // set canvas background
        canvas.width = canvasContainer.clientWidth;
        canvas.height = canvasContainer.clientHeight;

        // set white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas); // window resize

    let drawTimer; // store draw timer
    let drawTimerLimit = 3000; // 3 seconds

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
        ctx.lineTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
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
        // capture image data
        const imageData = canvas.toDataURL();
        
        // Send data back to the flask server
        fetch('process_canvas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

        // clear canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    canvas.addEventListener("touchstart", beginDraw, { passive: false });
    canvas.addEventListener("touchend", endDraw);
}

// Listen for all content to be loaded
document.addEventListener("DOMContentLoaded", enableDrawing);