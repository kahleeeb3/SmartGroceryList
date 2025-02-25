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