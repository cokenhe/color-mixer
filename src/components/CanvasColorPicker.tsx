import React, { useEffect, useRef, useState } from "react";
import { rgbToHex } from "../utils/colorConverter";

// Centered 10x10 grid
const GRID_SIZE = 10;

interface Props {
  imageSrc?: string | null;
  onColorChange: (color: string) => void;
}

const CanvasColorPicker: React.FC<Props> = ({ imageSrc, onColorChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colorPreviewStyle, setColorPreviewStyle] =
    useState<React.CSSProperties>({ display: "none" });
  const [imageData, setImageData] = useState<Uint8ClampedArray | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageSrc) return;

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
    if (!canvasRef.current || !colorPreviewStyle.display) return;

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    let x = Math.max(0, (event.clientX - rect.left) * (canvasWidth / rect.width));
    let y = Math.max(0, (event.clientY - rect.top) * (canvasHeight / rect.height));

    x -= (GRID_SIZE / 2);
    y -= (GRID_SIZE / 2);

    setColorPreviewStyle({
      display: "block",
      position: "absolute",
      borderRadius: "50%",
      left: `${event.pageX - ((GRID_SIZE * rect.width) / canvasWidth)}px`,
      top: `${event.pageY - ((GRID_SIZE * rect.height) / canvasHeight) + window.scrollY}px`, // Adjust for scroll
    });

    if (ctx) {
      const imageData = ctx.getImageData(x, y, GRID_SIZE, GRID_SIZE).data;
      setImageData(imageData);

      let htmlContent = "";
      for (let i = 0; i < GRID_SIZE; i++) {
        const r = imageData[i * 4 + 0];
        const g = imageData[i * 4 + 1];
        const b = imageData[i * 4 + 2];

        htmlContent += `<div style="width: ${rect.width / GRID_SIZE}px; height: ${rect.height / GRID_SIZE}px;
                        background-color: rgb(${r}, ${g}, ${b}); border-right: 1px solid #ccc;"></div>`;
      }

      setColorPreviewStyle((styles) => ({
        ...styles,
        content: htmlContent, // Assuming this works as expected
      }));
    }
  };

  const handleMouseLeave = () => {
    setColorPreviewStyle({ display: "none" });
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (ctx) {
      const imageData = ctx.getImageData(x, y, 1, 1).data;
      const color = rgbToHex(imageData[0], imageData[1], imageData[2]);
      onColorChange(color);
    }
  };

  return (
    <div className="max-w-[80%] relative">
      <canvas
        ref={canvasRef}
        onMouseUpCapture={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ border: "1px solid black", position: "relative" }}
        className="cursor-pointer w-full h-auto object-cover rounded-md shadow-md shadow-gray-400"
      />
      <div
        id="color-preview-container"
        ref={(el) => {
          if (!canvasRef.current || !colorPreviewStyle.display) return;
          if (!(el && imageData && colorPreviewStyle.display === "block")) return;
          
          el.innerHTML = "";
          const rect = canvasRef.current.getBoundingClientRect();

          for (let i = 0; i < GRID_SIZE * GRID_SIZE; ++i) {
            const r = imageData[i * 4 + 0];
            const g = imageData[i * 4 + 1];
            const b = imageData[i * 4 + 2];

            let childElement = document.createElement("div");
            childElement.style.width = `${rect.width / GRID_SIZE}px`;
            childElement.style.height = `${rect.height / GRID_SIZE}px`;
            childElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

            if (i === Math.floor(GRID_SIZE * GRID_SIZE / 2)) {
              childElement.style.border = "1px solid black";
            }

            el.appendChild(childElement);
          }
        }}
      ></div>
    </div>
  );
};

export default CanvasColorPicker;