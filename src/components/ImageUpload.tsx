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

  return (
    <div className="max-w-sm flex flex-col gap-y-2 items-center justify-center p-4 border-2 border-gray-300 border-dashed rounded-md">
      <Label htmlFor="image-upload">Upload Image</Label>
      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
