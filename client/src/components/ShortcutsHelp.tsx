import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ open, onOpenChange }) => {
  const shortcuts = [
    {
      category: "Tools",
      items: [
        { key: "Q", description: "Select tool" },
        { key: "W", description: "Move tool" },
        { key: "E", description: "Rotate tool" },
        { key: "R", description: "Scale tool" },
      ]
    },
    {
      category: "Edit",
      items: [
        { key: "Ctrl + Z", description: "Undo" },
        { key: "Ctrl + Y", description: "Redo" },
        { key: "Delete", description: "Delete selected" },
        { key: "Backspace", description: "Delete selected" },
      ]
    },
    {
      category: "View",
      items: [
        { key: "G", description: "Toggle grid snap" },
        { key: "Mouse Wheel", description: "Zoom in/out" },
        { key: "Middle Mouse + Drag", description: "Pan view" },
      ]
    },
    {
      category: "Selection",
      items: [
        { key: "Click", description: "Select object" },
        { key: "Ctrl + Click", description: "Multi-select" },
        { key: "Click Empty", description: "Deselect all" },
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {shortcuts.map((group) => (
            <Card key={group.category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{group.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {group.items.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {shortcut.key}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-sm text-muted-foreground text-center pt-4 border-t">
          <p>Tip: Most actions can also be performed using the toolbar buttons</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsHelp;
