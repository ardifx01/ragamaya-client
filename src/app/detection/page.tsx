'use client';

import Header from '@/components/Detection/Header';
import MainContent from '@/components/Detection/MainContent';
import { motion } from "motion/react";

const Detection = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="w-full"
        >

          <Header />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="w-full"
        >


          <MainContent />
        </motion.div>


      </div>
    </div>
  );
};

export default Detection;