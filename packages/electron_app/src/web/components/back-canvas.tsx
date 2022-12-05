import { useEffect, useRef, useState } from "react";
import { weblogger } from "../utils";
import { drawBackground } from "../utils/canvas";

const BackGroundCanvas: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

  const resizeController = new AbortController();
  useEffect(() => {
    weblogger.info("back-canvas", "add resize event listener");
    window.addEventListener(
      "resize",
      () => {
        weblogger.info("resize listener", "called");
        setCanvasWidth(window.innerWidth);
        setCanvasHeight(window.innerHeight);
      },
      { signal: resizeController.signal },
    );
    return () => {
      weblogger.info("back-canvas", "listener clean up");
      resizeController.abort();
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) {
      return;
    }
    drawBackground(canvasCtx);
  }, [canvasWidth, canvasHeight]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="absolute -z-10 h-screen w-screen"
    ></canvas>
  );
};

export default BackGroundCanvas;
