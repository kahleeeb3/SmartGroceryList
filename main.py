import tkinter as tk

class DrawingApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Simple Drawing App")
        self.root.geometry("1280x720")
        
        self.canvas = tk.Canvas(self.root, bg="white", width=1280, height=720)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        
        self.canvas.bind("<B1-Motion>", self.draw)
        
        self.reset_timer()
        
    def reset_timer(self):
        if hasattr(self, 'timer'):
            self.root.after_cancel(self.timer)
        self.timer = self.root.after(3000, self.clear_canvas)
        
    def draw(self, event):
        self.reset_timer()
        x, y = event.x, event.y
        self.canvas.create_oval(x-2, y-2, x+2, y+2, fill="black", outline="black")
        
    def clear_canvas(self):
        self.canvas.delete("all")

if __name__ == "__main__":
    root = tk.Tk()
    app = DrawingApp(root)
    root.mainloop()
