import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Wand2, Image as ImageIcon, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}

const ImageUploadDialog = ({ open, onClose, onSelect }: ImageUploadDialogProps) => {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  // Stock image examples (in real app, these would come from an API)
  const allStockImages = [
    { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", tags: "food, meal, dish" },
    { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", tags: "pizza, italian, food" },
    { url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop", tags: "pancakes, breakfast, food" },
    { url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop", tags: "salad, healthy, food" },
    { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop", tags: "burger, fast food, meal" },
    { url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop", tags: "coffee, drink, beverage" },
    { url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop", tags: "dessert, cake, sweet" },
    { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", tags: "salad, vegetables, healthy" },
    { url: "https://i.pinimg.com/736x/cb/71/90/cb7190237e3098a376a1807a1dcdb48d.jpg", tags: "tomato, vegetables" },
    { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRf9bA9i-nyZgHZWir7DeVD6IR5BJkA0o0_JrBRKhME1DLx6sb3_RGldy_rZiEqoSRtbUdfMfEI--zhCs8j4ZiI_BSbb9KjpsiNk9vLKXd4Q", tags: "meatballs, meat" },
    { url: "https://i.pinimg.com/1200x/33/92/2f/33922fd459606d395b28baa3956cfdb5.jpg", tags: "kachumbari, salad, vegetables" },
    { url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSf4t3OprDUwiqDni0DQoOnn29j3B2KJ7oHHgfs6ckcxj2sYqENKwoe3oJrxNeQe9Tw0uNQhZsYtBJlaClB42r0Xq2zjIMjh4gwz0hYShjmMg", tags: "espresso, coffee" },
    { url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRtI_oV1Fi9wfDWE24cwaOstd9bIw9xD4vcDZcoD77hamL-H1rmZfy3pjJ5LY9TB9zJsThLxaXWt13_4Lj1m-Zdgh1EktcoXXURuzgJ0ImA", tags: "snack, mandazi" },
    { url: "https://cdn1.iconfinder.com/data/icons/restaurant-65/50/Restaurant_Outline-29-512.png", tags: "icon, main course" },
    { url: "https://i.pinimg.com/1200x/d4/af/ae/d4afaea8a8793de367d324501f016638.jpg", tags: "pasta, main course" },
    { url: "https://i.pinimg.com/1200x/40/cd/38/40cd38541bce3ccba80ea8f87409d539.jpg", tags: "beef, main course" },
    { url: "https://i.pinimg.com/1200x/41/8a/4d/418a4dba2668bf8446094fdaf94fe85e.jpg", tags: "chili, main course" },
  ];

  // Filter stock images based on search query
  const filteredStockImages = stockSearchQuery.trim()
    ? allStockImages.filter(img => 
        img.tags.toLowerCase().includes(stockSearchQuery.toLowerCase())
      )
    : allStockImages;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        setSelectedImage(result);
        
        // API Integration Point: POST /api/upload-image
        // Upload the file to your server/storage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setIsGenerating(true);
    
    // API Integration Point: POST /api/generate-image
    // Send aiPrompt to your AI image generation endpoint
    
    // Simulated delay
    setTimeout(() => {
      const img = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop";
      setGeneratedImage(img);
      setSelectedImage(img);
      setIsGenerating(false);
      toast.success("Image generated!");
    }, 2000);
  };

  const handleUpscaleWithAI = () => {
    // API Integration Point: POST /api/upscale-image
    toast.info("AI upscaling feature - integrate with your backend");
  };

  const handleSelect = (imageUrl: string) => {
    if (!imageUrl) {
      toast.error("Please select or upload an image");
      return;
    }
    onSelect(imageUrl);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Choose Image</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 rounded-full"
            >
              ✕
            </Button>
          </div>
        </DialogHeader>

        {/* Image Preview Section */}
        {selectedImage && (
          <div className="p-4 bg-accent/30 rounded-lg border-2 border-primary/20">
            <Label className="text-sm font-semibold mb-2 block">Selected Image Preview</Label>
            <div className="flex items-center gap-4">
              <img 
                src={selectedImage} 
                alt="Selected preview" 
                className="w-32 h-32 object-cover rounded-lg border-2 border-primary"
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-3">This image will be used for your category</p>
                <Button 
                  onClick={() => handleSelect(selectedImage)} 
                  className="w-full"
                  size="sm"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Use This Image
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="generate">Generate AI</TabsTrigger>
            <TabsTrigger value="upscale">Upscale AI</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop or click to upload
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="max-w-xs mx-auto"
              />
            </div>
            
            {uploadedImage && (
              <div className="mt-4">
                <img src={uploadedImage} alt="Uploaded" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search images (e.g., 'pizza', 'coffee', 'dessert')"
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => setStockSearchQuery("")}
                disabled={!stockSearchQuery}
              >
                Clear
              </Button>
            </div>

            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {filteredStockImages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No images found. Try a different search term.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredStockImages.map((img, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                          selectedStock === img.url ? "border-primary ring-2 ring-primary" : "border-transparent"
                        }`}
                        onClick={() => {
                          setSelectedStock(img.url);
                          setSelectedImage(img.url);
                        }}
                      >
                        <img src={img.url} alt={img.tags} className="w-full h-40 object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="Describe the image you want (e.g., 'Delicious pasta with tomato sauce')"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <Button 
                onClick={handleGenerateWithAI} 
                className="w-full"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>
            </div>

            {generatedImage && (
              <div className="mt-4">
                <img src={generatedImage} alt="Generated" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="upscale" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload an image to upscale with AI
              </p>
              <Input
                type="file"
                accept="image/*"
                className="max-w-xs mx-auto"
              />
              <Button onClick={handleUpscaleWithAI} className="mt-4">
                <Sparkles className="mr-2 h-4 w-4" />
                Upscale with AI
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
