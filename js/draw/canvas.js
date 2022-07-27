
export const init_canvas = function(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  canvas_resize(canvas);
}

export const canvas_resize = function(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth;
  canvas.style.height = window.innerHeight;
}