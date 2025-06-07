import { motion } from "framer-motion";

interface CardData {
  id: number;
  title: string;
  description: string;
  category: string;
  color: string;
}

interface CardGridProps {
  data: CardData[];
}

const colorVariants = {
  blue: "bg-gradient-to-br from-blue-500 to-blue-600",
  green: "bg-gradient-to-br from-green-500 to-green-600",
  purple: "bg-gradient-to-br from-purple-500 to-purple-600",
  pink: "bg-gradient-to-br from-pink-500 to-pink-600",
  orange: "bg-gradient-to-br from-orange-500 to-orange-600",
  teal: "bg-gradient-to-br from-teal-500 to-teal-600",
  red: "bg-gradient-to-br from-red-500 to-red-600",
  indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600",
  yellow: "bg-gradient-to-br from-yellow-500 to-yellow-600",
  cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600",
  gray: "bg-gradient-to-br from-gray-500 to-gray-600",
  violet: "bg-gradient-to-br from-violet-500 to-violet-600",
};

export default function CardGrid({ data }: CardGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {data.map((item) => (
        <motion.div
          key={item.id}
          className="group cursor-pointer"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Color header */}
            <div className={`h-20 ${colorVariants[item.color as keyof typeof colorVariants] || colorVariants.blue} relative`}>
              <div className="absolute top-3 right-3">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}