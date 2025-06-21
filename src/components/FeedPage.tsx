
import { useUser } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchPosts, upsertUserProfile } from "@/lib/api";
import { Iridescence } from "@/components/ui/iridescence";
import Navbar from "./Navbar";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import Footer from "./Footer";

export default function FeedPage() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Create or update user profile when user data is available
  useEffect(() => {
    if (user) {
      const createUserProfile = async () => {
        try {
          await upsertUserProfile({
            clerk_user_id: user.id,
            name: user.fullName || user.username || 'Anonymous',
            email: user.primaryEmailAddress?.emailAddress || '',
            profile_image_url: user.imageUrl
          });
          // Refresh user profile data after upserting
          queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
        } catch (error) {
          console.error("Error creating user profile:", error);
        }
      };
      createUserProfile();
    }
  }, [user, queryClient]);

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    refetchInterval: 30000,
  });

  const handleClap = () => {
    // Refresh posts to get updated clap counts
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <Iridescence 
          className="fixed inset-0 w-full h-full -z-10" 
          color={[0.8, 0.9, 1.0]}
          mouseReact={false} 
          amplitude={0.05}
          speed={0.5}
        />
        <Navbar />
        <div className="pt-20 flex justify-center items-center min-h-[50vh]">
          <div className="text-gray-700 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">Loading posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <Iridescence 
          className="fixed inset-0 w-full h-full -z-10" 
          color={[0.8, 0.9, 1.0]}
          mouseReact={false} 
          amplitude={0.05}
          speed={0.5}
        />
        <Navbar />
        <div className="pt-20 flex justify-center items-center min-h-[50vh]">
          <div className="text-red-600 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">Error loading posts. Please try again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Iridescence Background */}
      <Iridescence 
        className="fixed inset-0 w-full h-full -z-10" 
        color={[0.8, 0.9, 1.0]}
        mouseReact={false} 
        amplitude={0.05}
        speed={0.5}
      />
      
      <Navbar />
      <div className="pt-20 max-w-2xl mx-auto px-4 pb-8 relative z-10">
        <CreatePost onPostCreated={() => queryClient.invalidateQueries({ queryKey: ['posts'] })} />
        
        <div className="space-y-6 mt-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onClap={handleClap} />
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg bg-white/80 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg inline-block">No posts yet. Be the first to share something!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
