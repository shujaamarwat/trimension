import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEditor } from "@/lib/stores/useEditor";
import {
  MousePointer,
  Move,
  RotateCw,
  Scale,
  Trash2,
  Undo,
  Redo,
  Grid3X3,
  Download,
  HelpCircle,
  Save
} from "lucide-react";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

interface ToolbarProps {
  onExport: () => void;
  onHelp: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onExport, onHelp }) => {
  const { 
    tool, 
    setTool, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    snapToGrid, 
    toggleSnapToGrid 
  } = useEditor();

  const tools = [
    { id: "select", icon: MousePointer, label: "Select (Q)" },
    { id: "move", icon: Move, label: "Move (W)" },
    { id: "rotate", icon: RotateCw, label: "Rotate (E)" },
    { id: "scale", icon: Scale, label: "Scale (R)" },
    { id: "delete", icon: Trash2, label: "Delete" }
  ] as const;

  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-card">
      <div className="flex items-center space-x-2">
        {/* Tool Selection */}
        <div className="flex items-center space-x-1">
          {tools.map((toolItem) => (
            <Button
              key={toolItem.id}
              variant={tool === toolItem.id ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                console.log(`Tool selected: ${toolItem.id}`);
                setTool(toolItem.id as any);
              }}
              title={toolItem.label}
            >
              <toolItem.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* History */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Grid */}
        <Button
          variant={snapToGrid ? "default" : "ghost"}
          size="sm"
          onClick={toggleSnapToGrid}
          title="Toggle Grid Snap (G)"
        >
          <Grid3X3 className="h-4 w-4" />
          {snapToGrid && <Badge className="ml-1 text-xs">ON</Badge>}
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" title="Save Project">
          <Save className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onExport} title="Export PNG">
          <Download className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onHelp} title="Keyboard Shortcuts">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default Toolbar;
