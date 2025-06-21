
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { getUserProfile, updateUserProfile, uploadProfileImage, fetchPosts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navbar from "./Navbar";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileEditForm from "./profile/ProfileEditForm";
import UserPostsSection from "./profile/UserPostsSection";

export default function ProfilePage() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    profile_image_url: ''
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => user ? getUserProfile(user.id) : null,
    enabled: !!user?.id,
  });

  const { data: userPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', user?.id],
    queryFn: async () => {
      const allPosts = await fetchPosts();
      return allPosts.filter(post => post.clerk_user_id === user?.id);
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: { name?: string; bio?: string; profile_image_url?: string }) =>
      updateUserProfile(user!.id, updates),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', user?.id] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      setUploadedImageUrl('');
      setEditForm({ name: '', bio: '', profile_image_url: '' });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadProfileImage(file, user!.id),
    onSuccess: (imageUrl) => {
      console.log("Image uploaded successfully, URL:", imageUrl);
      setUploadedImageUrl(imageUrl);
      setEditForm(prev => ({ ...prev, profile_image_url: imageUrl }));
      toast({
        title: "Image uploaded",
        description: "Click Save to update your profile picture.",
      });
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Starting image upload for file:", file.name);
      uploadImageMutation.mutate(file);
    }
  };

  const handleEdit = () => {
    setEditForm({
      name: userProfile?.name || '',
      bio: userProfile?.bio || '',
      profile_image_url: userProfile?.profile_image_url || ''
    });
    setUploadedImageUrl('');
    setIsEditing(true);
  };

  const handleSave = () => {
    const updates: { name?: string; bio?: string; profile_image_url?: string } = {
      name: editForm.name,
      bio: editForm.bio
    };
    
    if (uploadedImageUrl) {
      updates.profile_image_url = uploadedImageUrl;
    }
    
    updateProfileMutation.mutate(updates);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ name: '', bio: '', profile_image_url: '' });
    setUploadedImageUrl('');
  };

  const handleClap = () => {
    queryClient.invalidateQueries({ queryKey: ['userPosts', user?.id] });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex justify-center items-center min-h-[50vh]">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-4 pb-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Profile
              {!isEditing && (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" disabled={updateProfileMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <ProfileHeader
                userProfile={userProfile}
                userPosts={userPosts}
                isEditing={isEditing}
                onEdit={handleEdit}
                uploadedImageUrl={uploadedImageUrl}
                onImageUpload={handleImageUpload}
                uploadImageMutation={uploadImageMutation}
                fileInputRef={fileInputRef}
              />
            ) : (
              <div className="flex items-start gap-6">
                <ProfileHeader
                  userProfile={userProfile}
                  userPosts={userPosts}
                  isEditing={isEditing}
                  onEdit={handleEdit}
                  uploadedImageUrl={uploadedImageUrl}
                  onImageUpload={handleImageUpload}
                  uploadImageMutation={uploadImageMutation}
                  fileInputRef={fileInputRef}
                />
                <div className="flex-1">
                  <ProfileEditForm
                    editForm={editForm}
                    setEditForm={setEditForm}
                    uploadedImageUrl={uploadedImageUrl}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <UserPostsSection
          userPosts={userPosts}
          postsLoading={postsLoading}
          onClap={handleClap}
        />
      </div>
    </div>
  );
}
