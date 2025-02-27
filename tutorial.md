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