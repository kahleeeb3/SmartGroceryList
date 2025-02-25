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
    window.addEventListener("resize", resizeCanvas);

    let drawing = false;

    canvas.addEventListener("mousedown", (event) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    });

    canvas.addEventListener("mousemove", (event) => {
        if (!drawing) return;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    });

    canvas.addEventListener("mouseup", () => {
        drawing = false;
    });

    canvas.addEventListener("mouseleave", () => {
        drawing = false;
    });
});