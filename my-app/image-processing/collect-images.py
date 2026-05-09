# # import subprocess
# # import cv2
# # import numpy as np
# # import os
# # import time

# # # --- НАЛАШТУВАННЯ ---
# # URL = "http://192.168.3.125"  # Посилання на потік твоєї ESP32-CAM
# # OUTPUT_FOLDER = "collected_data"
# # FRAME_WIDTH = 640
# # FRAME_HEIGHT = 480
# # FPS = 15  

# # if not os.path.exists(OUTPUT_FOLDER):
# #     os.makedirs(OUTPUT_FOLDER)


# # command = [
# #     'ffmpeg',
# #     '-i', URL,
# #     '-f', 'image2pipe',
# #     '-pix_fmt', 'bgr24',
# #     '-vcodec', 'rawvideo',
# #     '-r', str(FPS),
# #     '-'
# # ]


# # pipe = subprocess.Popen(command, stdout=subprocess.PIPE, bufsize=10**8)

# # print("Запис розпочато! Натисніть 'q' у вікні відео для виходу.")

# # frame_count = 0
# # try:
# #     while True:

# #         raw_image = pipe.stdout.read(FRAME_WIDTH * FRAME_HEIGHT * 3)
        
# #         if len(raw_image) != FRAME_WIDTH * FRAME_HEIGHT * 3:
# #             break
            
# #         image = np.frombuffer(raw_image, dtype='uint8').reshape((FRAME_HEIGHT, FRAME_WIDTH, 3))

# #         # ТУТ МАЄ БУТИ ТВОЯ КОМАНДА (вліво, вправо, прямо)
# #         # Поки що поставимо "straight" для тесту
# #         user_command = "straight" 
        
# #         # Формуємо назву: номер кадру + мітка команди
# #         timestamp = int(time.time() * 1000)
# #         filename = f"frame_{timestamp}_{user_command}.jpg"
        
# #         # Зберігаємо фото
# #         cv2.imwrite(os.path.join(OUTPUT_FOLDER, filename), image)
        
# #         # Показуємо вікно для контролю
# #         cv2.imshow('Collector', image)
# #         if cv2.waitKey(1) & 0xFF == ord('q'):
# #             break
            
# #         frame_count += 1
# #         if frame_count % 10 == 0:
# #             print(f"Збережено кадрів: {frame_count}")

# # except KeyboardInterrupt:
# #     pass

# # pipe.terminate()
# # cv2.destroyAllWindows()

# import cv2
# import numpy as np
# import time
# import os
# import asyncio
# import websockets
# import threading
# import random
# import sys
# # --- НАЛАШТУВАННЯ ---
# SAVE_PATH = "augmented_dataset"
# if not os.path.exists(SAVE_PATH):
#     os.makedirs(SAVE_PATH)

# ESP32_URL = "http://192.168.3.125:81/stream" # Твій потік
# current_command = "STOP" # Початковий стан

# # --- ФОНОВИЙ ПОТІК WEBSOCKET ---
# async def listen_commands():
#     global current_command
#     uri = "ws://192.168.3.5:8880/commands"
#     try:
#         async with websockets.connect(uri) as websocket:
#             print("Зв'язок з Node.js встановлено!")
#             while True:
#                 msg = await websocket.recv()
#                 # Фільтруємо команду (якщо приходить "Отримана команда: GO_RIGHT")
#                 current_command = msg.replace("Отримана команда: ", "").strip()
#     except Exception as e:
#         print(f"Помилка сокета: {e}")

# threading.Thread(target=lambda: asyncio.run(listen_commands()), daemon=True).start()

# # --- ОСНОВНИЙ ЦИКЛ ОБРОБКИ ВІДЕО ---
# # Додай ці рядки перед cv2.VideoCapture
# os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;udp|timeout;5000000"

# # Спробуй відкрити потік так
# cap = cv2.VideoCapture(ESP32_URL, cv2.CAP_FFMPEG)


# print("Запис розпочато. Надсилайте команди...")
# print(f"Спроба підключення до: {ESP32_URL}")
# # Використовуємо CAP_FFMPEG явно, щоб уникнути довгих пошуків драйвера
# cap = cv2.VideoCapture(ESP32_URL, cv2.CAP_FFMPEG)

# if not cap.isOpened():
#     print("КРИТИЧНА ПОМИЛКА: Не вдалося відкрити потік. Перевір, чи не відкрита камера в браузері!")
#     sys.exit()

# # Спробуємо прочитати рівно 1 кадр
# print("Чекаю на перший кадр...")
# ret, frame = cap.read()

# if not ret:
#     print("ПОМИЛКА: З'єднання встановлено, але відеодані не приходять.")
#     sys.exit()

# print("Перший кадр отримано успішно! Починаю основний цикл...")
# # try:
# #     while True:
# #         ret, frame = cap.read()
# #         if not ret: break


# #         if current_command != "STOP":
# #             ts = int(time.time() * 1000)
            
# #             fname_orig = f"frame_{ts}_orig_{current_command}.jpg"
# #             cv2.imwrite(os.path.join(SAVE_PATH, fname_orig), frame)

# #             gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
# #             fname_gray = f"frame_{ts}_gray_{current_command}.jpg"
# #             cv2.imwrite(os.path.join(SAVE_PATH, fname_gray), gray_frame)
# #             brightness_factor = random.uniform(0.5, 1.5)
# #             bright_frame = cv2.convertScaleAbs(gray_frame, alpha=brightness_factor, beta=0)
            
# #             fname_bright = f"frame_{ts}_bright_{current_command}.jpg"
# #             cv2.imwrite(os.path.join(SAVE_PATH, fname_bright), bright_frame)


# #         if current_command != "STOP":
# #             cv2.putText(bright_frame, f"CMD: {current_command}", (10, 50), 
# #                         cv2.FONT_HERSHEY_SIMPLEX, 1, (255), 2)
# #             cv2.imshow("Recording (Augmented)", bright_frame)
# #         else:
# #             cv2.imshow("Recording (Augmented)", frame) 

# #         if cv2.waitKey(1) & 0xFF == ord('q'):
# #             break

# # finally:
# #     cap.release()
# #     cv2.destroyAllWindows()

import subprocess
import cv2
import numpy as np
import os
import time
import asyncio
import websockets
import threading
import random

# --- НАЛАШТУВАННЯ ---
URL = "http://192.168.3.125"  # Твій корінь, де відео
SAVE_PATH = "augmented_dataset"
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
FPS = 15
current_command = "STOP"

if not os.path.exists(SAVE_PATH):
    os.makedirs(SAVE_PATH)

# --- ФОНОВИЙ ПОТІК WEBSOCKET ДЛЯ КОМАНД ---
async def listen_commands():
    global current_command
    uri = "ws://192.168.3.5:8880/commands"
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                print("Зв'язок з Node.js встановлено!")
                while True:
                    msg = await websocket.recv()
                    # Очищаємо текст команди
                    current_command = msg.replace("Отримана команда: ", "").strip()
        except Exception as e:
            print(f"Помилка сокета: {e}. Реконнект через 2 сек...")
            await asyncio.sleep(2)

threading.Thread(target=lambda: asyncio.run(listen_commands()), daemon=True).start()

# --- НАЛАШТУВАННЯ FFMPEG PIPE ---
command = [
    'ffmpeg',
    '-y',                       # Перезаписувати, якщо треба
    '-f', 'mjpeg',              # ПРИМУСОВО кажемо, що на вході MJPEG
    '-i', URL,                  # Твоя адреса http://192.168.3.125
    '-f', 'image2pipe',         # Вивід у пайп
    '-pix_fmt', 'bgr24',        # Формат для OpenCV
    '-vcodec', 'rawvideo',      # Без стиснення для швидкості
    '-r', str(FPS),             # Частота кадрів
    '-'
]

# Запуск FFmpeg
pipe = subprocess.Popen(command, stdout=subprocess.PIPE, bufsize=10**8)

print("FFmpeg запущено. Запис розпочато!")

try:
    while True:
        # Читаємо байти одного кадру
        raw_image = pipe.stdout.read(FRAME_WIDTH * FRAME_HEIGHT * 3)
        
        if len(raw_image) != FRAME_WIDTH * FRAME_HEIGHT * 3:
            print("Помилка отримання кадру з FFmpeg")
            break
            
        # Перетворюємо байти в масив numpy (картинку)
        frame = np.frombuffer(raw_image, dtype='uint8').reshape((FRAME_HEIGHT, FRAME_WIDTH, 3))
        frame = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)
        # --- ОБРОБКА ТА ЗБЕРЕЖЕННЯ ---
        if current_command != "STOP":
            ts = int(time.time() * 1000)
            
            # 1. Оригінал
            fname_orig = f"f_{ts}_orig_{current_command}.jpg"
            cv2.imwrite(os.path.join(SAVE_PATH, fname_orig), frame)

            # 2. Чорно-білий
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            fname_gray = f"f_{ts}_gray_{current_command}.jpg"
            cv2.imwrite(os.path.join(SAVE_PATH, fname_gray), gray_frame)

            # 3. Чорно-білий + Рандомна яскравість
            brightness_factor = random.uniform(0.5, 1.5)
            bright_frame = cv2.convertScaleAbs(gray_frame, alpha=brightness_factor, beta=0)
            fname_bright = f"f_{ts}_bright_{current_command}.jpg"
            cv2.imwrite(os.path.join(SAVE_PATH, fname_bright), bright_frame)

            # Для візуалізації використовуємо bright_frame
            display_frame = cv2.cvtColor(bright_frame, cv2.COLOR_GRAY2BGR)
        else:
            display_frame = frame.copy()

        # --- ВІЗУАЛІЗАЦІЯ ---
        cv2.putText(display_frame, f"CMD: {current_command}", (10, 40), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        cv2.imshow('Robot Data Collector', display_frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

except Exception as e:
    print(f"Помилка в основному циклі: {e}")

finally:
    pipe.terminate()
    cv2.destroyAllWindows()