import React, { memo, useCallback } from "react";
import CanvasColorPicker from "./components/CanvasColorPicker";
import ColorConverter from "./components/ColorConverter";
import ColorMixer from "./components/ColorMixer";
import ImageUpload from "./components/ImageUpload";
import { Toggle } from "./components/ui/toggle";
import { hexToCmyk } from "./utils/colorConverter";

function App() {
  const [selectedPage, setSelectedPage] = React.useState(1);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [color, setColor] = React.useState<string | undefined>(undefined);

  const handleColorChange = useCallback((color: string) => {
    setColor(color);
  }, []);

  const Page1: React.FC = memo(() => {
    return (
      <div className="flex flex-col md:flex-row gap-x-8 gap-y-4 md:gap-x-16 md:gap-y-8">
        <ColorConverter color={color} onColorChange={handleColorChange} />
        <div className="flex flex-col gap-y-4 w-full items-center md:w-1/2">
          {imageSrc && (
            <CanvasColorPicker
              imageSrc={imageSrc}
              onColorChange={handleColorChange}
            />
          )}
          <ImageUpload onFileChange={setImageSrc} />
        </div>
      </div>
    );
  });

  const Paginator = () => {
    return (
      <div className="flex flex-row gap-y-4 md:gap-y-0 justify-center">
        <Toggle
          pressed={selectedPage === 1}
          onPressedChange={() => setSelectedPage(1)}
        >
          1
        </Toggle>
        <Toggle
          pressed={selectedPage === 2}
          onPressedChange={() => setSelectedPage(2)}
        >
          2
        </Toggle>
      </div>
    );
  };

  return (
    <div className="w-full h-full mx-auto my-8 flex flex-col gap-y-2 md:flex-col md:justify-center">
      <Paginator />

      <div className="flex flex-col gap-y-4 md:gap-y-0 md:flex-row md:w-full md:h-full md:justify-center ">
        {selectedPage === 1 ? (
          <Page1 />
        ) : (
          <ColorMixer target={color ? hexToCmyk(color) : undefined} />
        )}
      </div>
    </div>
  );
}

export default App;
