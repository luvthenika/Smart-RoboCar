// 
import { spawn } from 'node:child_process';

function startFFmpegProcess() {
    const esp32Url = "http://192.168.3.148:81/stream";
    const python = spawn('python', ['ffmpeg.py']);
    python.on('spawn', () => console.log('Python запустився'));
    python.on('error', (err) => console.error('Python помилка:', err));
    python.stderr.on('data', (data) => console.error('Python stderr:', data.toString()));
    python.stdout.on('data', (data) => console.log('Python stdout:', data.toString()));
    const ffmpeg = spawn("ffmpeg", [
        "-f", "mjpeg",
        "-avoid_negative_ts", "make_zero", // Prevents frame drops due to network jitter
        "-fflags", "nobuffer+discardcorrupt", // Disables internal buffering for raw speed
        "-flags", "low_delay",            // Minimizes processing latency
        "-i", esp32Url,

        "-r", "15",                       // Locks the frame rate to a smooth 15fps
        "-f", "mjpeg",
        "-q:v", "2",                      // Sharp, even pixels (Values 2-3 are sweet spots)
        "-"
    ]);

    ffmpeg.stdout.on("data", (data) => {
        console.log("FFmpeg stdout:", data.length, "bytes");
    })
    ffmpeg.stdout.on("data", (data) => {
        console.log("FFmpeg stdout:", data.length, "bytes");
        python.stdin.write(data);
    });


    return ffmpeg;

}



export { startFFmpegProcess };

