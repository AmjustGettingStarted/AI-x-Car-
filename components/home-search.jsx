"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Camera, Upload, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { processImageSearch } from "@/actions/home";
import { BorderBeam } from "@/components/ui/border-beam";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [searchImage, setSearchImage] = useState(null);

  const router = useRouter();

  const {
    loading: isProcessing,
    fn: processImageFn,
    data: processResult,
    error: processError,
  } = useFetch(processImageSearch);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!searchImage) {
      toast.error("Please upload an image first");
      return;
    }
    await processImageFn(searchImage);
  };

  useEffect(() => {
    if (processResult?.success) {
      const params = new URLSearchParams();
      if (processResult.data.make) params.set("make", processResult.data.make);
      if (processResult.data.bodyType)
        params.set("bodyType", processResult.data.bodyType);
      if (processResult.data.color)
        params.set("color", processResult.data.color);

      setIsModalOpen(false);
      router.push(`/cars?${params.toString()}`);
    }
  }, [processResult, router]);

  useEffect(() => {
    if (processError) {
      toast.error(
        "Failed to analyze image: " + (processError.message || "Unknown error")
      );
    }
  }, [processError]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      setSearchImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        toast.error("Failed to read the image");
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".png", ".jpg"],
      },
      maxFiles: 1,
    });

  return (
    <div className="w-full relative">
      {/* Search Bar Container */}
      <form onSubmit={handleTextSubmit}>
        <div className="relative flex items-center group rounded-full">
          {/* Main Input - Dark Orange Glass Style */}
          <Input
            type="text"
            placeholder="Enter make, model, or use AI Image Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hidden sm:inline pl-6 pr-32 py-7 w-full rounded-full border border-orange-500/30 bg-black/60 backdrop-blur-xl text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-orange-500 shadow-[0_0_25px_rgba(217,70,0,0.2)] transition-all"
          />
          <Input
            type="text"
            placeholder="Search make, model, or AI Image..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:hidden pl-5 pr-28 py-6 w-full rounded-full border border-orange-500/30 bg-black/60 backdrop-blur-xl text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-orange-500 shadow-[0_0_25px_rgba(217,70,0,0.2)]"
          />

          {/* Glowing Border Beam */}
          <BorderBeam
            size={120}
            duration={8}
            delay={0}
            borderWidth={1.5}
            colorFrom="#ff6600"
            colorTo="#ffaa40"
          />

          {/* AI Vision Camera Button */}
          <div className="absolute right-24 sm:right-28 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              title="AI Reverse Image Search"
              className="p-2 rounded-full text-orange-400 hover:text-white hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-500 transition-all duration-300 group/btn cursor-pointer"
            >
              <Camera size={20} className="transition-transform group-hover/btn:scale-110" />
            </button>
          </div>

          {/* Submit Search Button */}
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#d94600] to-[#b33600] hover:from-[#f04e00] hover:to-[#c73d00] text-white px-5 py-5 text-sm font-semibold shadow-md border border-orange-400/30 transition-all duration-300 cursor-pointer"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Floating AI Vision Scan Popover Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg p-6 bg-neutral-900/90 border border-orange-500/30 rounded-3xl shadow-[0_0_50px_rgba(217,70,0,0.3)] text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <Sparkles size={18} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">AI Vision Search</h3>
                  <p className="text-xs text-gray-400">Scan any car photo to find instant matches</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Upload Area */}
            <form onSubmit={handleImageSearch}>
              <div className="border-2 border-dashed border-orange-500/30 hover:border-orange-500/60 rounded-2xl p-6 text-center bg-black/40 transition-colors">
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={imagePreview}
                      alt="car preview"
                      className="h-44 object-contain rounded-xl mb-4 border border-white/10 shadow-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchImage(null);
                        setImagePreview("");
                      }}
                      className="border-red-500/40 text-red-400 hover:bg-red-500/20 hover:text-white"
                    >
                      Remove & Choose Another
                    </Button>
                  </div>
                ) : (
                  <div {...getRootProps()} className="cursor-pointer py-4">
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-orange-400 mb-3 animate-bounce" />
                      <p className="text-sm font-medium text-gray-200 mb-1">
                        {isDragActive && !isDragReject
                          ? "Drop the file here to scan"
                          : "Drag & drop a vehicle photo, or click to browse"}
                      </p>
                      {isDragReject && (
                        <p className="text-xs text-red-400 mb-1">Invalid image type</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Supports: JPG, PNG (max 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Analyze Action */}
              {imagePreview && (
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-5 bg-gradient-to-r from-[#d94600] to-[#b33600] hover:from-[#f04e00] hover:to-[#c73d00] text-white py-6 font-semibold shadow-lg shadow-orange-500/20 border border-orange-400/30 transition-all"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin text-white" />
                      Analyzing Vehicle Intelligence...
                    </span>
                  ) : (
                    "Find Car Matches with AI"
                  )}
                </Button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;