import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Menu, Eye, Settings, BarChart, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  // TODO: Fetch actual data from API
  // API endpoint: GET /api/dashboard-stats
  
  const handleEditMenu = () => {
    navigate("/edit-menu");
  };

  const handlePreviewMenu = () => {
    // TODO: Get subdomain from API
    // For now using placeholder
    window.open("https://yourrestaurant.troveindustries.dev/menu", "_blank");
  };

  const handleLogout = () => {
    // TODO: Implement logout API call
    // API endpoint: POST /api/auth/logout
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your restaurant menu</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                <p className="text-3xl font-bold">1,234</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Eye className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Menu Items</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Menu className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Categories</p>
                <p className="text-3xl font-bold">4</p>
              </div>
              <div className="p-3 bg-accent rounded-lg">
                <BarChart className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="w-full justify-start h-auto py-4" 
              variant="outline"
              onClick={handleEditMenu}
            >
              <Menu className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Edit Menu</div>
                <div className="text-xs text-muted-foreground">Update your menu items</div>
              </div>
            </Button>

            <Button 
              className="w-full justify-start h-auto py-4" 
              variant="outline"
              onClick={handlePreviewMenu}
            >
              <Eye className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Preview Menu</div>
                <div className="text-xs text-muted-foreground">See how customers view your menu</div>
              </div>
            </Button>

            <Button 
              className="w-full justify-start h-auto py-4" 
              variant="outline"
              onClick={() => navigate("/analytics")}
            >
              <BarChart className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">View Analytics</div>
                <div className="text-xs text-muted-foreground">Track menu performance</div>
              </div>
            </Button>

            <Button 
              className="w-full justify-start h-auto py-4" 
              variant="outline"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Restaurant Settings</div>
                <div className="text-xs text-muted-foreground">Update restaurant details</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
