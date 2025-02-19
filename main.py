import tkinter as tk
from PIL import Image, ImageGrab
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

class DrawingApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Handwriting Recognition with TrOCR")
        self.root.geometry("1280x720")
        
        self.canvas = tk.Canvas(self.root, bg="white", width=1280, height=720)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        
        self.canvas.bind("<B1-Motion>", self.draw)
        
        # Load TrOCR model
        self.processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
        self.model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

        self.reset_timer()

    def reset_timer(self):
        if hasattr(self, 'timer'):
            self.root.after_cancel(self.timer)
        self.timer = self.root.after(3000, self.process_drawing)
        
    def draw(self, event):
        self.reset_timer()
        x, y = event.x, event.y
        self.canvas.create_oval(x-2, y-2, x+2, y+2, fill="black", outline="black")
        
    def process_drawing(self):
        self.canvas.update()
        x = self.root.winfo_rootx() + self.canvas.winfo_x()
        y = self.root.winfo_rooty() + self.canvas.winfo_y()
        x1 = x + self.canvas.winfo_width()
        y1 = y + self.canvas.winfo_height()
        
        # Capture canvas as image
        image = ImageGrab.grab(bbox=(x, y, x1, y1)).convert("RGB")
        
        # Convert to tensor and process
        pixel_values = self.processor(images=image, return_tensors="pt").pixel_values
        with torch.no_grad():
            generated_ids = self.model.generate(pixel_values)
        
        recognized_text = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        print("Recognized Text:", recognized_text)
        
        self.clear_canvas()
        
    def clear_canvas(self):
        self.canvas.delete("all")

if __name__ == "__main__":
    root = tk.Tk()
    app = DrawingApp(root)
    root.mainloop()
