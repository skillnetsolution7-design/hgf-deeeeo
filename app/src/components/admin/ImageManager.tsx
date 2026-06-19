"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Star,
  GripVertical,
  Loader2,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  addProductImage,
  deleteProductImage,
  setPrimaryImage,
} from "@/lib/supabase";
import { ProductImage } from "@/types";

interface ImageManagerProps {
  productId: string;
  images: ProductImage[];
  onChange: () => void;
}

export function ImageManager({ productId, images, onChange }: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      if (!cloudName || !uploadPreset) {
        toast({
          title: "Configuration Error",
          description: "Cloudinary is not configured.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);
          formData.append("folder", `izzy-signature/products/${productId}`);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}`);
          }

          const data = await response.json();

          // Save to Supabase
          await addProductImage({
            product_id: productId,
            cloudinary_public_id: data.public_id,
            image_url: data.secure_url,
            is_primary: images.length === 0 && i === 0, // First image is primary
            sort_order: images.length + i,
          });

          setUploadProgress(((i + 1) / files.length) * 100);
        }

        toast({
          title: "Upload Complete",
          description: `${files.length} image(s) uploaded successfully.`,
          variant: "success",
        });
        onChange();
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload images. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [cloudName, uploadPreset, productId, images.length, onChange]
  );

  const handleDelete = async (image: ProductImage) => {
    try {
      await deleteProductImage(image.id);
      toast({
        title: "Image Deleted",
        description: "Image removed successfully.",
        variant: "success",
      });
      onChange();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image.",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      await setPrimaryImage(productId, imageId);
      toast({
        title: "Primary Image Set",
        description: "Primary image updated.",
        variant: "success",
      });
      onChange();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set primary image.",
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    setDraggedIndex(null);
  };

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gold hover:bg-gold/5 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-gold", "bg-gold/5");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("border-gold", "bg-gold/5");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-gold", "bg-gold/5");
          const files = e.dataTransfer.files;
          if (files.length > 0 && fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            for (let i = 0; i < files.length; i++) {
              dataTransfer.items.add(files[i]);
            }
            fileInputRef.current.files = dataTransfer.files;
            handleFileSelect({
              target: fileInputRef.current,
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        {isUploading ? (
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" />
            <p className="text-sm text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
            <div className="w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <ImagePlus className="w-10 h-10 text-gray-400 mx-auto" />
            <p className="text-sm font-medium text-gray-700">
              Drag & drop images here or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports: JPG, PNG, WebP (max 10MB each)
            </p>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {sortedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sortedImages.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                image.is_primary ? "border-gold shadow-lg" : "border-gray-200"
              } ${draggedIndex === index ? "opacity-50" : ""}`}
            >
              {/* Image */}
              <div className="relative aspect-square">
                <Image
                  src={image.image_url}
                  alt="Product image"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>

              {/* Primary Badge */}
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Primary
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.is_primary && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(image.id);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gold transition-colors"
                    title="Set as primary"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image);
                  }}
                  className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drag Handle */}
              <div className="absolute bottom-2 left-2 p-1.5 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedImages.length === 0 && !isUploading && (
        <div className="text-center py-8 text-gray-400">
          <Upload className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No images yet. Upload your first image above.</p>
        </div>
      )}
    </div>
  );
}
