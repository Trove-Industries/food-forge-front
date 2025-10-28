import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, MealGroup } from "@/pages/MenuBuilder";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MealGroupFormProps {
  categories: Category[];
  mealGroups: MealGroup[];
  onSave: (data: MealGroup[]) => void;
}

const API_BASE_URL = 'http://localhost:8000';

const MealGroupForm = ({ categories, mealGroups, onSave }: MealGroupFormProps) => {
  const [localMealGroups, setLocalMealGroups] = useState<MealGroup[]>(mealGroups);
  const [newGroup, setNewGroup] = useState({ name: "", categoryId: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [restaurantName, setRestaurantName] = useState("");

  // Check session and load existing meal groups on mount
  useEffect(() => {
    checkSessionAndLoadMealGroups();
  }, []);

  // Check if user has a valid session and load meal groups
  const checkSessionAndLoadMealGroups = async () => {
    try {
      // Verify restaurant session
      const sessionResponse = await fetch(`${API_BASE_URL}/restaurant/restore-restaurant-session`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!sessionResponse.ok) {
        toast.error('No restaurant session found. Please create a restaurant first.');
        setIsCheckingSession(false);
        return;
      }

      const restaurantData = await sessionResponse.json();
      setRestaurantName(restaurantData.restaurant_name);

      // Load existing meal groups
      await loadMealGroups();
    } catch (error) {
      console.error('Failed to check session:', error);
      toast.error('Failed to verify session');
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Load existing meal groups from backend
  const loadMealGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/restore-meal-group-session`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const backendMealGroups = await response.json();

        // Map backend meal groups to frontend format
        const mappedMealGroups: MealGroup[] = backendMealGroups.map((group: any) => ({
          id: group.id.toString(),
          categoryId: group.category_id.toString(),
          name: group.meal_group_name
        }));

        setLocalMealGroups(mappedMealGroups);
        onSave(mappedMealGroups);
      } else if (response.status === 404) {
        // No meal groups yet - that's fine
        setLocalMealGroups([]);
      }
    } catch (error) {
      console.error('Failed to load meal groups:', error);
      // Don't show error - just start with empty list
    }
  };

  const addMealGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.categoryId) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    const mealGroupData = {
      category_id: parseInt(newGroup.categoryId, 10),
      meal_group_name: newGroup.name.trim()
    };

    try {
      const response = await fetch(`${API_BASE_URL}/menu/create-meal-group`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealGroupData)
      });

      if (response.ok) {
        const backendGroup = await response.json();

        // Map backend meal group to frontend format
        const mealGroup: MealGroup = {
          id: backendGroup.id.toString(),
          categoryId: backendGroup.category_id.toString(),
          name: backendGroup.meal_group_name,
        };

        const updated = [...localMealGroups, mealGroup];
        setLocalMealGroups(updated);
        onSave(updated);
        setNewGroup({ name: "", categoryId: "" });
        toast.success("Meal group added successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to add meal group');
      }
    } catch (error) {
      console.error('Error creating meal group:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeMealGroup = (id: string) => {
    // Note: Your vanilla JS didn't have a delete endpoint
    // If you add one later, you can implement the API call here
    const updated = localMealGroups.filter((g) => g.id !== id);
    setLocalMealGroups(updated);
    onSave(updated);
    toast.success("Meal group removed");
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  if (isCheckingSession) {
    return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Meal Groups</h2>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Meal Groups</h2>
          <p className="text-muted-foreground">
            Organize meals into groups within categories
            {restaurantName && <span className="ml-2 text-primary font-semibold">({restaurantName})</span>}
          </p>
        </div>

        {categories.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Please add categories first before creating meal groups</p>
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
                        onValueChange={(value) => setNewGroup({ ...newGroup, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.icon && `${category.icon} `}{category.name}
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
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addMealGroup();
                          }
                        }}
                    />
                  </div>

                  <Button onClick={addMealGroup} className="w-full" disabled={isLoading}>
                    <Plus className="mr-2 h-4 w-4" />
                    {isLoading ? 'Adding...' : 'Add Meal Group'}
                  </Button>
                </div>
              </Card>

              {/* Meal Groups List */}
              {localMealGroups.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Your Meal Groups ({localMealGroups.length})</h3>
                    <div className="grid gap-3">
                      {localMealGroups.map((group) => (
                          <Card key={group.id} className="p-4 flex items-center justify-between">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <span>🍽️</span>
                                <span>{group.name}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Category: {getCategoryName(group.categoryId)} | ID: {group.id}
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
              ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No meal groups added yet. Add your first meal group above!</p>
                  </Card>
              )}
            </>
        )}
      </div>
  );
};

export default MealGroupForm;