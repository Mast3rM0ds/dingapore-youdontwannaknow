import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-2xl font-bold text-gradient mb-4"
            whileHover={{ scale: 1.05 }}
          >
            ModernWeb
          </motion.h3>
          <p className="text-gray-400 mb-6">
            Creating exceptional digital experiences for the modern web.
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 ModernWeb. All rights reserved. | Designed with ❤️ for the
            future.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
