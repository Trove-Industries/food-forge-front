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
  categories: Category[];
  onSave: (data: Category[]) => void;
}

const API_BASE_URL = "https://api.troveindustries.dev";

const iconOptions = [
  { value: "utensils", icon: UtensilsCrossed, label: "Main Course" },
  { value: "coffee", icon: Coffee, label: "Beverages" },
  { value: "soup", icon: Soup, label: "Appetizers" },
  { value: "icecream", icon: IceCream, label: "Desserts" },
];

const CategoryForm = ({ categories, onSave }: CategoryFormProps) => {
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "utensils",
  });

  // ✅ Load existing categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/menu/get-categories`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to load categories");

        const data: Category[] = await response.json();
        setLocalCategories(data);
        onSave(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Could not load categories");
      }
    };

    fetchCategories();
  }, [onSave]);

  // ✅ Add category
  const addCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/menu/create-category`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: newCategory.name,
          category_icon: newCategory.icon,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create category");
      }

      const data: Category = await response.json();
      const updated = [...localCategories, data];

      setLocalCategories(updated);
      onSave(updated);
      setNewCategory({ name: "", icon: "utensils" });
      toast.success("Category added successfully!");
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error("Failed to create category");
    }
  };

  // ✅ Delete category
  const removeCategory = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/delete-category/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete category");
      }

      const updated = localCategories.filter((c) => c.id !== id);
      setLocalCategories(updated);
      onSave(updated);
      toast.success("Category removed successfully!");
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category");
    }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Menu Categories</h2>
          <p className="text-muted-foreground">
            Add categories to organize your menu items
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
                  onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                  }
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
                          onClick={() =>
                              setNewCategory({ ...newCategory, icon: option.value })
                          }
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

            <Button onClick={addCategory} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </Card>

        {/* Categories List */}
        {localCategories.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">
                Your Categories ({localCategories.length})
              </h3>
              <div className="grid gap-3">
                {localCategories.map((category) => {
                  const IconComponent =
                      iconOptions.find((i) => i.value === category.icon)?.icon ||
                      UtensilsCrossed;
                  return (
                      <Card
                          key={category.id}
                          className="p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{category.name}</span>
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
        )}
      </div>
  );
};

export default CategoryForm;
