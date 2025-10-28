import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealGroup, Meal, MealSize, MealPairing, MealIngredient } from "@/pages/MenuBuilder";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import ImageUploadDialog from "./ImageUploadDialog";
import { toast } from "sonner";

const API_BASE_URL = "https://api.troveindustries.dev";

interface MealDetailsDialogProps {
  mealGroups: MealGroup[];
  meal: Meal | null;
  onSave: (meal: Meal) => void;
  onCancel: () => void;
}

const MealDetailsDialog = ({ mealGroups, meal, onSave, onCancel }: MealDetailsDialogProps) => {
  const [formData, setFormData] = useState<Meal>(
      meal || {
        id: Date.now().toString(),
        mealGroupId: "",
        name: "",
        description: "",
        image: "",
        sizes: [],
        pairings: [],
        ingredients: [],
      }
  );

  const [newSize, setNewSize] = useState({ name: "", price: "" });
  const [newPairing, setNewPairing] = useState({ name: "", price: "", image: "" });
  const [newIngredient, setNewIngredient] = useState({ name: "", image: "" });
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageDialogType, setImageDialogType] = useState<"meal" | "pairing" | "ingredient">("meal");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = meal ? "PUT" : "POST";
      const endpoint = meal
          ? `${API_BASE_URL}/meals/${meal.id}`
          : `${API_BASE_URL}/meals/create-meal`;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Failed to save meal (${response.status})`);
      }

      const savedMeal = await response.json();
      onSave(savedMeal);
      toast.success(meal ? "Meal updated successfully!" : "Meal created successfully!");
    } catch (error) {
      console.error("Error saving meal:", error);
      toast.error("Error saving meal. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const addSize = () => {
    if (!newSize.name || !newSize.price) return;

    const size: MealSize = {
      id: Date.now().toString(),
      name: newSize.name,
      price: parseFloat(newSize.price),
    };

    setFormData({ ...formData, sizes: [...formData.sizes, size] });
    setNewSize({ name: "", price: "" });
  };

  const removeSize = (id: string) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((s) => s.id !== id) });
  };

  const addPairing = () => {
    if (!newPairing.name || !newPairing.price) return;

    const pairing: MealPairing = {
      id: Date.now().toString(),
      name: newPairing.name,
      image: newPairing.image,
      price: parseFloat(newPairing.price),
    };

    setFormData({ ...formData, pairings: [...formData.pairings, pairing] });
    setNewPairing({ name: "", price: "", image: "" });
  };

  const removePairing = (id: string) => {
    setFormData({ ...formData, pairings: formData.pairings.filter((p) => p.id !== id) });
  };

  const addIngredient = () => {
    if (!newIngredient.name) return;

    const ingredient: MealIngredient = {
      id: Date.now().toString(),
      name: newIngredient.name,
      image: newIngredient.image,
    };

    setFormData({ ...formData, ingredients: [...formData.ingredients, ingredient] });
    setNewIngredient({ name: "", image: "" });
  };

  const removeIngredient = (id: string) => {
    setFormData({ ...formData, ingredients: formData.ingredients.filter((i) => i.id !== id) });
  };

  const openImageDialog = (type: "meal" | "pairing" | "ingredient") => {
    setImageDialogType(type);
    setImageDialogOpen(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (imageDialogType === "meal") {
      setFormData({ ...formData, image: imageUrl });
    } else if (imageDialogType === "pairing") {
      setNewPairing({ ...newPairing, image: imageUrl });
    } else {
      setNewIngredient({ ...newIngredient, image: imageUrl });
    }
    setImageDialogOpen(false);
  };

  return (
      <>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="mealGroup">Meal Group *</Label>
              <Select
                  value={formData.mealGroupId}
                  onValueChange={(value) => setFormData({ ...formData, mealGroupId: value })}
                  required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a meal group" />
                </SelectTrigger>
                <SelectContent>
                  {mealGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mealName">Meal Name *</Label>
              <Input
                  id="mealName"
                  placeholder="e.g., Pasta Rotini"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                  id="description"
                  placeholder="e.g., Sweet pasta rotini with special sauce"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
              />
            </div>

            <div>
              <Label>Meal Image</Label>
              <div className="flex gap-2 items-center mt-2">
                {formData.image && (
                    <img src={formData.image} alt="Meal" className="w-20 h-20 object-cover rounded-lg" />
                )}
                <Button type="button" variant="outline" onClick={() => openImageDialog("meal")}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {formData.image ? "Change Image" : "Add Image"}
                </Button>
              </div>
            </div>
          </div>

          {/* Existing Tabs Section remains unchanged */}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Meal"}
            </Button>
          </div>
        </form>

        <ImageUploadDialog
            open={imageDialogOpen}
            onClose={() => setImageDialogOpen(false)}
            onSelect={handleImageSelect}
        />
      </>
  );
};

export default MealDetailsDialog;
