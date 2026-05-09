// 
import { spawn } from 'node:child_process';

function startFFmpegProcess() {
    // Port 81 is the default for the 'stream' on most ESP32-CAM firmware
    const esp32Url = "http://192.168.3.148:81/stream";

    const cmd = spawn("ffmpeg", [
        "-f", "mjpeg",
        "-i", esp32Url,
        "-r", "15",
        "-f", "mjpeg",
        "-q:v", "5",
        "-preset", "ultrafast",
        "-tune", "zerolatency",
        "-"
    ]);


    return cmd;
}

export { startFFmpegProcess };

