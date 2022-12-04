/**
 * will draw plaid background by use given ctx
 * @param ctx html canvas elemt 2d context
 */
export const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = "#9d9986";
  ctx.beginPath();
  for (let w = 5; w < window.screen.height; w += 5) {
    // 竖线
    ctx.moveTo(w, 0);
    ctx.lineTo(w, window.screen.height);
  }
  for (let h = 5; h < window.screen.width; h += 5) {
    // 横线
    ctx.moveTo(0, h);
    ctx.lineTo(window.screen.width, h);
  }
  ctx.stroke();
};
