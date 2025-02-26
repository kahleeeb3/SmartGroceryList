from PIL import Image
from io import BytesIO
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import base64

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten", use_fast=False)
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

def convertToText(message):
    # Source: https://huggingface.co/microsoft/trocr-base-handwritten
    image_data = base64.b64decode(message)
    image = Image.open(BytesIO(image_data)).convert("RGB")  # Convert to RGB format
    image.save("received_image.png")
    pixel_values = processor(images=image, return_tensors="pt").pixel_values
    generated_ids = model.generate(pixel_values)
    recognized_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return recognized_text