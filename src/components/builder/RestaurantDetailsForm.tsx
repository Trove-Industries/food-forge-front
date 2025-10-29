import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RestaurantDetails } from "@/pages/MenuBuilder";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RestaurantDetailsFormProps {
  initialData: RestaurantDetails | null;
  onSave: (data: RestaurantDetails) => void;
}

//const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://api.troveindustries.dev";

const RestaurantDetailsForm = ({ initialData, onSave }: RestaurantDetailsFormProps) => {
  const [formData, setFormData] = useState<RestaurantDetails>(
      initialData || {
        name: "",
        country: "",
        city: "",
        subdomain: "",
      }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Restore session if exists
  const checkExistingSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurant/restore-restaurant-session`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const restaurantData = await response.json();

        const restoredData: RestaurantDetails = {
          name: restaurantData.restaurant_name || '',
          country: restaurantData.restaurant_country || '',
          city: restaurantData.restaurant_city || '',
          subdomain: restaurantData.restaurant_subdomain || ''
        };

        setFormData(restoredData);
        setIsDisabled(true);
        onSave(restoredData);
        toast.info('Session restored! Restaurant details loaded.');
      }
    } catch (error) {
      console.error('Failed to check session:', error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && !isDisabled) {
      setFormData(initialData);
    }
  }, [initialData, isDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!formData.name.trim() || !formData.country.trim() ||
        !formData.city.trim() || !formData.subdomain.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    const restaurantDetails = {
      restaurant_name: formData.name.trim(),
      restaurant_country: formData.country.trim(),
      restaurant_city: formData.city.trim(),
      restaurant_subdomain: formData.subdomain.trim()
    };

    try {
      const response = await fetch(`${API_BASE_URL}/restaurant/create-restaurant`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantDetails)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Restaurant created successfully!');
        setIsDisabled(true);
        onSave(formData);
      } else {
        toast.error(data.error || 'Failed to create restaurant');
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
        <div className="space-y-6 flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Restaurant Details</h2>
          <p className="text-muted-foreground">Tell us about your restaurant</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Restaurant Name *</Label>
            <Input
                id="name"
                placeholder="e.g., The Golden Fork"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isDisabled}
                required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                  id="country"
                  placeholder="e.g., Kenya"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={isDisabled}
                  required
              />
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                  id="city"
                  placeholder="e.g., Nairobi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={isDisabled}
                  required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subdomain">Subdomain *</Label>
            <div className="flex items-center gap-2">
              <Input
                  id="subdomain"
                  placeholder="e.g., goldenfork"
                  value={formData.subdomain}
                  onChange={(e) =>
                      setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })
                  }
                  disabled={isDisabled}
                  required
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">.yourdomain.com</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This will be your menu's web address
            </p>
          </div>
        </div>

        <Button
            type="submit"
            className="w-full"
            disabled={isDisabled || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : isDisabled ? (
            'Restaurant Already Created'
          ) : (
            'Save & Continue'
          )}
        </Button>
      </form>
  );
};

export default RestaurantDetailsForm;