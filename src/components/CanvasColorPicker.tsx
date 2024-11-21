import React, { useEffect, useRef, useState } from "react";
import { rgbToHex } from "../utils/colorConverter";

interface Props {
  imageSrc?: string | null;
  onColorChange: (color: string) => void;
}

const GRID_SIZE = 15;
const PIXEL_SIZE = 15;

const CanvasColorPicker: React.FC<Props> = ({ imageSrc, onColorChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colorPreviewStyle, setColorPreviewStyle] =
    useState<React.CSSProperties>({ display: "none" });
  const [imageData, setImageData] = useState<Uint8ClampedArray | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !colorPreviewStyle.display) return;

    const ctx = canvasRef.current.getContext("2d");
    if (ctx && imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        if (!canvasRef.current) return;
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [imageSrc]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    let x = Math.max(
      0,
      (event.clientX - rect.left) * (canvasWidth / rect.width),
    );
    let y = Math.max(
      0,
      (event.clientY - rect.top) * (canvasHeight / rect.height),
    );

    x -= GRID_SIZE / 2;
    y -= GRID_SIZE / 2;

    setColorPreviewStyle({
      display: "block",
      position: "absolute",
      borderRadius: "50%",
      overflow: "hidden",
      width: `${GRID_SIZE * PIXEL_SIZE}px`,
      height: `${GRID_SIZE * PIXEL_SIZE}px`,
      left: `${event.pageX - (GRID_SIZE * PIXEL_SIZE) / 2}px`,
      top: `${event.pageY - GRID_SIZE * PIXEL_SIZE - 50}px`,
    });

    if (ctx) {
      const imageData = ctx.getImageData(x, y, GRID_SIZE, GRID_SIZE).data;
      setImageData(imageData);
    }
  };

  const handleMouseLeave = () => {
    setColorPreviewStyle({ display: "none" });
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    let x = Math.max(
      0,
      (event.clientX - rect.left) * (canvasWidth / rect.width),
    );
    let y = Math.max(
      0,
      (event.clientY - rect.top) * (canvasHeight / rect.height),
    );

    x -= GRID_SIZE / 2;
    y -= GRID_SIZE / 2;

    if (ctx) {
      const imageData = ctx.getImageData(x, y, 1, 1).data;
      const color = rgbToHex(imageData[0], imageData[1], imageData[2]);
      onColorChange(color);
    }
  };

  return (
    <div className="h-auto w-full">
      <canvas
        ref={canvasRef}
        onMouseUpCapture={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ border: "1px solid black", position: "relative" }}
        className="h-auto w-[80%] cursor-pointer rounded-md object-cover shadow-md shadow-gray-400"
      />
      <div
        id="color-preview-container"
        style={colorPreviewStyle}
        ref={(el) => {
          if (!canvasRef.current || !colorPreviewStyle.display) return;
          if (!(el && imageData && colorPreviewStyle.display === "block"))
            return;

          el.innerHTML = "";

          let parentElement: HTMLDivElement = document.createElement("div");
          for (let i = 0; i < GRID_SIZE * GRID_SIZE; ++i) {
            const r = imageData[i * 4 + 0];
            const g = imageData[i * 4 + 1];
            const b = imageData[i * 4 + 2];

            let childElement = document.createElement("div");
            childElement.style.width = `${PIXEL_SIZE}px`;
            childElement.style.height = `${PIXEL_SIZE}px`;
            childElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

            if (i === Math.floor((GRID_SIZE * GRID_SIZE) / 2)) {
              childElement.style.border = "1px solid black";
            }

            if (i % GRID_SIZE === 0) {
              parentElement = document.createElement("div");
              parentElement.style.display = "flex";
            }

            parentElement.appendChild(childElement);
            el.appendChild(parentElement);
          }
        }}
      ></div>
    </div>
  );
};

export default CanvasColorPicker;
