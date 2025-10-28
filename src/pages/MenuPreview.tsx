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

      {/* Menu Preview with iframe */}
      <div className="h-[calc(100vh-73px)]">
        <iframe
          src={`http://${restaurantDetails.subdomain}.localhost:8000/menu`} /* TODO change to https//${restaurantDetails.subdomain}.troveindustries.dev/menu in deployment*/
          className="w-full h-full border-0"
          title="Menu Preview"
        />
      </div>
    </div>
  );
};

export default MenuPreview;
