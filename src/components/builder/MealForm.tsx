import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MealGroup, Meal } from "@/pages/MenuBuilder";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MealDetailsDialog from "./MealDetailsDialog";
import { toast } from "sonner";

interface MealFormProps {
  mealGroups: MealGroup[];
  meals: Meal[];
  onSave: (data: Meal[]) => void;
}

const MealForm = ({ mealGroups, meals, onSave }: MealFormProps) => {
  const [localMeals, setLocalMeals] = useState<Meal[]>(meals);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const saveMeal = (meal: Meal) => {
    let updated: Meal[];
    
    if (editingMeal) {
      updated = localMeals.map((m) => (m.id === meal.id ? meal : m));
      toast.success("Meal updated!");
    } else {
      updated = [...localMeals, meal];
      toast.success("Meal added!");
    }

    setLocalMeals(updated);
    onSave(updated);
    setIsDialogOpen(false);
    setEditingMeal(null);

    // API Integration Point: POST /api/meals or PUT /api/meals/:id
  };

  const removeMeal = (id: string) => {
    const updated = localMeals.filter((m) => m.id !== id);
    setLocalMeals(updated);
    onSave(updated);
    toast.success("Meal removed");

    // API Integration Point: DELETE /api/meals/:id
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
          <p className="text-muted-foreground">Add meals with sizes, pairings, and ingredients</p>
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
              <DialogTitle>{editingMeal ? "Edit Meal" : "Add New Meal"}</DialogTitle>
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
          <p className="text-muted-foreground">Please add meal groups first before creating meals</p>
        </Card>
      ) : localMeals.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No meals added yet. Click "Add Meal" to get started!</p>
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
                      <p className="text-sm text-muted-foreground">{meal.description}</p>
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
