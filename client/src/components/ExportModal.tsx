import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onOpenChange }) => {
  const [resolution, setResolution] = useState("2");
  const [transparentBg, setTransparentBg] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const resolutionOptions = [
    { value: "1", label: "1x (Standard)" },
    { value: "2", label: "2x (High)" },
    { value: "4", label: "4x (Ultra)" },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Get the canvas from the Three.js renderer
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        throw new Error("No canvas found");
      }

      // Create a new canvas with the desired resolution
      const scale = parseInt(resolution);
      const exportCanvas = document.createElement('canvas');
      const ctx = exportCanvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      exportCanvas.width = canvas.width * scale;
      exportCanvas.height = canvas.height * scale;

      // Set background
      if (!transparentBg) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      }

      // Draw the scene
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

      // Convert to blob and download
      exportCanvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Failed to create image blob");
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `room-scene-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("Image exported successfully!");
        onOpenChange(false);
      }, 'image/png');

    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export image");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Scene</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution</Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resolutionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="transparent">Transparent Background</Label>
                <Switch
                  id="transparent"
                  checked={transparentBg}
                  onCheckedChange={setTransparentBg}
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            <p>The image will be exported as a PNG file with the current camera view.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export PNG
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
