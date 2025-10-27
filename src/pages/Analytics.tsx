import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Eye, MousePointerClick } from "lucide-react";

const Analytics = () => {
  const navigate = useNavigate();

  // TODO: Fetch analytics data from API
  // API endpoint: GET /api/analytics

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold">Analytics</h1>
            <div className="w-32" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                <p className="text-3xl font-bold">1,234</p>
                <p className="text-xs text-secondary mt-1">+12% from last week</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Eye className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Menu Clicks</p>
                <p className="text-3xl font-bold">856</p>
                <p className="text-xs text-secondary mt-1">+8% from last week</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <MousePointerClick className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Engagement Rate</p>
                <p className="text-3xl font-bold">69%</p>
                <p className="text-xs text-secondary mt-1">+5% from last week</p>
              </div>
              <div className="p-3 bg-accent rounded-lg">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Popular Menu Items</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="font-semibold">Pasta Rotini</p>
                <p className="text-sm text-muted-foreground">Main Course</p>
              </div>
              <p className="text-lg font-bold">342 views</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="font-semibold">Caesar Salad</p>
                <p className="text-sm text-muted-foreground">Appetizers</p>
              </div>
              <p className="text-lg font-bold">287 views</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="font-semibold">Chocolate Cake</p>
                <p className="text-sm text-muted-foreground">Desserts</p>
              </div>
              <p className="text-lg font-bold">156 views</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
