import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

//const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://api.troveindustries.dev";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuData = location.state; // optional extra data

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), menuData }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast.error(data.error || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/30 to-background p-4">
        <Card className="w-full max-w-md p-8 shadow-large">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">
              Sign up to publish your menu and access your dashboard
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                  id="email"
                  type="email"
                  placeholder="you@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account & Publish"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </Card>
      </div>
  );
};

export default Signup;
