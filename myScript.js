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

document.addEventListener("DOMContentLoaded", function() {
    const canvasContainer = document.querySelector(".canvas");
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");

    // Resize canvas to fit parent div
    function resizeCanvas() {
        canvas.width = canvasContainer.clientWidth;
        canvas.height = canvasContainer.clientHeight;
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
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    }

    canvas.addEventListener("mousedown", beginDraw);
    canvas.addEventListener("mouseup", endDraw);
});
