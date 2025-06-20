
"use client";

import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Heart, Users, Zap, Globe, Twitter, Github, Mail } from "lucide-react";
import { LavaLamp } from "./ui/fluid-blob";
import { BentoCard, BentoGrid } from "./ui/bento-grid";

export default function LandingPage() {
  const features = [
    {
      Icon: Heart,
      name: "Express Yourself",
      description: "Share your thoughts and moments with the world in creative ways",
      href: "#",
      cta: "Start Expressing",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-red-400/20" />
      ),
      className: "lg:col-span-1",
    },
    {
      Icon: Users,
      name: "Connect",
      description: "Build meaningful connections with like-minded people from around the globe",
      href: "#",
      cta: "Find Your Tribe",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20" />
      ),
      className: "lg:col-span-1",
    },
    {
      Icon: Zap,
      name: "Engage",
      description: "React with taps and show appreciation for great content instantly",
      href: "#",
      cta: "Start Engaging",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20" />
      ),
      className: "lg:col-span-1",
    },
    {
      Icon: Globe,
      name: "Discover",
      description: "Explore a global feed of diverse perspectives and stories",
      href: "#",
      cta: "Explore Now",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20" />
      ),
      className: "lg:col-span-1",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">TapTalk</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-700 hover:text-primary transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Fluid Background */}
      <section className="relative h-screen w-screen flex flex-col justify-center items-center">
        <LavaLamp />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-gray-900 drop-shadow-2xl whitespace-nowrap mb-6"
          >
            TapTalk
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-center text-gray-800 drop-shadow-lg max-w-2xl leading-relaxed mb-10 mx-auto font-medium"
          >
            Where thoughts take shape and conversations flow like liquid mercury through infinite connections.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-lg">
                Start Your Journey
              </button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Bento Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Why Choose TapTalk?
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[20rem]">
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
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 p-12 rounded-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 mb-8">
              Join thousands of users already sharing their stories on TapTalk
            </p>
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                Create Your Account
              </button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className="text-2xl font-bold">TapTalk</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Where thoughts take shape and conversations flow. Connect with people who share your passions and discover new perspectives.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 TapTalk. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Made with ❤️ for meaningful connections
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
