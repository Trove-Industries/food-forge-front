import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";

//const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://api.troveindustries.dev";

interface RestaurantDetails {
    restaurant_name: string;
    subdomain: string;
}

const MenuPreviewDashboard = () => {
    const navigate = useNavigate();
    const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRestaurant();
    }, []);

    const loadRestaurant = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/restaurant/restore-restaurant-session`, {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setRestaurantDetails({
                    restaurant_name: data.restaurant_name,
                    subdomain: data.restaurant_subdomain,
                });
            } else {
                toast.error("Failed to load restaurant details");
            }
        } catch (err) {
            console.error("Error loading restaurant:", err);
            toast.error("Failed to load restaurant");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenInBrowser = () => {
        if (!restaurantDetails?.subdomain) {
            toast.error("Restaurant subdomain not available");
            return;
        }
        window.open(
            `http://${restaurantDetails.subdomain}.localhost:8000/menu`,
            "_blank"
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading preview...</p>
            </div>
        );
    }

    if (!restaurantDetails?.subdomain) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>No restaurant subdomain found. Please configure your restaurant settings.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-xl font-bold">
                        {restaurantDetails.restaurant_name} - Live Menu Preview
                    </h1>
                    <Button onClick={handleOpenInBrowser}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in Browser
                    </Button>
                </div>
            </div>

            {/* Menu Preview iframe */}
            <div className="h-[calc(100vh-73px)]">
                <iframe
                    src={`http://${restaurantDetails.subdomain}.localhost:8000/menu`}
                    className="w-full h-full border-0 rounded-none"
                    title="Menu Preview"
                />
            </div>
        </div>
    );
};

export default MenuPreviewDashboard;
