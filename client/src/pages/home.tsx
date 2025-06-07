import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CardGrid from "@/components/card-grid";
import Header from "@/components/header";
import AddFlightModal from "@/components/add-flight-modal";
import AuthModal from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { Shield, User, LogOut } from "lucide-react";

interface FlightData {
  discorduser: string;
  call: string;
  plane: string;
  dep: string;
  ari: string;
  submittedBy?: string;
  id?: string;
}

interface ApiResponse {
  status: string;
  allData: FlightData[];
}

export default function Home() {
  const [data, setData] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const { isAdmin, userId } = await response.json();
        setIsAdmin(isAdmin);
        setCurrentUser(userId);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  useEffect(() => {
    loadData();
    checkAuthStatus();
  }, []);

  const handleAddItem = (newItem: FlightData) => {
    setData(prevData => [...prevData, newItem]);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/flights/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData(prevData => prevData.filter(flight => flight.id !== id));
      } else {
        const error = await response.json();
        console.error('Delete error:', error.error);
        alert(error.error || 'Failed to delete flight');
      }
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  const handleAuth = (user: { isAdmin: boolean; userId: string }) => {
    setIsAdmin(user.isAdmin);
    setCurrentUser(user.userId);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAdmin(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
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
      
      {/* Auth Controls */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  <span>
                    {isAdmin ? 'Admin' : 'User'}: {currentUser}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Login
              </Button>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {data.length} flights tracked
          </div>
        </div>
      </div>
      
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
        
        <CardGrid 
          data={data} 
          onDelete={handleDeleteItem}
          currentUser={currentUser}
          isAdmin={isAdmin}
        />
      </main>
      
      <AddFlightModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
}
