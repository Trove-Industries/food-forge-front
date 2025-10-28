import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChefHat, Menu, Sparkles, Eye } from "lucide-react";
import heroImage from "@/assets/hero-restaurant.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Restaurant Menu Builder"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 backdrop-blur-sm border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">Build Your Menu in Minutes</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Create Beautiful
              </span>
              <br />
              Digital Menus
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform your restaurant experience with stunning, easy-to-manage digital menus. 
              No technical skills required.
            </p>

            {/* Feature Cards - Moved Higher */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 max-w-3xl mx-auto">
              {[
                { icon: Menu, title: "Easy Menu Builder", desc: "Drag & drop interface" },
                { icon: Sparkles, title: "AI-Powered Images", desc: "Generate stunning visuals" },
                { icon: ChefHat, title: "Professional Design", desc: "Beautiful templates" },
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="bg-card/80 backdrop-blur-md p-5 rounded-xl border border-border shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-1"
                >
                  <feature.icon className="w-7 h-7 text-primary mb-2 mx-auto" />
                  <h3 className="font-semibold text-card-foreground mb-1 text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-large"
                onClick={() => navigate("/builder")}
              >
                <ChefHat className="mr-2 h-5 w-5" />
                Make Your Menu
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-2"
                onClick={() => navigate("/builder")}
              >
                <Eye className="mr-2 h-5 w-5" />
                See Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
