import { motion } from "framer-motion";
import { Code, Heart } from "lucide-react";

export default function AboutSection() {
  const stats = [
    { value: "500+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-thin mb-8">
              About Our <span className="text-gradient">Vision</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
              We're passionate about creating digital experiences that push the
              boundaries of what's possible on the web. Our team combines
              artistic vision with technical excellence to deliver solutions
              that not only look stunning but perform exceptionally.
            </p>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
              From concept to deployment, we focus on every detail to ensure
              your digital presence stands out in today's competitive landscape.
              Our approach merges user-centered design with cutting-edge
              technology.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Main image */}
            <motion.img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Modern workspace with multiple monitors"
              className="rounded-2xl shadow-2xl w-full h-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />

            {/* Floating elements */}
            <motion.div
              className="absolute -top-6 -right-6 glass-morphism p-6 rounded-xl shadow-xl"
              animate={{ y: [-10, 10, -10] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.1 }}
            >
              <Code className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
              <p className="text-sm font-medium">Clean Code</p>
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -left-6 glass-morphism p-6 rounded-xl shadow-xl"
              animate={{ y: [10, -10, 10] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              whileHover={{ scale: 1.1 }}
            >
              <Heart className="w-8 h-8 text-red-400 mb-3 mx-auto" />
              <p className="text-sm font-medium">Made with Love</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
