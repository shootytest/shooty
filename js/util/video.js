
const canvas = document.getElementById("canvas");

let stream, mediaRecorder;
let recordedChunks = [], started = false;

const start_recording_video = function() {
  started = true;
  stream = canvas.captureStream(30);
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9"
  });
  mediaRecorder.start();
  mediaRecorder.ondataavailable = function(event) {
    recordedChunks.push(event.data);
    const blob = new Blob(recordedChunks, { type: "video/webm", });
    const url = URL.createObjectURL(blob);
    const temp_link = document.getElementById("temp-link");
    temp_link.download = "screenshot.webm";
    temp_link.href = url;
    temp_link.click();
    console.log(url);
  }
}

const stop_recording_video = function() {
  started = false;
  mediaRecorder.stop();
}

export const video_button_pressed = function() {
  if (started) {
    stop_recording_video();
  } else {
    start_recording_video();
  }
}