
"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, User, Plus } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/feed" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-gray-800">MicroSocial</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            <Link
              href="/feed"
              className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:block">Feed</span>
            </Link>
            
            <Link
              href="/profile"
              className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:block">Profile</span>
            </Link>

            {/* User Button */}
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
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
