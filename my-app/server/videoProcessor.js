import { spawn } from 'node:child_process';

function startFFmpegProcess() {
    const esp32Url = "http://192.168.3.125";
    let cmd;
    try {
        cmd = spawn("ffmpeg", [
            "-f", "mjpeg",
            "-i", esp32Url,
            "-r", "15",
            "-f", "mjpeg",
            "-q:v", "5",
            "-preset", "ultrafast",
            "-tune", "zerolatency",
            "-"
        ]);

    }
    catch (error) {
        console.log("Error starting FFmpeg process:", error);
    }
    return cmd;
}

export { startFFmpegProcess };