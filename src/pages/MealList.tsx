import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MealDetailsDialog from "@/components/builder/MealDetailsDialog";
import type { MealGroup } from "@/pages/MenuBuilder";

//const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://api.troveindustries.dev";

interface MealData {
  id: number;
  meal_name: string;
  meal_description: string;
  meal_image?: string;
  meal_group_id: number;
  meal_group_name?: string;
}

interface Meal {
  id: string;
  mealGroupId: string;
  name: string;
  description: string;
  image: string;
  sizes: { id: string; name: string; price: number }[];
  pairings: { id: string; name: string; image: string; price: number }[];
  ingredients: { id: string; name: string; image: string }[];
}

const MealList = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealGroups, setMealGroups] = useState<MealGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadMealGroups();
    loadMeals();
  }, []);

  const loadMealGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/restore-meal-group-session`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMealGroups(data.map((mg: any) => ({
          id: mg.id.toString(),
          categoryId: mg.category_id.toString(),
          name: mg.meal_group_name,
          description: mg.meal_group_description,
        })));
      }
    } catch (error) {
      console.error("Error loading meal groups:", error);
    }
  };

  const loadMeals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/menu/restore-meal-session`, {
        credentials: "include",
      });

      if (response.ok) {
        const mealsData: MealData[] = await response.json();
        
        // Load additional data for each meal
        const sizes = await loadMealSizes();
        const pairings = await loadPairings();
        const ingredients = await loadIngredients();

        const transformedMeals: Meal[] = mealsData.map((meal) => ({
          id: meal.id.toString(),
          mealGroupId: meal.meal_group_id.toString(),
          name: meal.meal_name,
          description: meal.meal_description,
          image: meal.meal_image || "",
          sizes: sizes.filter((s: any) => s.meal_id === meal.id).map((s: any) => ({
            id: s.id.toString(),
            name: s.size_name,
            price: s.size_price
          })),
          pairings: pairings.filter((p: any) => p.meal_id === meal.id).map((p: any) => ({
            id: p.id.toString(),
            name: p.pairing_name,
            image: p.pairing_image || "",
            price: p.pairing_price
          })),
          ingredients: ingredients.filter((i: any) => i.meal_id === meal.id).map((i: any) => ({
            id: i.id.toString(),
            name: i.ingredient_name,
            image: i.ingredient_image || ""
          }))
        }));

        setMeals(transformedMeals);
      } else {
        toast.error("Failed to load meals");
      }
    } catch (error) {
      console.error("Error loading meals:", error);
      toast.error("Network error loading meals");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMealSizes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/restore-meal-size-session`, {
        credentials: 'include',
      });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      console.error('Error loading meal sizes:', err);
      return [];
    }
  };

  const loadPairings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/restore-pairing-session`, {
        credentials: 'include',
      });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      console.error('Error loading pairings:', err);
      return [];
    }
  };

  const loadIngredients = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/restore-ingredient-session`, {
        credentials: 'include',
      });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      console.error('Error loading ingredients:', err);
      return [];
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setIsDialogOpen(true);
  };

  const handleSave = async (meal: Meal) => {
    // TODO: Add API endpoint for updating meal
    // PUT /menu/update-meal/:id
    // Body: { meal_name: string, meal_description: string, meal_image: string, sizes: [], pairings: [], ingredients: [] }
    
    toast.info("Edit API not implemented yet. Add PUT /menu/update-meal/:id");
    setIsDialogOpen(false);
    setEditingMeal(null);
    // After API is implemented, reload meals:
    // await loadMeals();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate("/builder?step=4")}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Meal
            </Button>
          </div>
          <h1 className="text-3xl font-bold">All Meals</h1>
          <p className="text-muted-foreground">Manage your meals</p>
        </div>
      </div>

      {/* Meals List */}
      <div className="container mx-auto px-4 py-8">
        {meals.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No meals found</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {meals.map((meal) => {
              const mealGroup = mealGroups.find(mg => mg.id === meal.mealGroupId);
              
              return (
                <Card key={meal.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {meal.image && (
                        <img 
                          src={meal.image} 
                          alt={meal.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{meal.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Group: {mealGroup?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">{meal.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>{meal.sizes.length} sizes</span>
                          <span>{meal.pairings.length} pairings</span>
                          <span>{meal.ingredients.length} ingredients</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(meal)}>
                      Edit
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Meal</DialogTitle>
            </DialogHeader>
            <MealDetailsDialog
              mealGroups={mealGroups}
              meal={editingMeal}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MealList;
