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
        ctx.beginPath();
        ctx.moveTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
        canvas.addEventListener("touchmove", draw, { passive: true }); // passive prevents scroll
        drawTimerReset();
    }

    function endDraw(){
        canvas.removeEventListener("touchmove", draw);
        drawTimerReset();
    }

    function draw(event){
        const touch = event.touches[0];
        ctx.lineTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
        ctx.stroke();
    }

    function drawTimerReset() {
        // clear existing timer
        if (drawTimer) {
            clearTimeout(drawTimer);
        }
        drawTimer = setTimeout(drawTimerEnd, drawTimerLimit);
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
        // .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

        // clear canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    canvas.addEventListener("touchstart", beginDraw, { passive: true }); // passive prevents scroll
    canvas.addEventListener("touchend", endDraw);
}

// Listen for all content to be loaded
document.addEventListener("DOMContentLoaded", enableDrawing);