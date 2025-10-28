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
    const [formData, setFormData] = useState<RestaurantDetails>({
        name: "",
        country: "",
        city: "",
        subdomain: "",
    });
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false); // disable form if session exists
    const [sessionRestored, setSessionRestored] = useState(false); // prevent double restore in Strict Mode

    // Restore session on mount
    useEffect(() => {
        async function restoreSession() {
            if (sessionRestored) return; // only restore once

            try {
                const response = await fetch(
                    "https://api.troveindustries.dev/restaurant/restore-restaurant-session",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json().catch(() => ({}));

                    if (data.restaurant_name) {
                        const restoredData = {
                            name: data.restaurant_name,
                            country: data.restaurant_country,
                            city: data.restaurant_city,
                            subdomain: data.restaurant_subdomain,
                        };

                        setFormData(restoredData);
                        setDisabled(true);
                        setSessionRestored(true);

                        toast.success("Session restored! Restaurant details loaded.");
                        onSave(restoredData);
                    }
                }
            } catch (err) {
                console.error("Failed to restore session:", err);
            }
        }

        restoreSession();
    }, [onSave, sessionRestored]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Creating restaurant...");

        try {
            const response = await fetch(
                "https://api.troveindustries.dev/restaurant/create-restaurant",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        restaurant_name: formData.name,
                        restaurant_country: formData.country,
                        restaurant_city: formData.city,
                        restaurant_subdomain: formData.subdomain,
                    }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || `Failed: ${response.status}`);
            }

            setDisabled(true);
            setSessionRestored(true);
            toast.success("Restaurant created and session saved!", { id: toastId });
            onSave(formData);
        } catch (err) {
            console.error(err);
            const errorMessage =
                err instanceof Error ? err.message : "Something went wrong.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setLoading(false);
            toast.dismiss();
        }
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
                        disabled={disabled}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                            id="country"
                            placeholder="e.g., Kenya"
                            value={formData.country}
                            onChange={(e) =>
                                setFormData({ ...formData, country: e.target.value })
                            }
                            required
                            disabled={disabled}
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
                            disabled={disabled}
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
                                setFormData({
                                    ...formData,
                                    subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""),
                                })
                            }
                            required
                            disabled={disabled}
                        />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
              .troveindustries.dev
            </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        This will be your restaurant’s unique website address.
                    </p>
                </div>
            </div>

            {!disabled ? (
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create & Continue"}
                </Button>
            ) : (
                <Button type="button" className="w-full" disabled>
                    Restaurant Already Created
                </Button>
            )}
        </form>
    );
};

export default RestaurantDetailsForm;
