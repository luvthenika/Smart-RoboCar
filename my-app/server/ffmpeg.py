import sys
import threading

import cv2
import numpy as np
import websocket
from pyzbar.pyzbar import decode

CMD_URL = "ws://0.0.0.0:8880/esp-32?role=python"

# WebSocket підключення
ws_client = None

def connect_ws():
    global ws_client
    ws_client = websocket.WebSocketApp(
        CMD_URL,
        on_open=lambda ws: print("WebSocket підключено"),
        on_error=lambda ws, err: print(f"WebSocket помилка: {err}"),
        on_close=lambda ws, code, msg: print("WebSocket закрито"),
    )
    threading.Thread(target=ws_client.run_forever, daemon=True).start()

def process_mjpeg_stream():
    buffer = b''
    print('start ffmpeg process', flush=True)
    while True:
        data = sys.stdin.buffer.read(4096)
        if not data:
            break

        buffer += data

        while True:
            start = buffer.find(b'\xff\xd8')
            if start == -1:
                break
                
            if start > 0:
                buffer = buffer[start:]
                start = 0

            end = buffer.find(b'\xff\xd9', start)
            if end == -1:
                break

            frame_data = buffer[start:end + 2]
            buffer = buffer[end + 2:]

            nparr = np.frombuffer(frame_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if image is None:
                continue

            codes = decode(image)

            for bc in codes:
                x, y, w, h = bc.rect

                cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 3)
                
                barcode_text = bc.data.decode('utf-8')
                barcode_type = bc.type

                cv2.putText(
                    image,
                    barcode_text,
                    (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 0),
                    2,
                )

                print(f'QR Code revealed: {barcode_text} ({barcode_type})', flush=True)

                if ws_client and ws_client.sock:
                    try:
                        ws_client.send(barcode_text)
                        print(f'WS sent: {barcode_text}', flush=True)
                    except Exception as e:
                        print(f"Помилка відправки: {e}", flush=True)

            cv2.imshow('QR Code Stream', image)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                cv2.destroyAllWindows()
                return

    cv2.destroyAllWindows()

if __name__ == '__main__':
    connect_ws()
    process_mjpeg_stream()