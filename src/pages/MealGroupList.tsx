import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit2, Loader2, UtensilsCrossed, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL = "http://localhost:8000";

interface MealGroup {
  id: number;
  meal_group_name: string;
  category_id: number;
  category_name?: string;
}

const MealGroupList = () => {
  const navigate = useNavigate();
  const [mealGroups, setMealGroups] = useState<MealGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ meal_group_name: "" });

  useEffect(() => {
    loadMealGroups();
  }, []);

  const loadMealGroups = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/menu/restore-meal-group-session`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMealGroups(data);
      } else {
        toast.error("Failed to load meal groups");
      }
    } catch (error) {
      console.error("Error loading meal groups:", error);
      toast.error("Network error loading meal groups");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (mealGroup: MealGroup) => {
    setEditingId(mealGroup.id);
    setEditForm({
      meal_group_name: mealGroup.meal_group_name,
    });
  };

  const handleSave = async (id: number) => {
    // TODO: Add API endpoint for updating meal group
    // PUT /menu/update-meal-group/:id
    // Body: { meal_group_name: string }
    
    toast.info("Edit API not implemented yet. Add PUT /menu/update-meal-group/:id");
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ meal_group_name: "" });
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
            <Button onClick={() => navigate("/builder?step=3")}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Meal Group
            </Button>
          </div>
          <h1 className="text-3xl font-bold">All Meal Groups</h1>
          <p className="text-muted-foreground">Manage your meal groups</p>
        </div>
      </div>

      {/* Meal Groups List */}
      <div className="container mx-auto px-4 py-8">
        {mealGroups.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No meal groups found</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {mealGroups.map((mealGroup) => {
              const isEditing = editingId === mealGroup.id;

              return (
                <Card key={mealGroup.id} className="p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Meal Group Name</Label>
                        <Input
                          value={editForm.meal_group_name}
                          onChange={(e) => setEditForm({ meal_group_name: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSave(mealGroup.id)}>Save</Button>
                        <Button variant="outline" onClick={handleCancel}>Back to List</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-secondary/10 rounded-lg">
                          <UtensilsCrossed className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{mealGroup.meal_group_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Category: {mealGroup.category_name || "N/A"} • ID: {mealGroup.id}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(mealGroup)}>
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

export default MealGroupList;
