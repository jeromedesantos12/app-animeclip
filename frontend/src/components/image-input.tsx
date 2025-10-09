import Image from "next/image";
import type { ChangeEvent, InputHTMLAttributes } from "react";

interface ImageInputProps extends InputHTMLAttributes<HTMLInputElement> {
  imagePreview: string | null;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageInput({
  imagePreview,
  handleFileChange,
  ...props
}: ImageInputProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border border-border/50 rounded-lg cursor-pointer backdrop-blur-lg shadow-xl hover:bg-foreground/10 duration-300"
      >
        {imagePreview ? (
          <div className="relative w-full h-full">
            <Image
              src={imagePreview}
              alt="Image preview"
              fill={true}
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-muted-foreground"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
        )}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept="image/*"
          {...props}
          onChange={(e) => {
            handleFileChange(e);
            if (props.onChange) {
              props.onChange(e);
            }
          }}
        />
      </label>
    </div>
  );
}
