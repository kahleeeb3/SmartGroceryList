function addListItem(){
    let input = document.getElementById("itemInput");
    let list = document.getElementById("myList");

    // Ensure input is not empty
    if (input.value.trim() !== "") {
        // Create a new list item
        let li = document.createElement("li");
        li.textContent = input.value;

        // Append to the list
        list.appendChild(li);

        // Clear the input field
        input.value = "";
    }
}

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
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
        canvas.addEventListener("mousemove", draw);
        drawTimerReset();
    }

    function endDraw(){
        canvas.removeEventListener("mousemove", draw);
        drawTimerReset();
    }

    function draw(event){
        ctx.lineTo(event.offsetX, event.offsetY);
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

    canvas.addEventListener("mousedown", beginDraw);
    canvas.addEventListener("mouseup", endDraw);
}

// Listen for all content to be loaded
document.addEventListener("DOMContentLoaded", enableDrawing);