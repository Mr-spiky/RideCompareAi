import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          />
        </div>

        {/* Logo and Branding */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          {/* Taxi Icon with Animation */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl mb-6"
          >
            🚖
          </motion.div>

          {/* App Name */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-transparent"
          >
            RideCompare.AI
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-white/70 text-lg mb-8"
          >
            Your Smart Companion for Smarter Rides
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="w-64 mx-auto"
          >
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={{ width: `${progress}%` }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-primary rounded-full"
                transition={{ duration: 0.1 }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/50 text-sm mt-3"
            >
              {progress < 100 ? 'Loading amazing experience...' : 'Ready to go! 🚀'}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-12 flex gap-8 text-white/60 text-sm"
        >
          <motion.div
            whileHover={{ scale: 1.1, color: '#22D3EE' }}
            className="flex items-center gap-2"
          >
            <span>⚡</span>
            <span>Lightning Fast</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, color: '#22D3EE' }}
            className="flex items-center gap-2"
          >
            <span>💰</span>
            <span>Save Money</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, color: '#22D3EE' }}
            className="flex items-center gap-2"
          >
            <span>🤖</span>
            <span>AI Powered</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
