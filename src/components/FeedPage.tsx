
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";
import { motion } from "framer-motion";
import { fetchPosts, upsertUserProfile } from "@/lib/api";
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

  // Set up real-time subscription for posts and claps
  useEffect(() => {
    const channel = supabase
      .channel('feed-updates')
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_claps'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          queryClient.invalidateQueries({ queryKey: ['user-profile'] });
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

  const handleClap = () => {
    // The clap is already handled in PostCard, just trigger refresh
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-24 px-4">
          <div className="space-y-6">
            {/* Create Post Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full h-20 bg-gray-200 rounded mb-4"></div>
              <div className="w-24 h-8 bg-gray-200 rounded"></div>
            </div>

            {/* Post Skeletons */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-2xl mx-auto pt-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-xl shadow-sm"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">😞</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">Error loading posts. Please try again later.</p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['posts'] })}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <main className="max-w-2xl mx-auto pt-24 px-4 pb-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome to TapTalk
          </h1>
          <p className="text-gray-600">Share your thoughts and connect with the community</p>
        </motion.div>

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
              className="text-center py-12 bg-white rounded-xl shadow-sm"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Be the first to share something amazing!</p>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded mx-auto"></div>
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
                  onClap={handleClap}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Load More Footer */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12 py-8"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">You're all caught up! 🎉</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
