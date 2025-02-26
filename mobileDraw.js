function sendData(data){
    // Create a WebSocket client connection to the Python server
    const socket = new WebSocket('ws://localhost:8765');

    // Event listener for when the WebSocket connection opens
    socket.addEventListener('open', function (event) {
        console.log('Client: Connected');
        socket.send(data);
        console.log(`Client: Data Sent`);
    });

    // Event listener for receiving messages from the server
    socket.addEventListener('message', function (event) {
        console.log(`Server: ${event.data}`);
        socket.close(); // close the socket when you're done with it
    });

    // Close the socket when the message is sent
    socket.addEventListener('close', function () {
        console.log('Client: WebSocket Closed');
    });
}

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
        event.preventDefault(); // prevent default touch behavior (scrolling, etc.)
        const touch = event.touches[0];
        ctx.beginPath();
        ctx.moveTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
        canvas.addEventListener("touchmove", draw);
        drawTimerReset();
    }

    function endDraw(){
        canvas.removeEventListener("touchmove", draw);
        drawTimerReset();
    }

    function draw(event){
        event.preventDefault(); // prevent default touch behavior
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
        sendData(imageData);

        // clear canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    canvas.addEventListener("touchstart", beginDraw);
    canvas.addEventListener("touchend", endDraw);
}

// Listen for all content to be loaded
document.addEventListener("DOMContentLoaded", enableDrawing);