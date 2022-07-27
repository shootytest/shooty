const canvas = document.getElementById("canvas");

export const download_screenshot = function() {
  const original_png = canvas.toDataURL("image/png");
  const temp_link = document.getElementById("temp-link");
  temp_link.download = "screenshot.png";
  temp_link.href = original_png.replace(/^data:image\/[^;]*/, "data:application/octet-stream"); // ;headers=Content-Disposition%3A%20attachment%3B%20filename=screenshot.png');
  temp_link.click();
}

export const copy_screenshot = function() {
  canvas.toBlob(blob => {
    navigator.clipboard.write([
      new ClipboardItem({
          'image/png': blob,
      }),
    ]);
  });
}