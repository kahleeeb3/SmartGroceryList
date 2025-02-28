# SmartGroceryList
> Idea: Python Flask server that allows users to write grocery list items on the screen. Image data is converted to text and added to a list. 

> Bonus idea: have a discord bot manage the list that way you can see a copy of the list on your phone

# Run Flask Web Server
```
python main.py localhost 8000
```

```
pip install flask
pip install 'transformers[torch]'
pip install pillow
```

# Python Virtual Environment on Windows
```
python -m venv env
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
env\Scripts\activate.bat
```

# To Do
- Reset timer does not work as expected
- canvas is causing scroll bars when it should not
- crop the canvas before processing to improve accuracy