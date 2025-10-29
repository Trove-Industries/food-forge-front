import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealGroup, Meal, MealSize, MealPairing, MealIngredient } from "@/pages/MenuBuilder";
import { Plus, Trash2, Image as ImageIcon, Wand2 } from "lucide-react";
import ImageUploadDialog from "./ImageUploadDialog";
import { toast } from "sonner";

interface MealDetailsDialogProps {
  mealGroups: MealGroup[];
  meal: Meal | null;
  onSave: (meal: Meal) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MealDetailsDialog = ({ mealGroups, meal, onSave, onCancel, isLoading = false }: MealDetailsDialogProps) => {
  const [formData, setFormData] = useState<Meal>(
      meal || {
        id: Date.now().toString(),
        mealGroupId: "",
        name: "",
        description: "",
        image: "",
        sizes: [],
        pairings: [],
        ingredients: [],
      }
  );

  const [newSize, setNewSize] = useState({ name: "", price: "" });
  const [newPairing, setNewPairing] = useState({ name: "", price: "", image: "" });
  const [newIngredient, setNewIngredient] = useState({ name: "", image: "" });
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageDialogType, setImageDialogType] = useState<"meal" | "pairing" | "ingredient">("meal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate meal details
    if (!formData.mealGroupId) {
      toast.error('Please select a meal group');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a meal name');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a meal description');
      return;
    }

    if (!formData.image.trim()) {
      toast.error('Please add a meal image');
      return;
    }

    // Validate at least one size
    if (formData.sizes.length === 0) {
      toast.error('Please add at least one meal size');
      return;
    }

    onSave(formData);
  };

  const addSize = () => {
    if (!newSize.name.trim()) {
      toast.error('Please enter size name');
      return;
    }

    const price = parseFloat(newSize.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const size: MealSize = {
      id: Date.now().toString(),
      name: newSize.name.trim(),
      price: price,
    };

    setFormData({ ...formData, sizes: [...formData.sizes, size] });
    setNewSize({ name: "", price: "" });
    toast.success('Size added');
  };

  const removeSize = (id: string) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((s) => s.id !== id) });
    toast.success('Size removed');
  };

  const addPairing = () => {
    if (!newPairing.name.trim()) {
      toast.error('Please enter pairing name');
      return;
    }

    const price = parseFloat(newPairing.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const pairing: MealPairing = {
      id: Date.now().toString(),
      name: newPairing.name.trim(),
      image: newPairing.image.trim(),
      price: price,
    };

    setFormData({ ...formData, pairings: [...formData.pairings, pairing] });
    setNewPairing({ name: "", price: "", image: "" });
    toast.success('Pairing added');
  };

  const removePairing = (id: string) => {
    setFormData({ ...formData, pairings: formData.pairings.filter((p) => p.id !== id) });
    toast.success('Pairing removed');
  };

  const addIngredient = () => {
    if (!newIngredient.name.trim()) {
      toast.error('Please enter ingredient name');
      return;
    }

    const ingredient: MealIngredient = {
      id: Date.now().toString(),
      name: newIngredient.name.trim(),
      image: newIngredient.image.trim(),
    };

    setFormData({ ...formData, ingredients: [...formData.ingredients, ingredient] });
    setNewIngredient({ name: "", image: "" });
    toast.success('Ingredient added');
  };

  const removeIngredient = (id: string) => {
    setFormData({ ...formData, ingredients: formData.ingredients.filter((i) => i.id !== id) });
    toast.success('Ingredient removed');
  };

  const openImageDialog = (type: "meal" | "pairing" | "ingredient") => {
    setImageDialogType(type);
    setImageDialogOpen(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (imageDialogType === "meal") {
      setFormData({ ...formData, image: imageUrl });
    } else if (imageDialogType === "pairing") {
      setNewPairing({ ...newPairing, image: imageUrl });
    } else {
      setNewIngredient({ ...newIngredient, image: imageUrl });
    }
    setImageDialogOpen(false);
  };

  return (
      <>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="mealGroup">Meal Group *</Label>
              <Select
                  value={formData.mealGroupId}
                  onValueChange={(value) => setFormData({ ...formData, mealGroupId: value })}
                  required
                  disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a meal group" />
                </SelectTrigger>
                <SelectContent>
                  {mealGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mealName">Meal Name *</Label>
              <Input
                  id="mealName"
                  placeholder="e.g., Pasta Rotini"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <div className="space-y-2">
                <Textarea
                    id="description"
                    placeholder="e.g., Sweet pasta rotini with special sauce"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                    disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // TODO: Add API endpoint for AI description generation
                    // POST /api/generate-description
                    // Body: { mealName: formData.name, context: "meal" }
                    toast.info("AI description generation - Add API endpoint: POST /api/generate-description");
                  }}
                  disabled={isLoading}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Description with AI
                </Button>
              </div>
            </div>

            <div>
              <Label>Meal Image *</Label>
              <div className="flex gap-2 items-center mt-2">
                {formData.image && (
                    <img src={formData.image} alt="Meal" className="w-20 h-20 object-cover rounded-lg" />
                )}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => openImageDialog("meal")}
                    disabled={isLoading}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {formData.image ? "Change Image" : "Add Image"}
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="sizes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sizes">Sizes *</TabsTrigger>
              <TabsTrigger value="pairings">Pairings</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            </TabsList>

            <TabsContent value="sizes" className="space-y-4 mt-4">
              <Card className="p-4 bg-accent/50">
                <div className="space-y-3">
                  <Input
                      placeholder="Size name (e.g., Small)"
                      value={newSize.name}
                      onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
                      disabled={isLoading}
                  />
                  <Input
                      type="number"
                      step="0.01"
                      placeholder="Price (KSH)"
                      value={newSize.price}
                      onChange={(e) => setNewSize({ ...newSize, price: e.target.value })}
                      disabled={isLoading}
                  />
                  <Button
                      type="button"
                      onClick={addSize}
                      className="w-full"
                      size="sm"
                      disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Size
                  </Button>
                </div>
              </Card>

              {formData.sizes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    At least one size is required
                  </p>
              )}

              <div className="space-y-2">
                {formData.sizes.map((size) => (
                    <Card key={size.id} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{size.name}</div>
                        <div className="text-sm text-muted-foreground">KSH {size.price}</div>
                      </div>
                      <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSize(size.id)}
                          disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pairings" className="space-y-4 mt-4">
              <Card className="p-4 bg-accent/50">
                <div className="space-y-3">
                  <Input
                      placeholder="Pairing name (e.g., Beef)"
                      value={newPairing.name}
                      onChange={(e) => setNewPairing({ ...newPairing, name: e.target.value })}
                      disabled={isLoading}
                  />
                  <Input
                      type="number"
                      step="0.01"
                      placeholder="Price (KSH)"
                      value={newPairing.price}
                      onChange={(e) => setNewPairing({ ...newPairing, price: e.target.value })}
                      disabled={isLoading}
                  />
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => openImageDialog("pairing")}
                      className="w-full"
                      size="sm"
                      disabled={isLoading}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {newPairing.image ? "Change Image" : "Add Image (Optional)"}
                  </Button>
                  <Button
                      type="button"
                      onClick={addPairing}
                      className="w-full"
                      size="sm"
                      disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pairing
                  </Button>
                </div>
              </Card>

              {formData.pairings.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No pairings added yet (optional)
                  </p>
              )}

              <div className="space-y-2">
                {formData.pairings.map((pairing) => (
                    <Card key={pairing.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {pairing.image && (
                            <img src={pairing.image} alt={pairing.name} className="w-12 h-12 object-cover rounded" />
                        )}
                        <div>
                          <div className="font-medium">{pairing.name}</div>
                          <div className="text-sm text-muted-foreground">KSH {pairing.price}</div>
                        </div>
                      </div>
                      <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePairing(pairing.id)}
                          disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="space-y-4 mt-4">
              <Card className="p-4 bg-accent/50">
                <div className="space-y-3">
                  <Input
                      placeholder="Ingredient name (e.g., Tomato)"
                      value={newIngredient.name}
                      onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                      disabled={isLoading}
                  />
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => openImageDialog("ingredient")}
                      className="w-full"
                      size="sm"
                      disabled={isLoading}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {newIngredient.image ? "Change Image" : "Add Image (Optional)"}
                  </Button>
                  <Button
                      type="button"
                      onClick={addIngredient}
                      className="w-full"
                      size="sm"
                      disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Ingredient
                  </Button>
                </div>
              </Card>

              {formData.ingredients.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No ingredients added yet (optional)
                  </p>
              )}

              <div className="space-y-2">
                {formData.ingredients.map((ingredient) => (
                    <Card key={ingredient.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {ingredient.image && (
                            <img src={ingredient.image} alt={ingredient.name} className="w-12 h-12 object-cover rounded" />
                        )}
                        <div className="font-medium">{ingredient.name}</div>
                      </div>
                      <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(ingredient.id)}
                          disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Meal'}
            </Button>
          </div>
        </form>

        <ImageUploadDialog
            open={imageDialogOpen}
            onClose={() => setImageDialogOpen(false)}
            onSelect={handleImageSelect}
        />
      </>
  );
};

export default MealDetailsDialog;