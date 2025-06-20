
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";
import { motion } from "framer-motion";
import { fetchPosts, upsertUserProfile, updateClapCount } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

export default function FeedPage() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Fetch posts from database
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // Sync user profile when user data is available
  useEffect(() => {
    if (user) {
      upsertUserProfile({
        clerk_user_id: user.id,
        name: user.fullName || user.firstName || 'Anonymous',
        email: user.primaryEmailAddress?.emailAddress || '',
        profile_image_url: user.imageUrl,
      }).catch(console.error);
    }
  }, [user]);

  // Set up real-time subscription for posts
  useEffect(() => {
    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleNewPost = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const handleClap = async (postId: string, currentCount: number) => {
    try {
      await updateClapCount(postId, currentCount + 1);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error('Error updating clap count:', error);
    }
  };

  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-24 px-4">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading posts. Please try again later.</p>
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
                <PostCard 
                  post={{
                    id: post.id,
                    text: post.content,
                    imageUrl: post.image_url,
                    clapCount: post.clap_count,
                    createdAt: post.created_at,
                    user: {
                      id: post.clerk_user_id,
                      name: post.user_name,
                      profilePicUrl: post.user_profiles?.profile_image_url,
                    }
                  }} 
                  onClap={(postId) => handleClap(postId, post.clap_count)} 
                />
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
