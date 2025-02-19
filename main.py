import tk_helper as tkh
from PIL import Image, ImageGrab
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten", use_fast=False)
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

def external_function():
    # get the image data
    x1,y1,x2,y2 = widgets.canvas.bbox('writing')
    x = widgets.canvas.winfo_rootx()
    y = widgets.canvas.winfo_rooty()
    pad = 10
    img = ImageGrab.grab((x+x1-pad, y+y1-pad, x+x2+pad, y+y2+pad))
    # img.save("test.png", "PNG")

    # convert to tensor and process
    image = img.convert("RGB")
    pixel_values = processor(images=image, return_tensors="pt").pixel_values
    with torch.no_grad():
            generated_ids = model.generate(pixel_values)

    recognized_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    # print("Recognized Text:", recognized_text)

    # add recognized text to the list
    widgets.list.insert(tkh.tk.END, recognized_text)

    # get all items from the list
    # items = widgets.list.get(0, tkh.tk.END)


    
# run the application
widgets = tkh.Widgets(external_function)
widgets.root.mainloop()