
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share } from "lucide-react";

interface Post {
  id: string;
  text: string;
  imageUrl?: string;
  clapCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profilePicUrl?: string;
  };
}

interface PostCardProps {
  post: Post;
  onClap: (postId: string) => void;
}

export default function PostCard({ post, onClap }: PostCardProps) {
  const [isClapping, setIsClapping] = useState(false);
  const [localClapCount, setLocalClapCount] = useState(post.clapCount);

  const handleClap = async () => {
    if (isClapping) return;
    
    setIsClapping(true);
    setLocalClapCount(prev => prev + 1);
    
    try {
      await onClap(post.id);
    } catch (error) {
      setLocalClapCount(prev => prev - 1);
    } finally {
      setTimeout(() => setIsClapping(false), 300);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border hover-lift"
    >
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-4">
          <Image
            src={post.user.profilePicUrl || "/placeholder.svg"}
            alt={post.user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.text}</p>
          
          {post.imageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={600}
                height={400}
                className="rounded-lg w-full h-auto max-h-96 object-cover"
              />
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClap}
            disabled={isClapping}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              isClapping
                ? "bg-red-50 text-red-600"
                : "hover:bg-red-50 hover:text-red-600 text-gray-600"
            }`}
          >
            <motion.div
              animate={isClapping ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-5 h-5 ${isClapping ? "fill-current" : ""}`} />
            </motion.div>
            <span className="font-medium">{localClapCount}</span>
            <span className="text-sm">claps</span>
          </motion.button>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">Comment</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
              <Share className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
