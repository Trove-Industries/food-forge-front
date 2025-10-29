import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Category } from "@/pages/MenuBuilder";
import { Plus, Trash2, UtensilsCrossed, Coffee, Soup, IceCream, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUploadDialog from "./ImageUploadDialog";

interface CategoryFormProps {
  categories: Category[];
  onSave: (data: Category[]) => void;
}

const API_BASE_URL = 'http://localhost:8000';

const iconOptions = [
  { value: "utensils", icon: UtensilsCrossed, label: "Main Course" },
  { value: "coffee", icon: Coffee, label: "Beverages" },
  { value: "soup", icon: Soup, label: "Appetizers" },
  { value: "icecream", icon: IceCream, label: "Desserts" },
];

const CategoryForm = ({ categories, onSave }: CategoryFormProps) => {
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [restaurantName, setRestaurantName] = useState("");

  // Check session and load existing categories on mount
  useEffect(() => {
    checkSessionAndLoadCategories();
  }, []);

  // Check if user has a valid session and load categories
  const checkSessionAndLoadCategories = async () => {
    try {
      // First, verify restaurant session
      const sessionResponse = await fetch(`${API_BASE_URL}/restaurant/restore-restaurant-session`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!sessionResponse.ok) {
        toast.error('No restaurant session found. Please create a restaurant first.');
        // You might want to navigate back to step 1 here
        setIsCheckingSession(false);
        return;
      }

      const restaurantData = await sessionResponse.json();
      setRestaurantName(restaurantData.restaurant_name);

      // Now load existing categories
      await loadCategories();
    } catch (error) {
      console.error('Failed to check session:', error);
      toast.error('Failed to verify session');
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Load existing categories from backend
  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/restore-category-session`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const backendCategories = await response.json();

        // Map backend categories to frontend format
        const mappedCategories: Category[] = backendCategories.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.category_name,
          icon: cat.category_icon || 'utensils'
        }));

        setLocalCategories(mappedCategories);
        onSave(mappedCategories);
      } else if (response.status === 404) {
        // No categories yet - that's fine
        setLocalCategories([]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Don't show error - just start with empty list
    }
  };

  const addCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!newCategory.icon) {
      toast.error("Please select a category image");
      return;
    }

    setIsLoading(true);

    const categoryData = {
      category_name: newCategory.name.trim(),
      category_icon: newCategory.icon // This is now an image URL
    };

    try {
      const response = await fetch(`${API_BASE_URL}/menu/create-category`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      });

      if (response.ok) {
        const backendCategory = await response.json();

        // Map backend category to frontend format
        const category: Category = {
          id: backendCategory.id.toString(),
          name: backendCategory.category_name,
          icon: backendCategory.category_icon || 'utensils',
        };

        const updated = [...localCategories, category];
        setLocalCategories(updated);
        onSave(updated);
        setNewCategory({ name: "", icon: "" });
        toast.success("Category added successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCategory = (id: string) => {
    // Note: Your vanilla JS didn't have a delete endpoint
    // If you add one later, you can implement the API call here
    const updated = localCategories.filter((c) => c.id !== id);
    setLocalCategories(updated);
    onSave(updated);
    toast.success("Category removed");
  };

  if (isCheckingSession) {
    return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Menu Categories</h2>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Menu Categories</h2>
          <p className="text-muted-foreground">
            Add categories to organize your menu items
            {restaurantName && <span className="ml-2 text-primary font-semibold">({restaurantName})</span>}
          </p>
        </div>

        {/* Add New Category */}
        <Card className="p-4 bg-accent/50">
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                  id="categoryName"
                  placeholder="e.g., Main Course"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
              />
            </div>

            <div>
              <Label>Category Image *</Label>
              <div className="flex gap-2 items-center mt-2">
                {newCategory.icon && (
                  <img src={newCategory.icon} alt="Category" className="w-20 h-20 object-cover rounded-lg border-2 border-primary" />
                )}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    const dialog = document.createElement('div');
                    const tempOpen = true;
                  }}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {newCategory.icon ? "Change Image" : "Choose Image"}
                </Button>
              </div>
            </div>

            <Button onClick={addCategory} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </>
              )}
            </Button>
          </div>
        </Card>

        <ImageUploadDialog 
          open={true}
          onClose={() => {}}
          onSelect={(url) => setNewCategory({ ...newCategory, icon: url })}
        />

        {/* Categories List */}
        {localCategories.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-semibold">Your Categories ({localCategories.length})</h3>
              <div className="grid gap-3">
                {localCategories.map((category) => {
                  return (
                      <Card key={category.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {category.icon ? (
                            <img 
                              src={category.icon} 
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <UtensilsCrossed className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <span className="font-medium">{category.name}</span>
                            <p className="text-xs text-muted-foreground">ID: {category.id}</p>
                          </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </Card>
                  );
                })}
              </div>
            </div>
        ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No categories added yet. Add your first category above!</p>
            </Card>
        )}
      </div>
  );
};

export default CategoryForm;