import tkinter as tk

class App:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Handwriting Recognition with TrOCR")
        self.root.geometry("1280x720")


class Frames(App):
    def __init__(self):
        # Initialize the parent class
        super().__init__()

        # define the grid system (1 row and 2 columns)
        self.root.rowconfigure(0, weight=1)
        self.root.columnconfigure(0, weight=1)
        self.root.columnconfigure(1, weight=4) #right column is 4x thicker
        
        # place frames in the grid
        self.create_left_frame()
        self.create_right_frame()

    def create_left_frame(self):
        #left frame is where text is stored
        left_frame = tk.Frame(self.root, bg='green')
        left_frame.grid(row=0, column=0, sticky="nsew")
        self.left_frame = left_frame

    def create_right_frame(self):
        # right frame is where the user will be able to write
        right_frame = tk.Frame(self.root, bg='red')
        right_frame.grid(row=0, column=1, sticky="nsew")
        self.right_frame = right_frame

class Widgets(Frames):
    def __init__(self, callback):
        # Initialize the parent class
        super().__init__()

        #define grid system in left and right frames (1 row and 1 column)
        self.right_frame.rowconfigure(0, weight=1)
        self.right_frame.columnconfigure(0, weight=1)
        self.left_frame.rowconfigure(0, weight=1)
        self.left_frame.columnconfigure(0, weight=1)

        #place widgets in the frames
        self.create_canvas()
        self.create_list()
        self.callback = callback # external function

    def create_list(self):
        self.list = tk.Listbox(self.left_frame, font=('Helvetica', 15))
        self.list.grid(row=0, column=0, sticky="nsew")

        # add some random values for now
        i = 0
        while(i < 100):
            self.list.insert(i, f'Temp {i}')
            i += 1

    def create_canvas(self):
        self.canvas = tk.Canvas(self.right_frame, bg="white")
        self.canvas.grid(row=0, column=0, sticky="nsew")

        def clear():

            # save the image
            self.canvas.update()
            self.callback() # do something with data before clearing screen
            self.canvas.delete("all")

        def reset_timer():
            if hasattr(self, 'timer'):
                self.root.after_cancel(self.timer)
            self.timer = self.root.after(3000, clear)

        def draw(event):
            reset_timer()
            x, y = event.x, event.y
            self.canvas.create_oval(x-2, y-2, x+2, y+2, fill="black", outline="black", tags='writing')

        self.canvas.bind("<B1-Motion>", draw)
             
