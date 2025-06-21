
"use client";

import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api";

export default function Navbar() {
  const { user } = useUser();

  // Fetch user profile to get updated name and profile picture
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => user ? getUserProfile(user.id) : null,
    enabled: !!user?.id,
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TapTalk
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            <Link
              to="/feed"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:block">Feed</span>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:block">Profile</span>
            </Link>

            {/* User Button */}
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 shadow-lg",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
