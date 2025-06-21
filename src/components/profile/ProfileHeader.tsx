
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Edit3 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface ProfileHeaderProps {
  userProfile: any;
  userPosts: any[];
  isEditing: boolean;
  onEdit: () => void;
  uploadedImageUrl: string;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadImageMutation: any;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function ProfileHeader({
  userProfile,
  userPosts,
  isEditing,
  onEdit,
  uploadedImageUrl,
  onImageUpload,
  uploadImageMutation,
  fileInputRef
}: ProfileHeaderProps) {
  const { user } = useUser();

  return (
    <div className="flex items-start gap-6">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage 
            src={uploadedImageUrl || userProfile?.profile_image_url || user?.imageUrl} 
            alt={userProfile?.name || 'User'} 
          />
          <AvatarFallback className="text-2xl">
            {(userProfile?.name || user?.fullName || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadImageMutation.isPending}
          >
            <Camera className="w-4 h-4" />
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
        {uploadImageMutation.isPending && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="text-white text-xs">Uploading...</div>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userProfile?.name || user?.fullName || 'Anonymous'}
          </h2>
          <p className="text-gray-600">{userProfile?.email || user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        {userProfile?.bio && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Bio</h3>
            <p className="text-gray-700">{userProfile.bio}</p>
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{userPosts.length} posts</span>
          {userProfile?.created_at && (
            <span>Joined {new Date(userProfile.created_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
