
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchComments, createComment, Comment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: showComments,
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment("");
      // Auto-minimize comment section after commenting
      setShowComments(false);
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (!user?.id) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment on posts",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      post_id: postId,
      clerk_user_id: user.id,
      user_name: user.fullName || user.username || 'Anonymous',
      content: newComment.trim(),
    });
  };

  return (
    <div className="border-t border-gray-100 pt-4">
      <Button
        variant="ghost"
        onClick={() => setShowComments(!showComments)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary"
      >
        <MessageCircle className="w-5 h-5" />
        <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
      </Button>

      {showComments && (
        <div className="mt-4 space-y-4">
          {/* Add comment form */}
          {user && (
            <div className="flex space-x-3">
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || createCommentMutation.isPending}
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Comments list */}
          {isLoading ? (
            <div className="text-center py-4">
              <div className="text-gray-500">Loading comments...</div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
