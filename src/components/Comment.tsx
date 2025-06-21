
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  user_name: string;
  user_profile_image_url?: string;
  created_at: string;
  like_count: number;
}

interface CommentProps {
  comment: Comment;
}

export default function Comment({ comment }: CommentProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.like_count);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="flex space-x-3 py-3">
      <Avatar className="w-8 h-8">
        <AvatarImage 
          src={comment.user_profile_image_url || "/placeholder.svg"} 
          alt={comment.user_name} 
        />
        <AvatarFallback className="text-xs">
          {comment.user_name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-sm">{comment.user_name}</span>
            <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
          </div>
          <p className="text-sm text-gray-800">{comment.content}</p>
        </div>
        
        <div className="flex items-center mt-1 ml-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-xs text-gray-500 hover:text-red-500"
            onClick={handleLike}
          >
            <Heart className={`w-3 h-3 mr-1 ${isLiked ? 'fill-current text-red-500' : ''}`} />
            {likeCount > 0 && likeCount}
          </Button>
        </div>
      </div>
    </div>
  );
}
