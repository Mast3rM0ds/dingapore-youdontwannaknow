import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CardGrid from "@/components/card-grid";
import Header from "@/components/header";
import AddItemModal from "@/components/add-item-modal";

interface CardData {
  id: number;
  title: string;
  description: string;
  category: string;
  color: string;
}

export default function Home() {
  const [data, setData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = async () => {
    try {
      const response = await fetch('/api/items');
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItem = (newItem: CardData) => {
    setData(prevData => [...prevData, newItem]);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData(prevData => prevData.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Dynamic Card Grid
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our collection of services and features displayed in beautiful rounded squares
          </p>
        </motion.div>
        
        <CardGrid data={data} onDelete={handleDeleteItem} />
      </main>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}
