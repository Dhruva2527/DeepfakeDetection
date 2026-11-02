from PIL import Image
from detector import predict_image

for name in ["ai.png", "real.jpg"]:
    print(name, predict_image(Image.open(name)))