import subprocess
import cv2
import numpy as np
import tensorflow as tf
import asyncio
import websockets
import json

# --- НАЛАШТУВАННЯ ---
MODEL_PATH = "robot_model.h5"
ESP32_URL = "http://192.168.3.125"  # Твій корінь
WS_URL = "ws://192.168.3.5:8880/commands" # Куди слати команди

IMG_WIDTH = 160
IMG_HEIGHT = 120
COMMANDS = ['LEFT', 'FORWARD', 'RIGHT']

# 1. Завантажуємо навчену модель
model = tf.keras.models.load_model(MODEL_PATH)
print("Модель завантажена. Готовий до виїзду!")

async def drive():
    # 2. Підключаємося до Node.js через WebSocket
    async with websockets.connect(WS_URL) as websocket:
        print("З'єднання з пультом встановлено!")

        # 3. Налаштовуємо FFmpeg (той самий робочий метод)
        command = [
            'ffmpeg', '-y', '-f', 'mjpeg', '-i', ESP32_URL,
            '-f', 'image2pipe', '-pix_fmt', 'bgr24',
            '-vcodec', 'rawvideo', '-r', '15', '-'
        ]
        pipe = subprocess.Popen(command, stdout=subprocess.PIPE, bufsize=10**8)

        try:
            while True:
                # Читаємо кадр (640x480)
                raw_image = pipe.stdout.read(640 * 480 * 3)
                if len(raw_image) != 640 * 480 * 3:
                    continue

                # Перетворюємо в картинку
                frame = np.frombuffer(raw_image, dtype='uint8').reshape((480, 640, 3))
                frame = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)

                # 2. Чорно-біле
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                # 3. Ресайз
                resized = cv2.resize(gray, (IMG_WIDTH, IMG_HEIGHT))
                # 4. Нормалізація
                input_data = resized.reshape(1, IMG_HEIGHT, IMG_WIDTH, 1) / 255.0

                # 4. ПРОГНОЗ МОДЕЛІ
                prediction = model.predict(input_data, verbose=0)
                predict_idx = np.argmax(prediction)
                command_to_send = 'GO_' + COMMANDS[predict_idx]
                confidence = prediction[0][predict_idx] * 100

                # 5. ВІДПРАВКА КОМАНДИ
                # Слати команду тільки якщо впевненість вища за 50%
                if confidence > 50:
                    await websocket.send(command_to_send)
                
                # Візуалізація для контролю
                cv2.putText(frame, f"AI: {command_to_send} ({confidence:.1f}%)", 
                            (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                cv2.imshow("Autopilot View", frame)

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
        finally:
            pipe.terminate()
            cv2.destroyAllWindows()

# Запуск
asyncio.run(drive())