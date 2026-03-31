import { spawn } from 'node:child_process';

function startFFmpegProcess() {
    const esp32Url = "http://192.168.3.125";
    let cmd;
    try {
        cmd = spawn("ffmpeg", [
            "-f", "mjpeg",
            "-i", esp32Url,
            "-f", "mjpeg",
            "-vf", "fps=50",
            "-",
            "-r", "15",
        ]);

    }
    catch (error) {
        console.log("Error starting FFmpeg process:", error);
    }
    return cmd;
}

export { startFFmpegProcess };