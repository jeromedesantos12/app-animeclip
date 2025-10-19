import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/motion";
import Shuffle from "@/components/shuffle";
import type { ReactNode } from "react";

export function Title({ children }: { children?: ReactNode }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Shuffle
        text="AnimeClip Finder"
        shuffleDirection="right"
        duration={0.35}
        animationMode="evenodd"
        shuffleTimes={1}
        ease="power3.out"
        stagger={0.03}
        threshold={0.1}
        triggerOnce={true}
        triggerOnHover={true}
        respectReducedMotion={true}
        tag="h1"
        className="text-4xl font-poppins font-extrabold text-white drop-shadow-2xl md:text-7xl"
      />
      {children}
      <motion.p
        className="max-w-2xl text-lg text-indigo-200 drop-shadow-lg md:text-xl"
        variants={itemVariants}
      >
        Kesulitan mencari judul anime dari sebuah klip?{" "}
        <span className="font-bold text-indigo-100">
          Unggah cuplikan adegannya di sini
        </span>{" "}
        dan biarkan AI kami yang menemukannya untuk Anda.
      </motion.p>
    </motion.div>
  );
}
