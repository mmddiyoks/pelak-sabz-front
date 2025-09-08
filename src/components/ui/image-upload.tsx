"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Axios } from "@/@core/lib/axios/axios";
import { Logger } from "@/@core/lib/logger";

const logger = Logger.get("ImageUpload");

interface ImageUploadProps {
    onImageUploaded?: (imagePath: string) => void;
    defaultImage?: string;
    className?: string;
    label?: string;
    dragActiveText?: string;
    dragInactiveText?: string;
    previewSize?: "sm" | "md" | "lg";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageUploaded,
    defaultImage,
    className,
    label = "تصویر",
    dragActiveText = "فایل خود را اینجا رها کنید...",
    dragInactiveText = "برای آپلود تصویر، فایل خود را اینجا بکشید یا کلیک کنید",
    previewSize = "md",
}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(
        defaultImage ? `https://plaque.isfahan.ir/api/${defaultImage}` : null
    );
    const [isUploading, setIsUploading] = useState(false);

    // Drag-and-drop functionality using react-dropzone
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setIsUploading(true);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            // Create FormData with the correct parameter name 'Files'
            const formData = new FormData();
            formData.append("Files", file);

            // Log the form data to verify the parameter name
            logger.info("Uploading file with parameter name 'Files'", { fileName: file.name });

            // Use direct Axios call with the correct endpoint and parameter name
            Axios.post("https://smartplaque.ir/Treeapi/v1/attachment/uploadfiles", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "accept": "application/json, text/plain, */*"
                },
                withCredentials: true
            })
                .then((response) => {
                    // Handle both response formats - array or payload object
                    let imagePath;
                    if (Array.isArray(response.data)) {
                        // If response is an array, take the first item
                        imagePath = response.data[0];
                    } else if (response.data && response.data.payload && response.data.payload[0]) {
                        // If response has payload structure
                        imagePath = response.data.payload[0];
                    } else {
                        throw new Error("Invalid response format");
                    }

                    onImageUploaded?.(imagePath);
                    toast.success("تصویر با موفقیت آپلود شد");
                })
                .catch((error) => {
                    logger.error("Error uploading image", error);
                    // toast.error("خطا در آپلود تصویر");
                    setImagePreview(defaultImage ? `https://plaque.isfahan.ir/api/${defaultImage}` : null);
                })
                .finally(() => {
                    setIsUploading(false);
                });
        },
        [defaultImage, onImageUploaded]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
    });

    const previewSizeClasses = {
        sm: "w-20 h-20",
        md: "w-32 h-32",
        lg: "w-48 h-48",
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium mb-2">{label}</label>
            )}
            <div
                {...getRootProps()}
                className={cn(
                    "w-full border-dashed border-2 p-4 rounded-lg flex flex-col justify-center items-center transition-colors",
                    isDragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-primary-300",
                    isUploading && "opacity-70 cursor-wait",
                    className
                )}
            >
                <input {...getInputProps()} disabled={isUploading} />
                {isDragActive ? (
                    <p className="text-primary-600">{dragActiveText}</p>
                ) : (
                    <p className="text-gray-500">{dragInactiveText}</p>
                )}

                {/* Image preview */}
                {imagePreview && (
                    <div className="mt-4">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className={cn(
                                "object-cover rounded-lg",
                                previewSizeClasses[previewSize]
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload; 