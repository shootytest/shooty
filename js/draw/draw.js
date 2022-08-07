

export const draw = {};


draw.clear = function(ctx, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

draw.clear_transparent = function(ctx) {
  // Store the current transformation matrix
  ctx.save();
  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Restore the transform
  ctx.restore();
}

// circles

draw.circle = function(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
}

draw.arc = function(ctx, x, y, r, s, e) {
  ctx.beginPath();
  ctx.arc(x, y, r, s, e);
}

// rectangles

draw.stroke_rect = function(ctx, x, y, w, h) {
  ctx.strokeRect(x, y, w, h);
}

draw.fill_rect = function(ctx, x, y, w, h) {
  ctx.fillRect(x, y, w, h);
}

draw.stroke_rectangle = function(ctx, x, y, w, h) {
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);
}

draw.fill_rectangle = function(ctx, x, y, w, h) {
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

// angle in radians
draw.draw_rect_angle = function(ctx, x, y, w, h, a) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(a);
  ctx.rect(-w / 2, -h / 2, w, h);
}

draw.stroke_rect_angle = function(ctx, x, y, w, h, a) {
  draw.draw_rect_angle(ctx, x, y, w, h, a);
  ctx.stroke();
  ctx.restore();
}

draw.fill_rect_angle = function(ctx, x, y, w, h, a) {
  draw.draw_rect_angle(ctx, x, y, w, h, a);
  ctx.fill();
  ctx.restore();
}

draw.stroke_rectangle_angle = function(ctx, x, y, w, h, a) {
  draw.stroke_rect_angle(ctx, x - w / 2, y - h / 2, w, h, a);
}

draw.fill_rectangle_angle = function(ctx, x, y, w, h, a) {
  draw.fill_rect_angle(ctx, x - w / 2, y - h / 2, w, h, a);
}

// lines

draw.line = function(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  if (x2 == null && y2 == null) {
    ctx.moveTo(x1.x, x1.y);
    ctx.lineTo(y1.x, y1.y);
  } else {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
}

draw.regular_polygon = function(ctx, sides, r, x, y, angle = 0) {
  const oldlinecap = ctx.lineCap;
  ctx.lineCap = "square";
  ctx.beginPath();
  let a = angle;
  ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
  // draw one more side because lineCap is weird
  for (let i = 0; i < sides + 1; ++i) {
    a += Math.PI * 2 / sides;
    ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
  }
  ctx.lineCap = oldlinecap;
}

draw.x_cross = function(ctx, x, y, w, h, ratio = 0.7) {
  const x_gap = w * (1 - ratio) / 2;
  const y_gap = h * (1 - ratio) / 2;
  draw.line(ctx, x + x_gap, y + y_gap, x + w - x_gap, y + h - y_gap);
  draw.line(ctx, x + w - x_gap, y + y_gap, x + x_gap, y + h - y_gap);
}

// texts

draw.fill_text = function(ctx, s, x, y) {
  ctx.fillText(s, x, y);
}

draw.stroke_text = function(ctx, s, x, y) {
  ctx.strokeText(s, x, y);
}

draw._split_text = function(ctx, text, maxWidth) {
  let words = text.split(" "),
      lines = [],
      currentLine = words[0];
  for (let i = 1; i < words.length; i++) {
    let word = words[i],
        width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
        currentLine += " " + word;
    } else {
        lines.push(currentLine);
        currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

draw.split_text = function(ctx, text, maxWidth) {
  const lines = text.split("\n"),
        newlines = [];
  for (const line of lines) {
    for (const a of draw._split_text(ctx, line, maxWidth)) {
      newlines.push(a);
    }
  }
  return newlines;
}

draw.get_text_width = function(ctx, textArray) {
  if (!Array.isArray(textArray)) {
    textArray = [textArray];
  }
  let _max = 0;
  for (let text of textArray) {
    _max = Math.max(_max, ctx.measureText(text).width);
  }
  return _max;
}

draw.heart = function(ctx, x, y, width, height) {
  y -= height / 2;
  x -= width / 2;

  ctx.beginPath();
  const topCurveHeight = height * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(
    x, y, 
    x - width / 2, y, 
    x - width / 2, y + topCurveHeight
  );
  // bottom left curve
  ctx.bezierCurveTo(
    x - width / 2, y + (height + topCurveHeight) / 2, 
    x, y + (height + topCurveHeight) / 2, 
    x, y + height
  );
  // bottom right curve
  ctx.bezierCurveTo(
    x, y + (height + topCurveHeight) / 2, 
    x + width / 2, y + (height + topCurveHeight) / 2, 
    x + width / 2, y + topCurveHeight
  );
  // top right curve
  ctx.bezierCurveTo(
    x + width / 2, y, 
    x, y, 
    x, y + topCurveHeight
  );
  ctx.closePath();
}