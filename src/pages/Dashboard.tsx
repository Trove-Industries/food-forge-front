import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Menu, Eye, BarChart, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:8000";

interface RestaurantDetails {
  restaurant_name: string;
  restaurant_subdomain: string;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);
  const [stats, setStats] = useState({
    categories: 0,
    mealGroups: 0,
    meals: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // On mount: load restaurant and stats
  useEffect(() => {
    const initDashboard = async () => {
      await loadRestaurant();
      await loadStats();
      setIsLoading(false);
    };

    initDashboard();
  }, []);

  // Restore restaurant session
  const loadRestaurant = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/restaurant/restore-restaurant-session`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setRestaurantDetails(data);
      } else {
        setRestaurantDetails({ restaurant_name: "Trove Restaurant", restaurant_subdomain: "" });
      }
    } catch (err) {
      console.error("Error loading restaurant:", err);
      setRestaurantDetails({ restaurant_name: "Trove Restaurant", restaurant_subdomain: "" });
    }
  };

  // Load stats for categories, meal groups, meals
  const loadStats = async () => {
    try {
      const [catRes, groupRes, mealRes] = await Promise.all([
        fetch(`${API_BASE_URL}/menu/restore-category-session`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/menu/restore-meal-group-session`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/menu/restore-meal-session`, { credentials: "include" }),
      ]);

      setStats({
        categories: catRes.ok ? (await catRes.json()).length : 0,
        mealGroups: groupRes.ok ? (await groupRes.json()).length : 0,
        meals: mealRes.ok ? (await mealRes.json()).length : 0,
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
      toast.error("Failed to load dashboard stats.");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/restaurant/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/");
    }
  };

  const handlePreviewMenu = () => {
    if (!restaurantDetails?.restaurant_subdomain) {
      toast.error("Restaurant subdomain not available");
      return;
    }
    window.open(
        `http://${restaurantDetails.restaurant_subdomain}.localhost:8000/menu`,
        "_blank"
    );
    // TODO: change to https://${restaurantDetails.subdomain}.troveindustries.dev/menu in production
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading dashboard...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
        {/* Header */}
        <div className="border-b bg-background/80 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{restaurantDetails?.restaurant_name || "Dashboard"}</h1>
                <p className="text-sm text-muted-foreground">Manage your restaurant menu</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Categories</p>
                <p className="text-3xl font-bold">{stats.categories}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Meal Groups</p>
                <p className="text-3xl font-bold">{stats.mealGroups}</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Menu className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Meals</p>
                <p className="text-3xl font-bold">{stats.meals}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Eye className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="container mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="w-full justify-start h-auto py-4" variant="outline" onClick={() => navigate("/edit-menu")}>
              <Menu className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Edit Menu</div>
                <div className="text-xs text-muted-foreground">Update your menu items</div>
              </div>
            </Button>

            <Button
                className="w-full justify-start h-auto py-4"
                variant="outline"
                onClick={() => navigate("/menu-preview")}
            >
              <Eye className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Preview Menu</div>
                <div className="text-xs text-muted-foreground">
                  See how customers view your menu
                </div>
              </div>
            </Button>


            <Button className="w-full justify-start h-auto py-4" variant="outline" onClick={() => navigate("/analytics")}>
              <BarChart className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">View Analytics</div>
                <div className="text-xs text-muted-foreground">Track menu performance</div>
              </div>
            </Button>

            <Button className="w-full justify-start h-auto py-4" variant="outline" onClick={() => navigate("/settings")}>
              <Settings className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Restaurant Settings</div>
                <div className="text-xs text-muted-foreground">Update restaurant details</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
  );
};

export default Dashboard;
