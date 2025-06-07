import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

const colors = [
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
  { value: "orange", label: "Orange" },
  { value: "teal", label: "Teal" },
  { value: "red", label: "Red" },
  { value: "indigo", label: "Indigo" },
  { value: "yellow", label: "Yellow" },
  { value: "cyan", label: "Cyan" },
  { value: "gray", label: "Gray" },
  { value: "violet", label: "Violet" },
];

const categories = [
  "Development",
  "Design",
  "Marketing",
  "Analytics",
  "Infrastructure",
  "Security",
];

export default function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    color: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.color) {
      return;
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newItem = await response.json();
        onAdd(newItem);
        setFormData({ title: "", description: "", category: "", color: "" });
        onClose();
      }
    } catch (error) {
      console.error('Error adding item:', error);
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
                Add New Item
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
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter title..."
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter description..."
                  className="mt-1 resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">
                  Color
                </Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => handleInputChange("color", value)}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select color..." />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  Add Item
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}