import React from 'react';
import { motion } from 'motion/react';
import './HeroVideo.css';

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4";

export default function HeroVideo() {
  return (
    <div className="hero-video-container">
      <motion.div
        className="video-wrapper"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
        />
        {/* Subtle cinematic overlay to blend with theme */}
        <div className="video-overlay" />
      </motion.div>
    </div>
  );
}
