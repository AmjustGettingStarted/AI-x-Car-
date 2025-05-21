"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const AiEntry = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedAiImage, setUploadedAiImage] = useState(null);

  const onAiDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      setUploadedAiImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        toast.success("Image uploaded successfully");
      };

      reader.readAsDataURL(file);
    }
  };

  const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
    useDropzone({
      onDrop: onAiDrop,
      accept: {
        "image/*": [".jpeg", ".png", ".jpg", ".webp"],
      },
      maxFiles: 1,
      multiple: false,
    });

  const removeImage = (index) => {
    setUploadedAiImage((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed successfully");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Car Details Extraction</CardTitle>
          <CardDescription>
            Upload an image of a car and let AI extact its details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Uploaded Car"
                    className="max-h-56 max-w-full object-contain mb-4"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview(null), setUploadedAiImage(null);
                        toast.success("Image removed successfully");
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      // onClick={}
                      // disabled={}
                    >
                      {true ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4 " />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-2 w-4" />
                          Extract Details
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  {...getAiRootProps()}
                  className="cursor-pointer hover:bg-gray-50 transition"
                >
                  <input {...getAiInputProps()} />
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600 text-sm">
                      Drag & Drop or click to upload a car Image.
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Supports: JPG, PNG, WEBP (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AiEntry;
