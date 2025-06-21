
import { Heart, Star, Coffee } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-purple-50 border-t border-pink-100 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          {/* Cute decorative elements */}
          <div className="flex justify-center items-center space-x-2 text-pink-400">
            <Star className="w-4 h-4" />
            <Heart className="w-5 h-5 fill-current" />
            <Star className="w-4 h-4" />
          </div>
          
          {/* Main message */}
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">
              Made with <Heart className="w-4 h-4 inline text-red-500 fill-current mx-1" /> and lots of <Coffee className="w-4 h-4 inline text-brown-600 mx-1" />
            </p>
            <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Crafted by Swastik Raj Vansh Singh
            </p>
          </div>
          
          {/* Cute bottom decoration */}
          <div className="flex justify-center items-center space-x-1 text-pink-300 text-xs">
            <span>✨</span>
            <span>Keep spreading joy!</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
