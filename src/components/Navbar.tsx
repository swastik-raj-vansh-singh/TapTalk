
import { useUser, UserButton } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/api";

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const location = useLocation();

  // Fetch user profile to get updated name
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => user ? getUserProfile(user.id) : null,
    enabled: !!user?.id && isSignedIn,
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              SocialApp
            </Link>
            
            {isSignedIn && (
              <div className="hidden md:flex space-x-6">
                <Link 
                  to="/feed" 
                  className={`font-medium transition-colors ${
                    isActive('/feed') 
                      ? 'text-primary border-b-2 border-primary pb-2' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Feed
                </Link>
                <Link 
                  to="/profile" 
                  className={`font-medium transition-colors ${
                    isActive('/profile') 
                      ? 'text-primary border-b-2 border-primary pb-2' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Profile
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  Welcome, {userProfile?.name || user?.fullName || "User"}!
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
