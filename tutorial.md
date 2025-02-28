# Basic Grid
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="myStyle.css">
    </head>

    <body>
        <div></div>
        <div></div>        
    </body>
</html>
```
```css
/* myStyle.css */
body{
    /* make body fill display */
    background-color: blue;
    margin: 0;
    height: 100vh;
    width: 100vw;
    max-height: 100vh; /* body cant extend the window */

    /* setup the grid system */
    display: grid;
    grid-template-columns: 30% 70%; /* two columns */
}
body > div {
    background-color: red;
    padding: 10px;
    border: 2px solid black;
    margin: 5px;
}
```
## How can I make an event listeners call a private method in a javascript class?
```js
class MyClass{
    constructor(){
        window.addEventListener("mousedown", this.#somethingPrivate);
        this.someValue = "myValue"
    }
    #somethingPrivate(){
        console.log(this.someValue);
    }
}
new MyClass();
```
So I want to create a class that listens for when the user clicks their mouse and then executes a private function in the class that will print some value. However, event listeners, by default, call their handlers with `this` set to the element that triggered the event. So in `console.log(this.someValue);` the `this` is going to refer to the `window` and not the instance of `MyClass`.

The most straightforward way to fix this is to use the `bind` method to explicitly set the `this` context of `#somethingPrivate` to the `MyClass` instance.
```js
class MyClass{
    constructor(){
        window.addEventListener("mousedown", this.#somethingPrivate.bind(this));
        this.someValue = "myValue"
    }
    #somethingPrivate(){
        console.log(this.someValue);
    }
}
new MyClass();
```
Chat GPT suggested that I do this:
```js
class MyClass{
    constructor(){
        this._somethingPrivate = this.#somethingPrivate.bind(this);
        window.addEventListener("mousedown", this._somethingPrivate);
        this.someValue = "myValue"
    }
    #somethingPrivate(){
        console.log(this.someValue);
    }
}
new MyClass();
```
This is stupid because you're assigning the bind to a public variable so the user will still see `myClassInstance._somethingPrivate()` as a public method...

# Private Data Within a Class
```js
class MyClass{
    #internalData;
    constructor(){
        this.externalData = 26;
        this.#internalData = 5;
    }
}
test = new MyClass();
console.log(test.externalData);
console.log(test.#internalData); // SyntaxError during parsing, not a runtime error
```
