
import { Button } from "./ui/button";
import { useEditor } from "../lib/stores/useEditor";
import { useScene } from "../lib/stores/useScene";
import { SceneObject } from "../lib/types";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

export function MoveToolbar() {
  const { tool, selectedObjects } = useEditor();
  const { updateObject, currentScene } = useScene();

  const handleMove = (axis: 'x' | 'y' | 'z', amount: number) => {
    selectedObjects.forEach((id) => {
      const object = currentScene.objects.find((o) => o.id === id);
      if (object) {
        const newPosition: [number, number, number] = [...object.transform.position];
        if (axis === 'x') newPosition[0] += amount;
        if (axis === 'y') newPosition[1] += amount;
        if (axis === 'z') newPosition[2] += amount;

        // Have to cast to SceneObject because the type of `object` is `SceneObject | undefined`
        updateObject(id, { transform: { ...(object as SceneObject).transform, position: newPosition } });
      }
    });
  };

  if (tool !== 'move' || selectedObjects.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-lg p-2 flex gap-2">
      <Button size="sm" onClick={() => handleMove('x', -1)}>
        <ArrowUp className="h-4 w-4" />
        <span className="ml-2">Forward</span>
      </Button>
      <Button size="sm" onClick={() => handleMove('x', 1)}>
        <ArrowDown className="h-4 w-4" />
        <span className="ml-2">Backward</span>
      </Button>
      <Button size="sm" onClick={() => handleMove('z', 1)}>
        <ArrowLeft className="h-4 w-4" />
        <span className="ml-2">Left</span>
      </Button>
      <Button size="sm" onClick={() => handleMove('z', -1)}>
        <ArrowRight className="h-4 w-4" />
        <span className="ml-2">Right</span>
      </Button>
    </div>
  );
}
