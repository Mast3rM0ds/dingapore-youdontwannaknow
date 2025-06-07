import { motion } from "framer-motion";
import { Rocket, Shield, Smartphone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const floatingCards = [
    {
      icon: Rocket,
      text: "Fast Performance",
      delay: 0,
      position: "top-0 left-1/4 -translate-x-1/2",
    },
    {
      icon: Shield,
      text: "Secure & Reliable",
      delay: 2,
      position: "top-10 right-1/4 translate-x-1/2",
    },
    {
      icon: Smartphone,
      text: "Mobile First",
      delay: 4,
      position: "top-20 left-1/2 -translate-x-1/2",
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-thin leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The Future of
            <motion.span
              className="block font-light text-gradient"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Digital Experience
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Crafting exceptional digital experiences with cutting-edge design and
            seamless functionality that pushes the boundaries of modern web
            development.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              size="lg"
              className="px-8 py-4 gradient-primary rounded-full text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 glass-morphism rounded-full text-white font-medium hover:scale-105 transition-all duration-300 border border-white/20 hover:bg-white/20"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Cards */}
        <div className="relative">
          {floatingCards.map((card, index) => (
            <motion.div
              key={index}
              className={`absolute ${card.position}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 + card.delay * 0.2 }}
            >
              <motion.div
                className="glass-morphism p-4 rounded-xl shadow-xl"
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: card.delay,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <card.icon className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
                <p className="text-sm font-medium">{card.text}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white opacity-60" />
      </motion.div>
    </section>
  );
}
