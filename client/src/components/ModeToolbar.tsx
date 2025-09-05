
import { Button } from "./ui/button";
import { useEditor } from "../lib/stores/useEditor";
import { ToolMode } from "../lib/types";

const मोड्स: { name: ToolMode; label: string }[] = [
  { name: "select", label: "Select" },
  { name: "move", label: "Move" },
  { name: "rotate", label: "Rotate" },
  { name: "scale", label: "Scale" },
];

export function ModeToolbar() {
  const { tool, setTool } = useEditor();

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-lg p-2 flex gap-2">
      {मोड्स.map((mode) => (
        <Button
          key={mode.name}
          variant={tool === mode.name ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setTool(mode.name)}
        >
          {mode.label}
        </Button>
      ))}
    </div>
  );
}
