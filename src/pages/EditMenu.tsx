import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Eye, Save } from "lucide-react";
import RestaurantDetailsForm from "@/components/builder/RestaurantDetailsForm";
import CategoryForm from "@/components/builder/CategoryForm";
import MealGroupForm from "@/components/builder/MealGroupForm";
import MealForm from "@/components/builder/MealForm";
import { RestaurantDetails, Category, MealGroup, Meal } from "./MenuBuilder";
import { toast } from "@/hooks/use-toast";

const EditMenu = () => {
  const navigate = useNavigate();
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mealGroups, setMealGroups] = useState<MealGroup[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeTab, setActiveTab] = useState("restaurant");

  useEffect(() => {
    // TODO: Fetch menu data from API
    // API endpoint: GET /api/menu
    // This will load the existing menu data for editing
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/menu');
      // const data = await response.json();
      // setRestaurantDetails(data.restaurantDetails);
      // setCategories(data.categories);
      // setMealGroups(data.mealGroups);
      // setMeals(data.meals);
      
      console.log("Loading menu data from API...");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Save changes to API
      // API endpoint: PUT /api/menu
      console.log("Saving menu data to API...");
      
      toast({
        title: "Success",
        description: "Menu updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    if (restaurantDetails) {
      window.open(`https://${restaurantDetails.subdomain}.troveindustries.dev/menu`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold">Edit Menu</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="groups">Meal Groups</TabsTrigger>
            <TabsTrigger value="meals">Meals</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurant">
            <Card className="p-6">
              <RestaurantDetailsForm
                initialData={restaurantDetails}
                onSave={(data) => setRestaurantDetails(data)}
              />
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="p-6">
              <CategoryForm
                categories={categories}
                onSave={(data) => setCategories(data)}
              />
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card className="p-6">
              <MealGroupForm
                categories={categories}
                mealGroups={mealGroups}
                onSave={(data) => setMealGroups(data)}
              />
            </Card>
          </TabsContent>

          <TabsContent value="meals">
            <Card className="p-6">
              <MealForm
                mealGroups={mealGroups}
                meals={meals}
                onSave={(data) => setMeals(data)}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EditMenu;
