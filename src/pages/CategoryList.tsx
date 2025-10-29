import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit2, Loader2, UtensilsCrossed, Coffee, Soup, IceCream } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL = "http://localhost:8000";

interface Category {
  id: number;
  category_name: string;
  category_icon: string;
}

const iconOptions = [
  { value: "utensils", icon: UtensilsCrossed, label: "Main Course" },
  { value: "coffee", icon: Coffee, label: "Beverages" },
  { value: "soup", icon: Soup, label: "Appetizers" },
  { value: "icecream", icon: IceCream, label: "Desserts" },
];

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ category_name: "", category_icon: "" });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/menu/restore-category-session`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Network error loading categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({
      category_name: category.category_name,
      category_icon: category.category_icon,
    });
  };

  const handleSave = async (id: number) => {
    // TODO: Add API endpoint for updating category
    // PUT /menu/update-category/:id
    // Body: { category_name: string, category_icon: string }
    
    toast.info("Edit API not implemented yet. Add PUT /menu/update-category/:id");
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ category_name: "", category_icon: "" });
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
          <h1 className="text-3xl font-bold">All Categories</h1>
          <p className="text-muted-foreground">Manage your menu categories</p>
        </div>
      </div>

      {/* Categories List */}
      <div className="container mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No categories found</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {categories.map((category) => {
              const IconComponent = iconOptions.find((i) => i.value === category.category_icon)?.icon || UtensilsCrossed;
              const isEditing = editingId === category.id;

              return (
                <Card key={category.id} className="p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Category Name</Label>
                        <Input
                          value={editForm.category_name}
                          onChange={(e) => setEditForm({ ...editForm, category_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {iconOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setEditForm({ ...editForm, category_icon: option.value })}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  editForm.category_icon === option.value
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <Icon className="w-6 h-6 mx-auto" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSave(category.id)}>Save</Button>
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{category.category_name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {category.id}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
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

export default CategoryList;
