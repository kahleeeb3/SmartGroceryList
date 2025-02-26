# SmartGroceryList
> Idea: Create a client web server that allows users to write grocery list items on the screen. Send image data to a python host server converts handwriting to a text based list. 
> Bonus idea: have a discord bot manage the list that way you can see a copy of the list on your phone

# Run HTML Client Web Server
```
python -m http.server
```

# Python Host Web Server
```
pip install websockets
pip install pillow
pip install 'transformers[torch]'
```

# Python Virtual Environment on Windows
```
python -m venv env
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
env\Scripts\activate.bat
```