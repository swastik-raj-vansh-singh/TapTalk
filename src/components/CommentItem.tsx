
import { Comment } from "@/lib/api";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
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
    <div className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold text-sm text-gray-900">{comment.user_name}</span>
          <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
        </div>
        <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}
