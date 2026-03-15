import { spawn } from 'node:child_process';

function startFFmpegProcess() {
    const esp32Url = "http://192.168.3.125"; // Replace with your ESP32's IP
    let cmd;
    try {
        cmd = spawn("ffmpeg", [
            "-f", "mjpeg",         // Tell FFmpeg the input is MJPEG
            "-i", esp32Url,        // Your ESP32 stream URL
            "-f", "mjpeg",         // Output format
            "-vf", "fps=20",       // Keep it at 20fps
            "-",
            "-r", "5",                // Pipe to stdout
        ]);

    }
    catch (error) {
        console.log("Error starting FFmpeg process:", error);
    }
    return cmd;
}

export { startFFmpegProcess };