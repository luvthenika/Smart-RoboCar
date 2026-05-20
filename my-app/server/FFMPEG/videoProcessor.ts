// 
import { spawn } from 'node:child_process';

function startFFmpegProcess() {
    const esp32Url = "http://192.168.3.148:81/stream";

    const ffmpeg = spawn("ffmpeg", [
        "-f", "mjpeg",
        "-i", esp32Url,
        "-r", "15",
        "-f", "mjpeg",
        "-q:v", "5",
        "-preset", "ultrafast",
        "-tune", "zerolatency",
        "-"
    ]);


    ffmpeg.stdout.on("data", (data) => {
        console.log("FFmpeg stdout:", data.length, "bytes");
    })
    return ffmpeg;

}

// function startPythonProcess() {
//     const pythonScript = path.join(__dirname, '../../image-processing/FFMPEG/ffmpeg.py');
//     const python = spawn('python', [pythonScript]);
//     return python;
// }


export { startFFmpegProcess };

