import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FlightData {
  discorduser: string;
  call: string;
  plane: string;
  dep: string;
  ari: string;
}

interface AddFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (flight: FlightData) => void;
}

export default function AddFlightModal({ isOpen, onClose, onAdd }: AddFlightModalProps) {
  const [formData, setFormData] = useState({
    discorduser: "",
    call: "",
    plane: "",
    dep: "",
    ari: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.discorduser || !formData.call || !formData.plane || !formData.dep || !formData.ari) {
      return;
    }

    try {
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onAdd(formData);
        setFormData({ discorduser: "", call: "", plane: "", dep: "", ari: "" });
        onClose();
        // Reload the page to fetch updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error adding flight:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Flight
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="discorduser" className="text-gray-700 dark:text-gray-300">
                  Discord User
                </Label>
                <Input
                  id="discorduser"
                  value={formData.discorduser}
                  onChange={(e) => handleInputChange("discorduser", e.target.value)}
                  placeholder="Enter discord username..."
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="call" className="text-gray-700 dark:text-gray-300">
                  Callsign
                </Label>
                <Input
                  id="call"
                  value={formData.call}
                  onChange={(e) => handleInputChange("call", e.target.value)}
                  placeholder="Enter callsign..."
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="plane" className="text-gray-700 dark:text-gray-300">
                  Aircraft
                </Label>
                <Input
                  id="plane"
                  value={formData.plane}
                  onChange={(e) => handleInputChange("plane", e.target.value)}
                  placeholder="Enter aircraft type..."
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="dep" className="text-gray-700 dark:text-gray-300">
                  Departure
                </Label>
                <Input
                  id="dep"
                  value={formData.dep}
                  onChange={(e) => handleInputChange("dep", e.target.value)}
                  placeholder="Enter departure airport..."
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="ari" className="text-gray-700 dark:text-gray-300">
                  Arrival
                </Label>
                <Input
                  id="ari"
                  value={formData.ari}
                  onChange={(e) => handleInputChange("ari", e.target.value)}
                  placeholder="Enter arrival airport..."
                  className="mt-1"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Add Flight
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}