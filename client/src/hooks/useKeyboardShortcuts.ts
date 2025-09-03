import { useEffect } from "react";
import { useEditor } from "@/lib/stores/useEditor";
import { useScene } from "@/lib/stores/useScene";
import { SceneObject } from "@/lib/types";

export const useKeyboardShortcuts = () => {
  const { undo, redo, canUndo, canRedo, toggleSnapToGrid, setTool, selectedObjects, tool } = useEditor();
  const { removeObject, updateObject, currentScene } = useScene();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey && canRedo()) {
              redo();
            } else if (canUndo()) {
              undo();
            }
            break;
          case 'y':
            event.preventDefault();
            if (canRedo()) {
              redo();
            }
            break;
        }
      } else {
        switch (event.key.toLowerCase()) {
          case 'delete':
          case 'backspace':
            event.preventDefault();
            selectedObjects.forEach(id => removeObject(id));
            break;
          case 'g':
            event.preventDefault();
            toggleSnapToGrid();
            break;
          case 'q':
            event.preventDefault();
            setTool('select');
            break;
          case 'w':
            event.preventDefault();
            setTool('move');
            break;
          case 'e':
            event.preventDefault();
            setTool('rotate');
            break;
          case 'r':
            event.preventDefault();
            setTool('scale');
            break;
            case 'arrowup':
            case 'arrowdown':
            case 'arrowleft':
            case 'arrowright':
              if (tool === 'move' && selectedObjects.length > 0) {
                event.preventDefault();
                const moveAmount = 0.1;
                let axis: 'x' | 'z';
                let direction: number;

                switch (event.key.toLowerCase()) {
                    case 'arrowup':
                        axis = 'x';
                        direction = -1;
                        break;
                    case 'arrowdown':
                        axis = 'x';
                        direction = 1;
                        break;
                    case 'arrowleft':
                        axis = 'z';
                        direction = 1;
                        break;
                    case 'arrowright':
                        axis = 'z';
                        direction = -1;
                        break;
                    default:
                        return;
                }

                selectedObjects.forEach((id) => {
                    const object = currentScene.objects.find((o) => o.id === id);
                    if (object) {
                        const newPosition: [number, number, number] = [...object.transform.position];
                        if (axis === 'x') newPosition[0] += moveAmount * direction;
                        if (axis === 'z') newPosition[2] += moveAmount * direction;
                        
                        updateObject(id, { transform: { ...object.transform, position: newPosition } });
                    }
                });
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo, toggleSnapToGrid, setTool, selectedObjects, removeObject, tool, updateObject, currentScene]);
};
