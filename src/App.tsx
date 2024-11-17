import React from "react";
import CanvasColorPicker from "./components/CanvasColorPicker";
import ColorConverter from "./components/ColorConverter";
import ColorMixer from "./components/ColorPreviewer";
import ImageUpload from "./components/ImageUpload";
import { Toggle } from "./components/ui/toggle";
import { hexToCmyk } from "./utils/colorConverter";

interface Page1Props {
  color: string | undefined;
  imageSrc: string | null;
  setColor: (color: string) => void;
  setImageSrc: (src: string | null) => void;
}
const Page1: React.FC<Page1Props> = ({
  color,
  imageSrc,
  setColor,
  setImageSrc,
}) => {
  return (
    <>
      <ColorConverter color={color} onColorChange={setColor} />

      <div className="flex flex-col gap-y-2 m-auto">
        {imageSrc && (
          <CanvasColorPicker imageSrc={imageSrc} onColorChange={setColor} />
        )}
        <ImageUpload onFileChange={(src) => setImageSrc(src)} />
      </div>
    </>
  );
};

function App() {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [color, setColor] = React.useState<string | undefined>(undefined);
  const [isToggledOn, setIsToggledOn] = React.useState(true);

  return (
    <div className="App w-screen m-auto flex flex-col gap-y-2">
      <div className="m-auto flex gap-x-4">
        <Toggle
          pressed={isToggledOn}
          defaultPressed
          onPressedChange={() => setIsToggledOn(true)}
        >
          1
        </Toggle>
        <Toggle
          pressed={isToggledOn}
          onPressedChange={() => setIsToggledOn(false)}
        >
          2
        </Toggle>
      </div>

      <div className="w-screen m-auto flex ">
        {isToggledOn ? (
          <Page1
            color={color}
            imageSrc={imageSrc}
            setColor={setColor}
            setImageSrc={setImageSrc}
          />
        ) : (
          <ColorMixer target={color ? hexToCmyk(color) : undefined} />
        )}
      </div>
    </div>
  );
}

export default App;
