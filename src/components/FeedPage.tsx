
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";
import { motion } from "framer-motion";

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

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleClap = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/clap`, {
        method: "POST",
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, clapCount: updatedPost.clapCount } : post
        ));
      }
    } catch (error) {
      console.error("Error clapping post:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-24 px-4">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-2xl mx-auto pt-24 px-4 pb-8">
        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <CreatePost onPostCreated={handleNewPost} />
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500">Be the first to share something!</p>
            </motion.div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} onClap={handleClap} />
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
