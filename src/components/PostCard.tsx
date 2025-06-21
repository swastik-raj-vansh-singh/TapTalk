
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Image from "./Image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { addClap, hasUserClapped } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/lib/api";
import CommentSection from "./CommentSection";

interface PostCardProps {
  post: Post;
  onClap?: (postId: string) => void;
}

export default function PostCard({ post, onClap }: PostCardProps) {
  const [isClapping, setIsClapping] = useState(false);
  const [localClapCount, setLocalClapCount] = useState(post.clap_count);
  const [userHasClapped, setUserHasClapped] = useState(false);
  const [checkingClapStatus, setCheckingClapStatus] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  // Check if user has already clapped this post
  useEffect(() => {
    const checkClapStatus = async () => {
      if (!user?.id) {
        setCheckingClapStatus(false);
        return;
      }

      try {
        const hasClapped = await hasUserClapped(user.id, post.id);
        setUserHasClapped(hasClapped);
      } catch (error) {
        console.error('Error checking clap status:', error);
      } finally {
        setCheckingClapStatus(false);
      }
    };

    checkClapStatus();
  }, [user?.id, post.id]);

  const handleClap = async () => {
    if (!user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to clap posts",
        variant: "destructive"
      });
      return;
    }

    if (isClapping || userHasClapped) return;
    
    setIsClapping(true);
    setLocalClapCount(prev => prev + 1);
    
    try {
      await addClap(user.id, post.id);
      setUserHasClapped(true);
      if (onClap) {
        onClap(post.id);
      }
      
      toast({
        title: "👏 Clapped!",
        description: "Your clap has been added to this post"
      });
    } catch (error: any) {
      setLocalClapCount(prev => prev - 1);
      
      if (error.message?.includes("already clapped")) {
        setUserHasClapped(true);
        toast({
          title: "Already clapped",
          description: "You can only clap once per post",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add clap. Please try again.",
          variant: "destructive"
        });
      }
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
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={post.user_profiles?.profile_image_url || "/placeholder.svg"}
              alt={post.user_name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.user_name}</h3>
            <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          
          {post.image_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <div className="rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={post.image_url}
                  alt="Post image"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain max-h-96"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: userHasClapped ? 1 : 1.05 }}
            whileTap={{ scale: userHasClapped ? 1 : 0.95 }}
            onClick={handleClap}
            disabled={isClapping || userHasClapped || checkingClapStatus}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              userHasClapped
                ? "bg-red-100 text-red-600 cursor-not-allowed"
                : isClapping
                ? "bg-red-50 text-red-600"
                : "hover:bg-red-50 hover:text-red-600 text-gray-600"
            }`}
          >
            <motion.div
              animate={isClapping ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-5 h-5 ${userHasClapped || isClapping ? "fill-current" : ""}`} />
            </motion.div>
            <span className="font-medium">{localClapCount}</span>
            <span className="text-sm">
              {userHasClapped ? "clapped" : "claps"}
            </span>
          </motion.button>
        </div>

        {/* Comments Section */}
        <CommentSection postId={post.id} />
      </div>
    </motion.div>
  );
}
