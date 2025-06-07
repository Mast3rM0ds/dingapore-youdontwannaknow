import { motion } from "framer-motion";
import {
  Zap,
  Palette,
  Smartphone,
  Shield,
  Settings,
  Headphones,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Experience blazing-fast performance with our optimized architecture and cutting-edge technology stack.",
      gradient: "gradient-primary",
    },
    {
      icon: Palette,
      title: "Beautiful Design",
      description:
        "Stunning visual aesthetics with modern design principles that captivate and engage your audience.",
      gradient: "gradient-secondary",
    },
    {
      icon: Smartphone,
      title: "Fully Responsive",
      description:
        "Perfect adaptation to any device or screen size with fluid responsive design principles.",
      gradient: "gradient-tertiary",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level security protocols and advanced encryption to protect your valuable data and privacy.",
      gradient: "gradient-primary",
    },
    {
      icon: Settings,
      title: "Easy Integration",
      description:
        "Seamless integration with your existing tools and workflow with comprehensive API support.",
      gradient: "gradient-secondary",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Round-the-clock expert support to help you succeed with dedicated customer service teams.",
      gradient: "gradient-tertiary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="features" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-thin mb-6">
            <span className="text-gradient">Powerful Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Discover the cutting-edge capabilities that set our platform apart
            from the rest
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group glass-morphism p-8 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className={`${feature.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 5 }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
