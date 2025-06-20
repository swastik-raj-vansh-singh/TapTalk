
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Edit3, Calendar, Camera, Save, X } from "lucide-react";
import Image from "./Image";
import { getUserProfile, updateUserProfile, uploadProfileImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => getUserProfile(user?.id || ''),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setProfileImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      setIsUploading(true);
      let profileImageUrl = profile?.profile_image_url;

      // Upload new profile image if selected
      if (profileImageFile) {
        profileImageUrl = await uploadProfileImage(profileImageFile, user.id);
      }

      // Update profile
      const updates = {
        name: editForm.name,
        bio: editForm.bio,
        ...(profileImageUrl && { profile_image_url: profileImageUrl })
      };

      await updateUserProfile(user.id, updates);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated"
      });

      setIsEditing(false);
      setProfileImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImageFile(null);
    setPreviewUrl(null);
    if (profile) {
      setEditForm({
        name: profile.name || '',
        bio: profile.bio || ''
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-24 px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-8"></div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="w-48 h-6 bg-gray-200 rounded"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {/* Cover Section */}
          <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="relative">
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                  <Image
                    src={previewUrl || profile?.profile_image_url || user?.imageUrl || "/placeholder.svg"}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer group">
                      <Camera className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUploading}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isUploading ? 'Saving...' : 'Save'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {!isEditing ? (
              /* Display Mode */
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile?.name || user?.fullName || 'Anonymous User'}
                </h1>
                <p className="text-gray-600 mb-4">{profile?.email || user?.emailAddresses[0]?.emailAddress}</p>
                
                {profile?.bio && (
                  <p className="text-gray-800 leading-relaxed mb-6 bg-gray-50 p-4 rounded-lg">
                    {profile.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-2">
                      <Calendar className="w-6 h-6 inline mr-2" />
                      Member Since
                    </div>
                    <div className="text-gray-600">
                      {new Date(user?.createdAt || profile?.created_at || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">✨ Active User</div>
                    <div className="text-gray-600">Contributing to the community</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {editForm.bio.length}/500
                  </div>
                </div>

                {profileImageFile && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-2">New profile picture selected:</p>
                    <p className="text-xs text-blue-600">{profileImageFile.name}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
