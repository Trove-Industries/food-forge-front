import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { RestaurantDetails, Category, MealGroup, Meal } from "./MenuBuilder";

const MenuPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantDetails, categories, mealGroups, meals } = location.state as {
    restaurantDetails: RestaurantDetails;
    categories: Category[];
    mealGroups: MealGroup[];
    meals: Meal[];
  };

  const handlePublish = () => {
    // Navigate to signup page
    navigate("/signup", { state: { restaurantDetails, categories, mealGroups, meals } });
  };

  const getMealsByGroup = (groupId: string) => {
    return meals.filter((meal) => meal.mealGroupId === groupId);
  };

  const getGroupsByCategory = (categoryId: string) => {
    return mealGroups.filter((group) => group.categoryId === categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/builder")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
          <h1 className="text-xl font-bold">{restaurantDetails.name} - Menu Preview</h1>
          <Button onClick={handlePublish}>
            <Send className="mr-2 h-4 w-4" />
            Publish Menu
          </Button>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Restaurant Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">{restaurantDetails.name}</h1>
          <p className="text-muted-foreground">
            {restaurantDetails.city}, {restaurantDetails.country}
          </p>
        </div>

        {/* Categories and Meals */}
        <div className="space-y-12">
          {categories.map((category) => {
            const groups = getGroupsByCategory(category.id);
            if (groups.length === 0) return null;

            return (
              <div key={category.id}>
                <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-primary">
                  {category.name}
                </h2>

                {groups.map((group) => {
                  const groupMeals = getMealsByGroup(group.id);
                  if (groupMeals.length === 0) return null;

                  return (
                    <div key={group.id} className="mb-8">
                      <h3 className="text-2xl font-semibold mb-4 text-secondary">
                        {group.name}
                      </h3>

                      <div className="space-y-6">
                        {groupMeals.map((meal) => (
                          <Card key={meal.id} className="p-6 hover:shadow-large transition-shadow">
                            <div className="flex gap-6">
                              {meal.image && (
                                <img
                                  src={meal.image}
                                  alt={meal.name}
                                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                                />
                              )}
                              
                              <div className="flex-1">
                                <h4 className="text-xl font-semibold mb-2">{meal.name}</h4>
                                <p className="text-muted-foreground mb-4">{meal.description}</p>

                                {/* Sizes */}
                                {meal.sizes.length > 0 && (
                                  <div className="mb-3">
                                    <p className="text-sm font-medium mb-2">Available Sizes:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {meal.sizes.map((size) => (
                                        <span
                                          key={size.id}
                                          className="px-3 py-1 bg-accent rounded-full text-sm"
                                        >
                                          {size.name} - KSH {size.price}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Pairings */}
                                {meal.pairings.length > 0 && (
                                  <div className="mb-3">
                                    <p className="text-sm font-medium mb-2">Add-ons:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {meal.pairings.map((pairing) => (
                                        <span
                                          key={pairing.id}
                                          className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                                        >
                                          {pairing.name} +KSH {pairing.price}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Ingredients */}
                                {meal.ingredients.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium mb-2">Ingredients:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {meal.ingredients.map((ingredient) => (
                                        <span
                                          key={ingredient.id}
                                          className="px-2 py-1 bg-muted rounded text-xs"
                                        >
                                          {ingredient.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Publish Button */}
        <div className="mt-12 text-center">
          <Button size="lg" onClick={handlePublish} className="px-12">
            <Send className="mr-2 h-5 w-5" />
            Publish This Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuPreview;
