from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
from io import BytesIO

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten", use_fast=False)
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

def convert_image_to_text(img_bytes):
    image = Image.open(BytesIO(img_bytes)).convert("RGB")  # Convert to RGB format
    pixel_values = processor(images=image, return_tensors="pt").pixel_values
    generated_ids = model.generate(pixel_values)
    recognized_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return recognized_text
