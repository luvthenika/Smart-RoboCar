from pyzbar.pyzbar import decode
import cv2
import matplotlib.pyplot as plt

# Load image
image = cv2.imread("qrcode.png")

image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

codes = decode(image_rgb)
for bc in codes:
    x, y, w, h = bc.rect


    cv2.rectangle(
        image_rgb,
        (x, y),
        (x + w, y + h),
        (255, 0, 0),  # Blue rectangle
        3
    )
    barcode_text = bc.data.decode("utf-8")
    barcode_type = bc.type

    cv2.putText(
        image_rgb,
        barcode_text,
        (x, y - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 0),
        2
    )

    print(f"QR Code revealed: {barcode_text} ({barcode_type})")

plt.figure(figsize=(10, 10))
plt.imshow(image_rgb)
plt.axis("off")
plt.title("QR Code Detection (Using Rectangle)")
plt.show()