
"use client";

import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Camera, Send, X } from "lucide-react";
import Image from "./Image";
import { createPost, uploadImage } from "@/lib/api";
import { toast } from "sonner";

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    setIsLoading(true);
    try {
      let imageUrl: string | undefined;

      // Upload image if present
      if (imageFile) {
        const fileName = `${user.id}_${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadImage(imageFile, fileName);
      }

      // Create post in database
      await createPost({
        content: text,
        image_url: imageUrl,
        clerk_user_id: user.id,
        user_name: user.fullName || user.firstName || 'Anonymous',
      });

      // Reset form
      setText("");
      setImageFile(null);
      setImagePreview(null);
      
      // Notify parent component
      onPostCreated();
      
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      <div className="flex items-start space-x-4">
        <Image
          src={user?.imageUrl || "/placeholder.svg"}
          alt="Your avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
        
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows={3}
            disabled={isLoading}
          />

          {/* Image Preview */}
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 relative"
            >
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={300}
                className="rounded-lg max-w-full h-auto"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1 text-gray-500 hover:text-primary cursor-pointer transition-colors">
                <Camera className="w-5 h-5" />
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? "Posting..." : "Post"}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
