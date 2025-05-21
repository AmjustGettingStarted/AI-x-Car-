"use client";
import { processCarImageWithAI } from "@/actions/cars";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { Camera, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
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

  const {
    loading: processImageLoading,
    fn: processImageFn,
    data: processImageResult,
    error: processImageError,
  } = useFetch(processCarImageWithAI);

  const processWithAi = async () => {
    if (!uploadedAiImage) {
      toast.error("Please upload an image");
      return;
    }
    await processImageFn(uploadedAiImage);
  };

  useEffect(() => {
    if (processImageError) {
      toast.error(processImageError.message || "Failed To Upload Car");
    }
  }, [processImageError]);

  useEffect(() => {
    if (processImageResult && processImageResult.success) {
      const carDetails = processImageResult.data;

      // Update form with AI results
      setValue("make", carDetails.make);
      setValue("model", carDetails.model);
      setValue("year", carDetails.year.toString());
      setValue("color", carDetails.color);
      setValue("bodyType", carDetails.bodyType);
      setValue("fuelType", carDetails.fuelType);
      setValue("price", carDetails.price);
      setValue("mileage", carDetails.mileage);
      setValue("transmission", carDetails.transmission);
      setValue("description", carDetails.description);

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedAiImage((prev) => [...prev, e.target.result]);
        // toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(uploadedAiImage);
      toast.success("Car details extracted successfully", {
        description: `Detected ${carDetails.make} ${carDetails.model} (${
          carDetails.year
        } with ${Math.round(carDetails.confidence * 100)}% confidence)`,
      });

      setActiveTab("manual");
    }
  }, [processImageResult, uploadedAiImage]);

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
                      onClick={processWithAi}
                      disabled={processImageLoading}
                    >
                      {processImageLoading ? (
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
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">How it works</h3>
              <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
                <li>Upload a clear image of the car</li>
                <li>Click "Extract Details" to analyze with Gemini AI</li>
                <li>Review the extracted information</li>
                <li>Fill in any missing details manually</li>
                <li>Add the car to your inventory</li>
              </ol>
            </div>

            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="font-medium text-amber-800 mb-1">
                Tips for best results
              </h3>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• Use clear, well-lit images</li>
                <li>• Try to capture the entire vehicle</li>
                <li>• For difficult models, use multiple views</li>
                <li>• Always verify AI-extracted information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AiEntry;
