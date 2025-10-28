import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MealGroup, Meal } from "@/pages/MenuBuilder";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MealDetailsDialog from "./MealDetailsDialog";
import { toast } from "sonner";

interface MealFormProps {
  mealGroups: MealGroup[];
  meals: Meal[];
  onSave: (data: Meal[]) => void;
}

const API_BASE_URL = 'http://localhost:8000';

const MealForm = ({ mealGroups, meals, onSave }: MealFormProps) => {
  const [localMeals, setLocalMeals] = useState<Meal[]>(meals);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantName, setRestaurantName] = useState<string>("");

  // Check restaurant session and load meals on mount
  useEffect(() => {
    checkSession();
    loadMeals();
  }, []);

  // Verify restaurant session
  const checkSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/restaurant/restore-restaurant-session`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setRestaurantName(data.restaurant_name);
      } else {
        toast.error('No restaurant session found. Please create a restaurant first.');
      }
    } catch (err) {
      console.error('Session check failed:', err);
      toast.error('Failed to verify session.');
    }
  };

  // Load meals from backend
  const loadMeals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/menu/restore-meal-session`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const mealsData = await res.json();

        // Load sizes, pairings, and ingredients for each meal
        const mealsWithDetails = await Promise.all(
            mealsData.map(async (meal: any) => {
              const sizes = await loadMealSizes();
              const pairings = await loadPairings();
              const ingredients = await loadIngredients();

              return {
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
              };
            })
        );

        setLocalMeals(mealsWithDetails);
        onSave(mealsWithDetails);
      } else if (res.status === 404) {
        setLocalMeals([]);
      }
    } catch (err) {
      console.error('Error loading meals:', err);
      toast.error('Failed to load meals');
    } finally {
      setIsLoading(false);
    }
  };

  // Load meal sizes
  const loadMealSizes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/restore-meal-size-session`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (err) {
      console.error('Error loading meal sizes:', err);
      return [];
    }
  };

  // Load pairings
  const loadPairings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/restore-pairing-session`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (err) {
      console.error('Error loading pairings:', err);
      return [];
    }
  };

  // Load ingredients
  const loadIngredients = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/restore-ingredient-session`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (err) {
      console.error('Error loading ingredients:', err);
      return [];
    }
  };

  const saveMeal = async (meal: Meal) => {
    setIsLoading(true);

    try {
      // Create the meal first
      const mealPayload = {
        meal_group_id: parseInt(meal.mealGroupId),
        meal_name: meal.name,
        meal_description: meal.description,
        meal_image: meal.image
      };

      const mealRes = await fetch(`${API_BASE_URL}/menu/create-meal`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealPayload),
      });

      if (!mealRes.ok) {
        const errData = await mealRes.json();
        toast.error(errData.error || 'Failed to create meal');
        return;
      }

      const newMealData = await mealRes.json();
      const mealId = newMealData.id;

      // Create sizes
      for (const size of meal.sizes) {
        const sizePayload = {
          meal_id: mealId,
          size_name: size.name,
          size_price: size.price
        };

        await fetch(`${API_BASE_URL}/menu/create-meal-size`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sizePayload),
        });
      }

      // Create pairings
      for (const pairing of meal.pairings) {
        const pairingPayload = {
          meal_id: mealId,
          pairing_name: pairing.name,
          pairing_image: pairing.image,
          pairing_price: pairing.price
        };

        await fetch(`${API_BASE_URL}/menu/create-pairing`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pairingPayload),
        });
      }

      // Create ingredients
      for (const ingredient of meal.ingredients) {
        const ingredientPayload = {
          meal_id: mealId,
          ingredient_name: ingredient.name,
          ingredient_image: ingredient.image
        };

        await fetch(`${API_BASE_URL}/menu/create-ingredient`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ingredientPayload),
        });
      }

      toast.success("Meal created successfully with all details!");
      await loadMeals(); // Reload to get fresh data
      setIsDialogOpen(false);
      setEditingMeal(null);

    } catch (err) {
      console.error('Error creating meal:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeMeal = (id: string) => {
    // Note: In production, you'd call DELETE endpoint here
    const updated = localMeals.filter((m) => m.id !== id);
    setLocalMeals(updated);
    onSave(updated);
    toast.success("Meal removed");
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

  if (isLoading && localMeals.length === 0) {
    return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Meals</h2>
              <p className="text-muted-foreground">Loading meals...</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Meals</h2>
            <p className="text-muted-foreground">Add meals with sizes, pairings, and ingredients</p>
            {restaurantName && (
                <p className="text-sm text-muted-foreground mt-1">🍴 {restaurantName}</p>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewMealDialog} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Meal
                  </>
                )}
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
                  isLoading={isLoading}
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
                                disabled={isLoading}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMeal(meal.id)}
                                disabled={isLoading}
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