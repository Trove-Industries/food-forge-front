import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, MealGroup } from "@/pages/MenuBuilder";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MealGroupFormProps {
  categories: Category[];
  mealGroups: MealGroup[];
  onSave: (data: MealGroup[]) => void;
}

const API_BASE_URL = "https://api.troveindustries.dev";

const MealGroupForm = ({ categories, mealGroups, onSave }: MealGroupFormProps) => {
  const [localMealGroups, setLocalMealGroups] = useState<MealGroup[]>(mealGroups);
  const [newGroup, setNewGroup] = useState({ name: "", categoryId: "" });

  // ✅ Load existing meal groups
  useEffect(() => {
    const fetchMealGroups = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/menu/get-meal-groups`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch meal groups");

        const data: MealGroup[] = await response.json();
        setLocalMealGroups(data);
        onSave(data);
      } catch (error) {
        console.error("Error fetching meal groups:", error);
        toast.error("Could not load meal groups");
      }
    };

    fetchMealGroups();
  }, [onSave]);

  // ✅ Add new meal group
  const addMealGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.categoryId) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/menu/create-meal-group`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_group_name: newGroup.name,
          category_id: parseInt(newGroup.categoryId),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create meal group");
      }

      const data: MealGroup = await response.json();
      const updated = [...localMealGroups, data];
      setLocalMealGroups(updated);
      onSave(updated);
      setNewGroup({ name: "", categoryId: "" });
      toast.success("Meal group added successfully!");
    } catch (error) {
      console.error("Error creating meal group:", error);
      toast.error("Failed to add meal group");
    }
  };

  // ✅ Delete meal group
  const removeMealGroup = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/delete-meal-group/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete meal group");
      }

      const updated = localMealGroups.filter((g) => g.id !== id);
      setLocalMealGroups(updated);
      onSave(updated);
      toast.success("Meal group removed successfully!");
    } catch (error) {
      console.error("Error deleting meal group:", error);
      toast.error("Failed to remove meal group");
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Meal Groups</h2>
          <p className="text-muted-foreground">
            Organize meals into groups within categories
          </p>
        </div>

        {categories.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                Please add categories first before creating meal groups
              </p>
            </Card>
        ) : (
            <>
              {/* Add New Meal Group */}
              <Card className="p-4 bg-accent/50">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Select Category</Label>
                    <Select
                        value={newGroup.categoryId}
                        onValueChange={(value) =>
                            setNewGroup({ ...newGroup, categoryId: value })
                        }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="groupName">Meal Group Name</Label>
                    <Input
                        id="groupName"
                        placeholder="e.g., Pasta"
                        value={newGroup.name}
                        onChange={(e) =>
                            setNewGroup({ ...newGroup, name: e.target.value })
                        }
                    />
                  </div>

                  <Button onClick={addMealGroup} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Meal Group
                  </Button>
                </div>
              </Card>

              {/* Meal Groups List */}
              {localMealGroups.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">
                      Your Meal Groups ({localMealGroups.length})
                    </h3>
                    <div className="grid gap-3">
                      {localMealGroups.map((group) => (
                          <Card
                              key={group.id}
                              className="p-4 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium">{group.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Category: {getCategoryName(group.categoryId)}
                              </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMealGroup(group.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </Card>
                      ))}
                    </div>
                  </div>
              )}
            </>
        )}
      </div>
  );
};

export default MealGroupForm;
