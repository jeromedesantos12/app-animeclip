"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Protected } from "@/middleware/protected";
import { Button } from "@/components/button";
import { Upload } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function HomePage() {
  const router = useRouter();

  return (
    <Protected>
      <div className="relative min-h-screen w-full bg-[url('/container.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <Navbar />
        <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-16 p-4 text-center">
          <motion.div
            className="flex flex-col items-center gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl font-extrabold text-white drop-shadow-2xl md:text-7xl"
              variants={itemVariants}
            >
              AnimeClip Finder
            </motion.h1>
            <motion.p
              className="max-w-xl text-lg text-indigo-200 drop-shadow-lg md:text-xl"
              variants={itemVariants}
            >
              Kesulitan mencari judul anime dari sebuah klip?{" "}
              <span className="font-black">Unggah scenenya di sini</span> dan
              biarkan kami yang menemukannya untuk Anda.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                size="lg"
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl transform transition duration-300 hover:scale-[1.03]"
                onClick={() => router.push("/generate")}
              >
                <Upload className="mr-2 h-5 w-5" /> Coba Sekarang
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="max-w-3xl w-full"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 text-left">
              <h3 className="text-xl font-bold text-indigo-300 mb-2">
                Bagaimana Cara Kerjanya? 🤖
              </h3>
              <p className="text-gray-200 mb-4">
                Teknologi kami menggunakan{" "}
                <span className="font-black">
                  pencocokan visual berbasis AI{" "}
                </span>
                untuk menganalisis setiap frame dari klip yang Anda unggah. Data
                ini kemudian dicocokkan dengan database anime yang luas,
                memberikan Anda hasil yang akurat dalam hitungan detik.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-300">
                <span>✅ Cepat dan Akurat</span>
                <span>🔒 Data Terenkripsi</span>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </Protected>
  );
}
