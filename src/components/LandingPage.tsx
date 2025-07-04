
"use client";

import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Heart, Users, Zap, Globe, Twitter, Github, Mail, ArrowRight, MessageCircle, Sparkles, Star, Coffee, Smile, Camera, Music } from "lucide-react";
import { LavaLamp } from "./ui/fluid-blob";
import { BentoCard, BentoGrid } from "./ui/bento-grid";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const features = [
    {
      Icon: Heart,
      name: "Express Yourself",
      description: "Share your thoughts, feelings, and moments with authentic expression that resonates with your community.",
      href: "#express",
      cta: "Start Expressing",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-80" />
      ),
      className: "",
    },
    {
      Icon: Users,
      name: "Connect",
      description: "Build meaningful relationships and find your tribe through shared interests and genuine conversations.",
      href: "#connect",
      cta: "Find Your Tribe",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-80" />
      ),
      className: "",
    },
    {
      Icon: Zap,
      name: "Engage",
      description: "Interact with content through our innovative tap system and participate in dynamic discussions.",
      href: "#engage",
      cta: "Start Engaging",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 opacity-80" />
      ),
      className: "",
    },
    {
      Icon: Globe,
      name: "Discover",
      description: "Explore new perspectives, trending topics, and discover content that inspires and enlightens you.",
      href: "#discover",
      cta: "Explore Now",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-500/20 opacity-80" />
      ),
      className: "",
    },
  ];

  const handleWatchDemo = () => {
    window.open('https://drive.google.com/file/d/1z-XESz869KWlk5MoEM7aHF-_7mYWU84U/view?usp=sharing', '_blank');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="glass-effect sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                TapTalk
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 sm:space-x-6"
            >
              <a href="#features" className="hidden sm:block text-gray-700 hover:text-purple-600 transition-colors font-medium">Features</a>
              <Link to="/auth" className="px-3 sm:px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm sm:text-base">
                Sign In
              </Link>
              <Link to="/auth" className="px-3 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Fluid Background */}
      <section className="relative h-screen w-screen flex flex-col justify-center items-center">
        <LavaLamp />
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-xl rounded-full"></div>
              <div className="relative flex items-center bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-purple-200/50 shadow-lg">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-purple-700 font-semibold text-lg">
                  Revolutionizing Digital Connections
                </span>
                <Sparkles className="w-6 h-6 text-purple-600 ml-2" />
              </div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-10 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent blur-sm scale-105"></div>
            <div 
              className="relative text-gray-900 font-extrabold"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.7), 3px 3px 6px rgba(0,0,0,0.8)',
                WebkitTextStroke: '2px rgba(255,255,255,0.8)'
              }}
            >
              TapTalk
            </div>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/auth" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 text-lg flex items-center group">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={handleWatchDemo}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-gray-800 font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 text-lg"
            >
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Bento Grid */}
      <section id="features" className="py-20 px-4 bg-gradient-to-br from-gray-50/30 to-white/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose TapTalk?
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <BentoGrid>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BentoCard {...feature} />
                </motion.div>
              ))}
            </BentoGrid>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50/20 to-gray-100/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/30 backdrop-blur-sm border border-gray-200/30 p-12 rounded-2xl shadow-lg"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Join thousands of users already sharing their stories and building meaningful connections on TapTalk
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg text-lg">
                Create Your Account
              </Link>
              <button className="px-8 py-4 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-lg">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50/30 text-gray-700 py-16 px-4 border-t border-gray-200/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">TapTalk</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Where thoughts take shape and conversations flow. Connect with people who share your passions 
                and discover new perspectives in a more meaningful way.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/swastik-raj-vansh-singh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/swastikrajvanshsingh/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="mailto:swastikrajvanshsingh0@gmail.com" 
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-gray-800 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-gray-300 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 TapTalk. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm mt-4 md:mt-0">
              Made with ❤️ by <a 
                href="https://github.com/swastik-raj-vansh-singh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-600 transition-colors"
              >
                Swastik Raj Vansh Singh
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
