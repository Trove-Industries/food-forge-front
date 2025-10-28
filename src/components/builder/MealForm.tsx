import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MealGroup, Meal } from "@/pages/MenuBuilder";
import { Plus, Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MealDetailsDialog from "./MealDetailsDialog";
import { toast } from "sonner";

interface MealFormProps {
  mealGroups: MealGroup[];
  meals: Meal[];
  onSave: (data: Meal[]) => void;
}

const API_BASE = "https://api.troveindustries.dev";

const MealForm = ({ mealGroups, meals, onSave }: MealFormProps) => {
  const [localMeals, setLocalMeals] = useState<Meal[]>(meals);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ✅ Add or update meal
  const saveMeal = async (meal: Meal) => {
    try {
      let response;
      let updatedMeals;

      if (editingMeal) {
        // Update existing meal
        response = await fetch(`${API_BASE}/meals/${meal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(meal),
        });

        if (!response.ok) throw new Error("Failed to update meal");

        const updatedMeal = await response.json();
        updatedMeals = localMeals.map((m) =>
            m.id === meal.id ? updatedMeal : m
        );

        toast.success("Meal updated!");
      } else {
        // Create new meal
        response = await fetch(`${API_BASE}/meals/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(meal),
        });

        if (!response.ok) throw new Error("Failed to create meal");

        const newMeal = await response.json();
        updatedMeals = [...localMeals, newMeal];

        toast.success("Meal added!");
      }

      setLocalMeals(updatedMeals);
      onSave(updatedMeals);
      setIsDialogOpen(false);
      setEditingMeal(null);
    } catch (error) {
      console.error("Error saving meal:", error);
      toast.error("Failed to save meal. Please try again.");
    }
  };

  // ✅ Delete meal
  const removeMeal = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/meals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete meal");

      const updated = localMeals.filter((m) => m.id !== id);
      setLocalMeals(updated);
      onSave(updated);
      toast.success("Meal removed!");
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast.error("Failed to delete meal. Please try again.");
    }
  };

  const getMealGroupName = (mealGroupId: string) => {
    return mealGroups.find((g) => g.id === mealGroupId)?.name || "Unknown";
  };

  const openNewMealDialog = () => {
    setEditingMeal(null);
    setIsDialogOpen(true);
  };

  const openEditMealDialog = (meal: Meal) => {
    setEditingMeal(meal);
    setIsDialogOpen(true);
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Meals</h2>
            <p className="text-muted-foreground">
              Add meals with sizes, pairings, and ingredients
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewMealDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Meal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingMeal ? "Edit Meal" : "Add New Meal"}
                </DialogTitle>
              </DialogHeader>
              <MealDetailsDialog
                  mealGroups={mealGroups}
                  meal={editingMeal}
                  onSave={saveMeal}
                  onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {mealGroups.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                Please add meal groups first before creating meals
              </p>
            </Card>
        ) : localMeals.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                No meals added yet. Click "Add Meal" to get started!
              </p>
            </Card>
        ) : (
            <div className="grid gap-4">
              {localMeals.map((meal) => (
                  <Card key={meal.id} className="p-4">
                    <div className="flex gap-4">
                      {meal.image && (
                          <img
                              src={meal.image}
                              alt={meal.name}
                              className="w-24 h-24 object-cover rounded-lg"
                          />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{meal.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Group: {getMealGroupName(meal.mealGroupId)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {meal.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditMealDialog(meal)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMeal(meal.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-muted-foreground">
                      {meal.sizes.length} sizes
                    </span>
                          <span className="text-muted-foreground">
                      {meal.pairings.length} pairings
                    </span>
                          <span className="text-muted-foreground">
                      {meal.ingredients.length} ingredients
                    </span>
                        </div>
                      </div>
                    </div>
                  </Card>
              ))}
            </div>
        )}
      </div>
  );
};

export default MealForm;
