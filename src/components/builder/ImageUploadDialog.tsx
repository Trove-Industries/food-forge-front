import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Wand2, Image as ImageIcon, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Stock image examples (in real app, these would come from an API)
  const stockImages = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        
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
      setGeneratedImage("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop");
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
          <DialogTitle>Choose Image</DialogTitle>
        </DialogHeader>

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
              <div className="space-y-3">
                <img src={uploadedImage} alt="Uploaded" className="w-full h-48 object-cover rounded-lg" />
                <Button onClick={() => handleSelect(uploadedImage)} className="w-full">
                  Use This Image
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {stockImages.map((url, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    selectedStock === url ? "border-primary ring-2 ring-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedStock(url)}
                >
                  <img src={url} alt={`Stock ${index + 1}`} className="w-full h-40 object-cover" />
                </div>
              ))}
            </div>
            
            {selectedStock && (
              <Button onClick={() => handleSelect(selectedStock)} className="w-full">
                Use Selected Image
              </Button>
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
              <div className="space-y-3">
                <img src={generatedImage} alt="Generated" className="w-full h-48 object-cover rounded-lg" />
                <Button onClick={() => handleSelect(generatedImage)} className="w-full">
                  Use This Image
                </Button>
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
