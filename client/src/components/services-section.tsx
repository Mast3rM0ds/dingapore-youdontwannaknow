import { motion } from "framer-motion";
import { Laptop, Paintbrush, Smartphone, Cloud, Check } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Laptop,
      title: "Web Development",
      description:
        "Custom web applications built with modern frameworks and best practices for optimal performance and user experience.",
      features: ["React & Vue.js", "Node.js Backend", "Database Design"],
      gradient: "gradient-primary",
    },
    {
      icon: Paintbrush,
      title: "UI/UX Design",
      description:
        "Beautiful and intuitive design solutions that enhance user engagement and drive conversions.",
      features: ["User Research", "Prototyping", "Visual Design"],
      gradient: "gradient-secondary",
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description:
        "Native and cross-platform mobile applications that provide seamless experiences across all devices.",
      features: ["iOS & Android", "React Native", "App Store Optimization"],
      gradient: "gradient-tertiary",
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description:
        "Scalable cloud infrastructure and deployment solutions for modern applications and businesses.",
      features: ["AWS & Azure", "DevOps & CI/CD", "Monitoring & Security"],
      gradient: "gradient-primary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-thin mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Comprehensive digital solutions tailored to your unique business
            needs
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="glass-morphism p-8 rounded-2xl hover:scale-105 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start space-x-6">
                <motion.div
                  className={`${service.gradient} w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="text-gray-400 space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: featureIndex * 0.1,
                        }}
                        viewport={{ once: true }}
                      >
                        <Check className="w-4 h-4 text-green-400 mr-3" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
