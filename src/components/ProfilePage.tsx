import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { getUserProfile, updateUserProfile, uploadProfileImage, fetchPosts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Edit3, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navbar from "./Navbar";
import PostCard from "./PostCard";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      setUploadedImageUrl(''); // Clear temporary image URL
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
      // Store the uploaded image URL temporarily instead of immediately updating profile
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
    setUploadedImageUrl(''); // Clear any temporary uploads
    setIsEditing(true);
  };

  const handleSave = () => {
    const updates: { name?: string; bio?: string; profile_image_url?: string } = {
      name: editForm.name,
      bio: editForm.bio
    };
    
    // Only include profile_image_url if a new image was uploaded
    if (uploadedImageUrl) {
      updates.profile_image_url = uploadedImageUrl;
    }
    
    updateProfileMutation.mutate(updates);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ name: '', bio: '', profile_image_url: '' });
    setUploadedImageUrl(''); // Clear any temporary uploads
  };

  const handleClap = () => {
    // Refresh user posts to get updated clap counts
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

  // Get the current display image - use uploaded image if available, otherwise use profile image
  const currentDisplayImage = uploadedImageUrl || userProfile?.profile_image_url || user?.imageUrl;

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
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={currentDisplayImage} 
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
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploadImageMutation.isPending && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs">Uploading...</div>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                {!isEditing ? (
                  <>
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
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                    {uploadedImageUrl && (
                      <div className="text-sm text-green-600">
                        ✓ New profile picture uploaded. Click Save to apply changes.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Posts */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Posts</h3>
          {postsLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading your posts...</div>
            </div>
          ) : userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} onClap={handleClap} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't posted anything yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
