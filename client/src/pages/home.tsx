import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CardGrid from "@/components/card-grid";
import Header from "@/components/header";
import AddFlightModal from "@/components/add-flight-modal";

interface FlightData {
  discorduser: string;
  call: string;
  plane: string;
  dep: string;
  ari: string;
}

interface ApiResponse {
  status: string;
  allData: FlightData[];
}

export default function Home() {
  const [data, setData] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = async () => {
    try {
      const response = await fetch('/api/flights');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: ApiResponse = await response.json();
      if (apiResponse.status === "success" && Array.isArray(apiResponse.allData)) {
        setData(apiResponse.allData);
      } else {
        setData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItem = (newItem: FlightData) => {
    setData(prevData => [...prevData, newItem]);
  };

  const handleDeleteItem = async (callsign: string) => {
    try {
      const response = await fetch(`/api/flights/${callsign}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData(prevData => prevData.filter(flight => flight.call !== callsign));
      }
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onAddItem={() => setShowAddModal(true)} />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Singapore Airlines Flight Tracker</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            View and manage flight information with callsigns displayed in beautiful cards
          </p>
        </motion.div>
        
        <CardGrid data={data} onDelete={handleDeleteItem} />
      </main>
      <AddFlightModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}
