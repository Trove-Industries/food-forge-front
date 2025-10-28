import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Category } from "@/pages/MenuBuilder";
import {
  Plus,
  Trash2,
  UtensilsCrossed,
  Coffee,
  Soup,
  IceCream,
} from "lucide-react";
import { toast } from "sonner";

interface CategoryFormProps {
  onSave: (data: Category[]) => void;
}

const API_BASE_URL = "https://api.troveindustries.dev";

const iconOptions = [
  { value: "utensils", icon: UtensilsCrossed, label: "Main Course" },
  { value: "coffee", icon: Coffee, label: "Beverages" },
  { value: "soup", icon: Soup, label: "Appetizers" },
  { value: "icecream", icon: IceCream, label: "Desserts" },
];

const CategoryForm = ({ onSave }: CategoryFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "utensils" });
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ On mount: check restaurant session & restore categories
  useEffect(() => {
    async function init() {
      try {
        // Check restaurant session
        const resSession = await fetch(
            `${API_BASE_URL}/restaurant/restore-restaurant-session`,
            { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } }
        );

        if (!resSession.ok) {
          toast.error("No restaurant session found. Redirecting...");
          setTimeout(() => (window.location.href = "/"), 2000);
          return;
        }

        const restaurantData = await resSession.json();
        setRestaurantName(restaurantData.restaurant_name);

        // Restore categories
        const resCategories = await fetch(
            `${API_BASE_URL}/menu/restore-category-session`,
            { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } }
        );

        if (resCategories.ok) {
          const existingCategories: Category[] = await resCategories.json();
          // Ensure restored categories have default icon if missing
          const formattedCategories = existingCategories.map((c) => ({
            ...c,
            icon: c.icon || "utensils",
          }));
          setCategories(formattedCategories);
          onSave(formattedCategories);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to load restaurant or categories.");
      }
    }

    init();
  }, [onSave]);

  // ✅ Add a new category
  const addCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/menu/create-category`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: newCategory.name, category_icon: newCategory.icon }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create category");
      }

      const createdCategory: Category = await res.json();
      const updated = [...categories, createdCategory];
      setCategories(updated);
      onSave(updated);

      setNewCategory({ name: "", icon: "utensils" });
      toast.success("Category added successfully!");
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete category
  const removeCategory = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/delete-category/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete category");

      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      onSave(updated);
      toast.success("Category removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Menu Categories</h2>
          <p className="text-muted-foreground">
            Restaurant: {restaurantName || "Loading..."}
          </p>
        </div>

        {/* Add Category */}
        <Card className="p-4 bg-accent/50">
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                  id="categoryName"
                  placeholder="e.g., Main Course"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Category Icon</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {iconOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                      <button
                          key={option.value}
                          type="button"
                          onClick={() => setNewCategory({ ...newCategory, icon: option.value })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                              newCategory.icon === option.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                          }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs">{option.label}</span>
                      </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={addCategory} className="w-full" disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              {loading ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </Card>

        {/* Categories List */}
        {categories.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-semibold">Your Categories ({categories.length})</h3>
              <div className="grid gap-3">
                {categories.map((category) => {
                  const IconComponent =
                      iconOptions.find((i) => i.value === category.icon)?.icon ||
                      UtensilsCrossed;
                  return (
                      <Card key={category.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeCategory(category.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </Card>
                  );
                })}
              </div>
              <Button
                  onClick={() => (window.location.href = "/menu_add_meal_group")}
                  className="w-full mt-4"
              >
                Continue
              </Button>
            </div>
        ) : (
            <p className="text-sm text-muted-foreground">
              No categories added yet. Add your first category above!
            </p>
        )}
      </div>
  );
};

export default CategoryForm;
