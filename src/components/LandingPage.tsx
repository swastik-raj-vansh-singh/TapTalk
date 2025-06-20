
"use client";

import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Heart, Users, Zap, Globe } from "lucide-react";
import { LavaLamp } from "./ui/fluid-blob";

export default function LandingPage() {
  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Express Yourself",
      description: "Share your thoughts and moments with the world"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect",
      description: "Build meaningful connections with like-minded people"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Engage",
      description: "React with taps and show appreciation for great content"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Discover",
      description: "Explore a global feed of diverse perspectives and stories"
    }
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
            className="text-6xl md:text-8xl font-bold tracking-tight mix-blend-exclusion text-white whitespace-nowrap mb-6"
          >
            TapTalk
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-center text-white mix-blend-exclusion max-w-2xl leading-relaxed mb-10 mx-auto"
          >
            Where thoughts take shape and conversations flow like liquid mercury through infinite connections.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg text-lg mix-blend-exclusion">
                Start Your Journey
              </button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 gradient-bg">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            Why Choose TapTalk?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect p-6 rounded-xl hover-lift"
              >
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-bg">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect p-12 rounded-2xl"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8">
              Join thousands of users already sharing their stories on TapTalk
            </p>
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg">
                Create Your Account
              </button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
