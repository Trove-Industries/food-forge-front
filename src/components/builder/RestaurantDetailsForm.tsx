import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RestaurantDetails } from "@/pages/MenuBuilder";
import { toast } from "sonner";

interface RestaurantDetailsFormProps {
  initialData: RestaurantDetails | null;
  onSave: (data: RestaurantDetails) => void;
}

const RestaurantDetailsForm = ({ initialData, onSave }: RestaurantDetailsFormProps) => {
  const [formData, setFormData] = useState<RestaurantDetails>(
    initialData || {
      name: "",
      country: "",
      city: "",
      subdomain: "",
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // API Integration Point: POST /api/restaurant-details
    // Send formData to your backend
    
    onSave(formData);
    toast.success("Restaurant details saved!");
  };

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
              required
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">.yourdomain.com</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            This will be your menu's web address
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save & Continue
      </Button>
    </form>
  );
};

export default RestaurantDetailsForm;
