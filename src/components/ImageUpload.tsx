import React, { FC } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const ImageUpload: FC<{ onFileChange: (src: string) => void }> = ({
  onFileChange,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      onFileChange(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleOnClick = () => {
    const input = document.getElementById("image-upload") as HTMLInputElement;
    input.click();
  };

  return (
    <div
      onClick={handleOnClick}
      className="h-auto min-h-[200px] max-w-[400px] cursor-pointer content-center justify-items-center rounded-md border-2 border-dashed border-gray-300 p-4"
    >
      <Label htmlFor="image-upload">Upload Image</Label>
      <Input
        className="cursor-pointer"
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageUpload;
