
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Edit3, Calendar, Heart } from "lucide-react";
import Image from "./Image";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicUrl?: string;
  bio?: string;
  createdAt: string;
  _count: {
    posts: number;
  };
  totalClaps: number;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Mock profile data
  const profile: UserProfile = {
    id: user?.id || "demo",
    name: user?.fullName || "Demo User",
    email: user?.emailAddresses[0]?.emailAddress || "demo@example.com",
    profilePicUrl: user?.imageUrl,
    bio: "Welcome to my profile! I'm excited to be part of the MicroSocial community.",
    createdAt: new Date().toISOString(),
    _count: { posts: 1 },
    totalClaps: 5
  };

  useEffect(() => {
    if (profile) {
      setEditForm({ name: profile.name, bio: profile.bio || "" });
    }
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock update - in real app would call API
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-24 px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-4">
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
          <div className="h-48 gradient-bg relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="relative">
                <Image
                  src={user?.imageUrl || "/placeholder.svg"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
              </button>
            </div>

            {!isEditing ? (
              /* Display Mode */
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile?.name}
                </h1>
                <p className="text-gray-600 mb-4">{profile?.email}</p>
                
                {profile?.bio && (
                  <p className="text-gray-800 leading-relaxed mb-6">{profile.bio}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{profile?._count.posts || 0}</div>
                    <div className="text-gray-600">Posts</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">{profile?.totalClaps || 0}</div>
                    <div className="text-gray-600">Total Claps</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Joined {new Date(profile?.createdAt || "").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleEditSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
