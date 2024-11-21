import React, { useEffect, useRef, useState } from "react";
import { rgbToHex } from "../utils/colorConverter";

interface Props {
  imageSrc?: string | null;
  onColorChange: (color: string) => void;
}

const CanvasColorPicker: React.FC<Props> = ({ imageSrc, onColorChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colorPreviewStyle, setColorPreviewStyle] =
    useState<React.CSSProperties>({ display: "none" });

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
    if (!canvasRef.current) return;

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvasWidth / rect.width);
    const y = (event.clientY - rect.top) * (canvasHeight / rect.height);

    setColorPreviewStyle({
      display: "block",
      position: "absolute",
      borderRadius: "50%",
      border: "1px solid black",
      left: `${event.pageX - 25}px`,
      top: `${event.pageY - 75}px`,
    });

    if (ctx) {
      const imageData = ctx.getImageData(x, y, 1, 1).data;
      setColorPreviewStyle((styles) => ({
        ...styles,
        backgroundColor: `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`,
        width: "50px",
        height: "50px",
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
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

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
        className="h-full w-full cursor-pointer rounded-md object-cover shadow-md shadow-gray-400"
      />
      <div style={colorPreviewStyle}></div>
    </div>
  );
};

export default CanvasColorPicker;
