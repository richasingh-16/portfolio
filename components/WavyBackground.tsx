"use client";

import { motion } from "framer-motion";

export default function WavyBackground() {
    return (
        <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden pointer-events-none opacity-40">
            <svg
                className="w-full h-full opacity-40 mix-blend-screen"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* 
            Replicating the exact curving organic shapes from the Lando Norris website.
            We use a combination of opacity pulses and very slow path sweeping 
            to create the smooth, ambient topographic flow.
        */}

                {/* Left Side: Long sweeping vertical curve */}
                <motion.path
                    d="M-50,-100 C150,200 250,500 0,950"
                    fill="none"
                    stroke="#b2c73a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 15, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />

                <motion.path
                    d="M0,-100 C200,300 150,600 -100,800"
                    fill="none"
                    stroke="#b2c73a"
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ pathLength: 1, opacity: 0.6 }}
                    animate={{ pathLength: 0, opacity: 0.2 }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Top/Center: Abstract 'Blob' Shape from the "ALWAYS BRINGING" section */}
                <motion.path
                    d="M300,50 C450,150 500,-50 650,50 C800,150 700,300 850,400 C1000,500 1150,300 1300,450"
                    fill="none"
                    stroke="#b2c73a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 25, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                />

                {/* Mid-Right: The sharp topography loops */}
                <motion.path
                    d="M800,-50 C950,200 700,400 900,600 C1100,800 1300,600 1500,800"
                    fill="none"
                    stroke="#b2c73a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0.2, opacity: 0.3 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ duration: 30, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                />

                <motion.path
                    d="M1000,0 C1050,150 900,300 1100,450 C1250,550 1400,350 1600,500"
                    fill="none"
                    stroke="#b2c73a"
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ pathLength: 1, opacity: 0.8 }}
                    animate={{ pathLength: 0.2, opacity: 0.2 }}
                    transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Center Bottom: Distinct standalone kidney/blob loop */}
                <motion.path
                    d="M50,750 C200,600 450,700 350,950 C250,1100 0,950 50,750 Z"
                    fill="none"
                    stroke="#b2c73a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 20, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />

                <motion.path
                    d="M100,780 C200,680 380,750 300,920 C220,1050 50,920 100,780 Z"
                    fill="none"
                    stroke="#b2c73a"
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: 0 }}
                    transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Far Right Loop (near the side text) */}
                <motion.path
                    d="M1000,500 C1200,400 1400,500 1350,700 C1300,900 1050,750 1000,500 Z"
                    fill="none"
                    stroke="#b2c73a"
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ opacity: 0.2, scale: 0.95 }}
                    animate={{ opacity: 0.8, scale: 1.05 }}
                    transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                    style={{ transformOrigin: "1200px 600px" }}
                />

            </svg>
        </div>
    );
}
