import React, { useEffect, useState } from 'react';
import { Theater } from 'lucide-react';
import { motion } from 'framer-motion';

const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div 
          className="flex justify-center"
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Theater className="h-24 w-24 text-primary-600" />
        </motion.div>
        <motion.h1 
          className="mt-6 text-4xl font-bold text-gray-900"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          ESP32 Stage Control
        </motion.h1>
        <motion.p 
          className="mt-2 text-xl text-gray-600"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Theatrical Control System
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
