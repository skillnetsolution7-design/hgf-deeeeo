"use client";

import { useState, useEffect } from "react";
import { X, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  { icon: Truck, text: "Free Delivery Islandwide" },
  { icon: Truck, text: "Cash On Delivery Available" },
  { icon: Truck, text: "Premium Quality Guaranteed" },
];

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const MessageIcon = messages[currentIndex].icon;

  return (
    <div className="bg-black text-white h-10 flex items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-sm"
        >
          <MessageIcon className="w-4 h-4 text-gold" />
          <span>{messages[currentIndex].text}</span>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
