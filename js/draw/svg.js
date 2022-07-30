const svgs = { // svg format: fully relative (and minified)
  back_original: "m2 12a10 10 0 0110-10 10 10 0 0110 10 10 10 0 01-10 10 10 10 0 01-10-10m16-1h-8l3.5-3.5-1.42-1.42-5.92 5.92 5.92 5.92 1.42-1.42-3.5-3.5h8v-2z",
}

// SVG class (stolen from myself)
export class SVG {

  static get(type) {
    if (!svgs.hasOwnProperty(type)) {
      throw `No such path type: ${type}`;
    } else {
      return new SVG(svgs[type]);
    }
  }

  static make(type) {
    const got = SVG.get(type);
    return new SVG(got);
  }

  static draw(type, ctx, x, y) {
    const got = SVG.get(type);
    got.draw(ctx, x, y);
  }

  data = "";

  constructor(data_string_or_svg) {
    if (typeof data_string_or_svg === "string") {
      this.data = data_string_or_svg;
    } else {
      this.data = data_string_or_svg.data;
    }
  }

  string(x = 0, y = 0) {
    return `M${x} ${y}` + this.data;
  }

  draw(ctx, x = 0, y = 0) {
    const string = this.string(x, y);
    const path2d = new Path2D(string);
    ctx.fill(path2d);
  }

  move(a) {
    
  }

  scale(a) {

  }

}