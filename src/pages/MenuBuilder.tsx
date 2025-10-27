import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import RestaurantDetailsForm from "@/components/builder/RestaurantDetailsForm";
import CategoryForm from "@/components/builder/CategoryForm";
import MealGroupForm from "@/components/builder/MealGroupForm";
import MealForm from "@/components/builder/MealForm";
import { useNavigate } from "react-router-dom";

export interface RestaurantDetails {
  name: string;
  country: string;
  city: string;
  subdomain: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface MealGroup {
  id: string;
  categoryId: string;
  name: string;
}

export interface MealSize {
  id: string;
  name: string;
  price: number;
}

export interface MealPairing {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface MealIngredient {
  id: string;
  name: string;
  image: string;
}

export interface Meal {
  id: string;
  mealGroupId: string;
  name: string;
  description: string;
  image: string;
  sizes: MealSize[];
  pairings: MealPairing[];
  ingredients: MealIngredient[];
}

const steps = [
  { id: 1, name: "Restaurant Details", component: "restaurant" },
  { id: 2, name: "Categories", component: "categories" },
  { id: 3, name: "Meal Groups", component: "mealGroups" },
  { id: 4, name: "Meals", component: "meals" },
];

const MenuBuilder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mealGroups, setMealGroups] = useState<MealGroup[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePreview = () => {
    navigate("/preview", { 
      state: { restaurantDetails, categories, mealGroups, meals } 
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return restaurantDetails !== null;
      case 2:
        return categories.length > 0;
      case 3:
        return mealGroups.length > 0;
      case 4:
        return meals.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Menu</h1>
          <p className="text-muted-foreground">Follow the steps to build your restaurant menu</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex-1 text-center ${
                  step.id === currentStep
                    ? "text-primary font-semibold"
                    : step.id < currentStep
                    ? "text-secondary"
                    : "text-muted-foreground"
                }`}
              >
                <div className="text-sm">{step.name}</div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="p-6 md:p-8 mb-6 shadow-medium">
          {currentStep === 1 && (
            <RestaurantDetailsForm
              initialData={restaurantDetails}
              onSave={(data) => setRestaurantDetails(data)}
            />
          )}
          {currentStep === 2 && (
            <CategoryForm
              categories={categories}
              onSave={(data) => setCategories(data)}
            />
          )}
          {currentStep === 3 && (
            <MealGroupForm
              categories={categories}
              mealGroups={mealGroups}
              onSave={(data) => setMealGroups(data)}
            />
          )}
          {currentStep === 4 && (
            <MealForm
              mealGroups={mealGroups}
              meals={meals}
              onSave={(data) => setMeals(data)}
            />
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-3">
            {currentStep === steps.length && (
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!canProceed()}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Menu
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBuilder;
