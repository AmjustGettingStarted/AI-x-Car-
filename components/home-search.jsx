"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Camera, Upload, Bot, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { processImageSearch } from "@/actions/home";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/* Unified Search Bar Component Container */}
        <form onSubmit={handleTextSubmit}>
          <div className="group relative flex items-center rounded-full border border-white/10 bg-black/60 backdrop-blur-xl transition-all duration-300 ease-out hover:border-[#FF5F1F]/40 hover:shadow-[0_0_40px_rgba(255,95,31,0.08)] hover:-translate-y-0.5 focus-within:border-[#FF5F1F]/70 focus-within:shadow-[0_0_45px_rgba(255,95,31,0.15)] focus-within:-translate-y-0.5">
            {/* Main Input - Desktop */}
            <Input
              type="text"
              placeholder="Search your dream car..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hidden sm:inline pl-7 pr-36 py-7 w-full border-none bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            />
            {/* Main Input - Mobile */}
            <Input
              type="text"
              placeholder="Search your dream car..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:hidden pl-5 pr-32 py-6 w-full border-none bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-sm"
            />

            {/* Glowing Border Beam */}
            <BorderBeam
              size={120}
              duration={8}
              delay={0}
              borderWidth={1.5}
              colorFrom="#FF5F1F"
              colorTo="#FF5F1F"
              reverse={false}
            />

            {/* Action Group (Camera Button + Saved Cars Styled Search Button) */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* AI Vision Camera Button Trigger */}
              <DialogTrigger asChild>
                <button
                  type="button"
                  title="AI Reverse Image Search"
                  className="p-2.5 rounded-full text-[#FF5F1F] bg-black/40 hover:bg-[#FF5F1F]/10 border border-[#FF5F1F]/35 hover:border-[#FF5F1F]/80 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
                >
                  <Camera
                    size={18}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </button>
              </DialogTrigger>

              {/* Search Button Styled Exactly like Saved Cars */}
              <Button
                type="submit"
                variant="outline"
                className="
                  group
                  cursor-pointer
                  rounded-full
                  px-6
                  py-5
                  border border-[#FF5F1F]/35
                  bg-black/40
                  hover:bg-[#FF5F1F]/10
                  hover:border-[#FF5F1F]/80
                  text-white
                  hover:text-white
                  backdrop-blur-md
                  font-medium
                  text-sm
                  transition-all
                  duration-300
                  ease-out
                  hover:-translate-y-0.5
                  hover:shadow-[0_8px_30px_rgba(255,95,31,0.15)]
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >
                Search
              </Button>
            </div>
          </div>
        </form>

        {/* Shadcn Glassmorphism Modal Dialog */}
        <DialogContent className="sm:max-w-lg w-[92vw] max-h-[85vh] overflow-y-auto p-6 rounded-3xl bg-black/80 backdrop-blur-xl border border-[#FF5F1F]/30 text-white shadow-[0_0_50px_rgba(255,95,31,0.25)]">
          <DialogHeader className="text-left pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#FF5F1F]/20 to-black border border-[#FF5F1F]/40 shadow-inner shrink-0 text-[#FF5F1F]">
                <Bot size={22} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  AI Vision Search
                  <span className="w-2 h-2 rounded-full bg-[#FF5F1F] animate-pulse" />
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-400 mt-0.5">
                  Scan any vehicle photo for instant intelligent matching
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Upload Area & Form */}
          <form onSubmit={handleImageSearch} className="mt-2 space-y-4">
            <div className="border border-dashed border-[#FF5F1F]/40 hover:border-[#FF5F1F] rounded-2xl p-5 text-center bg-black/50 backdrop-blur-md transition-colors">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="car preview"
                      className="h-44 sm:h-52 w-full object-cover rounded-xl mb-4 border border-white/10 shadow-lg"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchImage(null);
                      setImagePreview("");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-medium transition-all cursor-pointer"
                  >
                    <X size={14} /> Remove & Choose Another
                  </Button>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer py-6">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-[#FF5F1F] mb-3 animate-bounce" />
                    <p className="text-sm font-medium text-gray-200 mb-1 text-center">
                      {isDragActive && !isDragReject
                        ? "Drop the file here to scan"
                        : "Drag & drop a vehicle photo, or click to browse"}
                    </p>
                    {isDragReject && (
                      <p className="text-xs text-red-400 mb-1">
                        Invalid image type
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Supports: JPG, PNG (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            {imagePreview && (
              <Button
                type="submit"
                variant="outline"
                disabled={isProcessing}
                className="w-full cursor-pointer rounded-xl border border-[#FF5F1F]/35 bg-black/40 hover:bg-[#FF5F1F]/10 hover:border-[#FF5F1F]/80 text-white backdrop-blur-md py-6 font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,95,31,0.15)] active:translate-y-0 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin text-[#FF5F1F]" />
                    Analyzing Vehicle Intelligence...
                  </span>
                ) : (
                  "Find Car Matches with AI"
                )}
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeSearch;