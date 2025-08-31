import { useEffect } from "react";
import { useEditor } from "@/lib/stores/useEditor";
import { useScene } from "@/lib/stores/useScene";

export const useKeyboardShortcuts = () => {
  const { undo, redo, canUndo, canRedo, toggleSnapToGrid, setTool, selectedObjects } = useEditor();
  const { removeObject } = useScene();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default browser shortcuts when appropriate
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
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo, toggleSnapToGrid, setTool, selectedObjects, removeObject]);
};
