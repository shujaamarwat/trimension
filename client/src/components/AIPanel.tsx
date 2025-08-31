import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScene } from "@/lib/stores/useScene";
import { useEditor } from "@/lib/stores/useEditor";
import { Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AIPanel: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { addObject, clearScene } = useScene();
  const { addHistoryEntry } = useEditor();

  const handleGenerateScene = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/ai/scene-from-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate scene");
      }

      const { scene } = await response.json();
      
      // Clear current scene and add new objects
      clearScene();
      
      scene.objects.forEach((obj: any) => {
        addObject({
          assetId: obj.assetId,
          transform: obj.transform,
          metadata: obj.metadata || { tags: [] }
        });
      });

      addHistoryEntry({
        type: "AI_GENERATE_SCENE",
        data: { prompt, scene }
      });

      toast.success("Scene generated successfully!");
      setPrompt("");
      
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate scene. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Scene Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Describe your room:
            </label>
            <Textarea
              placeholder="A cozy bedroom with a bed, nightstand, lamp, and some plants..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <Button 
            onClick={handleGenerateScene}
            disabled={true}
            className="w-full opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Scene
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground">
            <p className="mb-2 text-orange-600">AI Scene Generation is currently disabled.</p>
            <p>This feature requires an OpenAI API key to be configured. You can still:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Drag and drop furniture from the Assets panel</li>
              <li>Use transform tools to arrange objects</li>
              <li>Export your scene as PNG</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPanel;
