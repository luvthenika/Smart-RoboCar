import sys
import cv2
import numpy as np

def process_mjpeg_stream():
    buffer = b''
    while True:
        data = sys.stdin.buffer.read(1024)
        if not data:
            break
        buffer += data

        while True:
            start = buffer.find(b'\xff\xd8')
            end = buffer.find(b'\xff\xd9', start)
            if start != -1 and end != -1:
                frame_data = buffer[start:end+2]
                buffer = buffer[end+2:]

                nparr = np.frombuffer(frame_data, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if frame is not None:
                    cv2.imshow('Frame', frame)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
            else:
                break

if __name__ == "__main__":
    process_mjpeg_stream()