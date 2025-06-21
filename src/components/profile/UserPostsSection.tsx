
import PostCard from "@/components/PostCard";

interface UserPostsSectionProps {
  userPosts: any[];
  postsLoading: boolean;
  onClap: () => void;
}

export default function UserPostsSection({
  userPosts,
  postsLoading,
  onClap
}: UserPostsSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Your Posts</h3>
      {postsLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading your posts...</div>
        </div>
      ) : userPosts.length > 0 ? (
        <div className="space-y-6">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} onClap={onClap} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't posted anything yet.</p>
        </div>
      )}
    </div>
  );
}
