"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";

const AiEntry = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedAiImage, setUploadedAiImage] = useState(null);
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
            <div></div>{" "}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AiEntry;
