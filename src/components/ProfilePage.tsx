
import { useUser } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Save, X, User, Mail, Calendar, MapPin } from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/lib/api";
import { Iridescence } from "@/components/ui/iridescence";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ProfilePage() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => user ? getUserProfile(user.id) : null,
    enabled: !!user?.id,
  });

  const handleEdit = () => {
    setEditedName(userProfile?.name || user?.fullName || "");
    setEditedBio(userProfile?.bio || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      await updateUserProfile(user.id, {
        name: editedName,
        bio: editedBio,
      });
      
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName("");
    setEditedBio("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <Iridescence 
          className="fixed inset-0 w-full h-full -z-10" 
          iridescenceColor={[0.8, 0.9, 1.0]}
          mouseReact={false} 
          amplitude={0.05}
          speed={0.5}
        />
        <Navbar />
        <div className="pt-16 sm:pt-20 flex justify-center items-center min-h-[50vh]">
          <div className="text-gray-700 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  const displayName = userProfile?.name || user?.fullName || user?.username || "Anonymous";
  const displayBio = userProfile?.bio || "No bio yet";
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown";

  return (
    <div className="min-h-screen relative">
      {/* Iridescence Background */}
      <Iridescence 
        className="fixed inset-0 w-full h-full -z-10" 
        iridescenceColor={[0.8, 0.9, 1.0]}
        mouseReact={false} 
        amplitude={0.05}
        speed={0.5}
      />
      
      <Navbar />
      <div className="pt-16 sm:pt-20 max-w-2xl mx-auto px-4 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/20"
        >
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-0">
              <div className="relative">
                <img
                  src={user?.imageUrl || "/placeholder.svg"}
                  alt={displayName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-xl sm:text-2xl font-bold bg-white/70 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                    <textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="w-full bg-white/70 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
                    <p className="text-gray-600 leading-relaxed">{displayBio}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Edit Controls */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-lg text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-lg text-sm sm:text-base"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-lg text-sm sm:text-base"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-center space-x-3 text-gray-600 text-sm sm:text-base">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 text-sm sm:text-base">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Joined {joinedDate}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 text-sm sm:text-base">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>@{user?.username}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>TapTalk Community</span>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
