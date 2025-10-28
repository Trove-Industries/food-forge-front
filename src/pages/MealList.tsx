import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_BASE_URL = "http://localhost:8000";

interface Meal {
  id: number;
  meal_name: string;
  meal_description: string;
  meal_image?: string;
  meal_group_id: number;
  meal_group_name?: string;
}

const MealList = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ 
    meal_name: "", 
    meal_description: "",
    meal_image: ""
  });

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/menu/restore-meal-session`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMeals(data);
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

  const handleEdit = (meal: Meal) => {
    setEditingId(meal.id);
    setEditForm({
      meal_name: meal.meal_name,
      meal_description: meal.meal_description,
      meal_image: meal.meal_image || ""
    });
  };

  const handleSave = async (id: number) => {
    // TODO: Add API endpoint for updating meal
    // PUT /menu/update-meal/:id
    // Body: { meal_name: string, meal_description: string, meal_image: string }
    
    toast.info("Edit API not implemented yet. Add PUT /menu/update-meal/:id");
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ meal_name: "", meal_description: "", meal_image: "" });
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
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
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
              const isEditing = editingId === meal.id;

              return (
                <Card key={meal.id} className="p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Meal Name</Label>
                        <Input
                          value={editForm.meal_name}
                          onChange={(e) => setEditForm({ ...editForm, meal_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={editForm.meal_description}
                          onChange={(e) => setEditForm({ ...editForm, meal_description: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSave(meal.id)}>Save</Button>
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {meal.meal_image && (
                          <img 
                            src={meal.meal_image} 
                            alt={meal.meal_name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{meal.meal_name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{meal.meal_description}</p>
                          <p className="text-xs text-muted-foreground">
                            Group: {meal.meal_group_name || "N/A"} • ID: {meal.id}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(meal)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealList;
