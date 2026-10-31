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
      <Card className="border-white/10 bg-[#0b0b0c] text-white">
        <CardHeader>
          <CardTitle>AI-Powered Car Details Extraction</CardTitle>
          <CardDescription className="text-white/70">
            Upload an image of a car and let AI extact its details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="min-h-[280px] rounded-3xl border-2 border-dashed border-white/20 p-8 text-center transition hover:border-[#ff4d1a] hover:bg-[#ff4d1a]/10">
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
                      className="border-white/20 bg-transparent text-white hover:bg-white/10"
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
                  className="cursor-pointer"
                >
                  <input {...getAiInputProps()} />
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="mb-3 h-12 w-12 text-[#ff4d1a]" />
                    <p className="text-sm text-white">
                      Drag & Drop or click to upload a car Image.
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      Supports: JPG, PNG, WEBP (max 5MB)
                    </p>
                  </div>
                </div>
              )}
              {processImageLoading ? (
                <div className="mx-auto mt-6 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
                  <div className="admin-progress-bar h-full w-1/3 rounded-full bg-[#ff4d1a]" />
                </div>
              ) : null}
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
              <h3 className="mb-2 font-medium text-white">How it works</h3>
              <ol className="list-decimal space-y-2 pl-4 text-sm text-white/70">
                <li>Upload a clear image of the car</li>
                <li>Click &quot;Extract Details&quot; to analyze with Gemini AI</li>
                <li>Review the extracted information</li>
                <li>Fill in any missing details manually</li>
                <li>Add the car to your inventory</li>
              </ol>
            </div>

            <div className="rounded-md border border-[#ff4d1a]/30 bg-[#ff4d1a]/10 p-4">
              <h3 className="mb-1 font-medium text-[#ffb199]">
                Tips for best results
              </h3>
              <ul className="space-y-1 text-sm text-white/80">
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
