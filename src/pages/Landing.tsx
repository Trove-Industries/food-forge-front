import { Button } from "@/components/ui/button";
import { ChefHat, Menu, Sparkles, Eye } from "lucide-react";

const Landing = () => {
  return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop"
                alt="Restaurant Menu Builder"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="text-center space-y-8">
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

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-large"
                      onClick={() => window.location.href = '/builder'}
                  >
                    <ChefHat className="mr-2 h-5 w-5" />
                    Make Your Menu
                  </Button>
                  <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 border-2"
                      onClick={() => window.location.href = '/builder'}
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    See Demo
                  </Button>
                </div>
              </div>

              {/* Feature Cards - Now integrated below the buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                {[
                  { icon: Menu, title: "Easy Menu Builder", desc: "Drag & drop interface" },
                  { icon: Sparkles, title: "AI-Powered Images", desc: "Generate stunning visuals" },
                  { icon: ChefHat, title: "Professional Design", desc: "Beautiful templates" },
                ].map((feature, i) => (
                    <div
                        key={i}
                        className="bg-card/80 backdrop-blur-md p-6 rounded-xl border border-border shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-1"
                    >
                      <feature.icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold text-card-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Landing;