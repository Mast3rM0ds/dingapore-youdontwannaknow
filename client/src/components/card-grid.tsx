import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plane, User, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlightData {
  discorduser: string;
  call: string;
  plane: string;
  dep: string;
  ari: string;
  submittedBy?: string;
  id?: string;
}

interface CardGridProps {
  data: FlightData[];
  onDelete?: (id: string) => void;
  currentUser?: string | null;
  isAdmin?: boolean;
}

const getFlightColor = (callsign: string) => {
  const colors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-orange-500 to-orange-600",
    "bg-gradient-to-br from-teal-500 to-teal-600",
    "bg-gradient-to-br from-red-500 to-red-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
  ];
  
  const hash = callsign.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

export default function CardGrid({ data, onDelete, currentUser, isAdmin }: CardGridProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
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
      {Array.isArray(data) && data.map((flight, index) => {
        const isExpanded = expandedCard === flight.call;
        return (
          <motion.div
            key={`${flight.call}-${index}`}
            className="group cursor-pointer"
            variants={itemVariants}
            whileHover={{ 
              scale: isExpanded ? 1 : 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpandedCard(isExpanded ? null : flight.call)}
            layout
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Color header */}
              <div className={`${isExpanded ? 'h-16' : 'h-20'} ${getFlightColor(flight.call)} relative transition-all duration-300`}>
                <div className="absolute top-3 right-3">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    <Plane className="w-3 h-3 inline mr-1" />
                    {flight.plane}
                  </span>
                </div>
                {onDelete && flight.id && (isAdmin || flight.submittedBy === currentUser) && (
                  <div className="absolute top-3 left-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(flight.id!);
                      }}
                      className="p-1 h-6 w-6 text-white/70 hover:text-white hover:bg-white/20 rounded-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {flight.call}
                </h3>
                
                {isExpanded ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">Pilot:</span>
                      <span className="ml-2">{flight.discorduser}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="font-medium">Departure:</span>
                      <span className="ml-2">{flight.dep}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Arrival:</span>
                      <span className="ml-2">{flight.ari}</span>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Click to view flight details for {flight.call}
                  </p>
                )}
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}