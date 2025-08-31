import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Scene, SceneObject } from "../types";
import { nanoid } from "nanoid";

interface SceneStore {
  currentScene: Scene;
  
  // Actions
  addObject: (object: Omit<SceneObject, "id">) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  clearScene: () => void;
  loadScene: (scene: Scene) => void;
  exportScene: () => Scene;
}

const createEmptyScene = (): Scene => ({
  id: nanoid(),
  name: "Untitled Scene",
  objects: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const useScene = create<SceneStore>()(
  persist(
    (set, get) => ({
      currentScene: createEmptyScene(),

      addObject: (objectData) => {
        const newObject: SceneObject = {
          ...objectData,
          id: nanoid()
        };
        
        set((state) => ({
          currentScene: {
            ...state.currentScene,
            objects: [...state.currentScene.objects, newObject],
            updatedAt: new Date().toISOString()
          }
        }));
      },

      removeObject: (id) => {
        set((state) => ({
          currentScene: {
            ...state.currentScene,
            objects: state.currentScene.objects.filter(obj => obj.id !== id),
            updatedAt: new Date().toISOString()
          }
        }));
      },

      updateObject: (id, updates) => {
        set((state) => ({
          currentScene: {
            ...state.currentScene,
            objects: state.currentScene.objects.map(obj => 
              obj.id === id ? { ...obj, ...updates } : obj
            ),
            updatedAt: new Date().toISOString()
          }
        }));
      },

      clearScene: () => {
        set({ currentScene: createEmptyScene() });
      },

      loadScene: (scene) => {
        set({ currentScene: scene });
      },

      exportScene: () => {
        return get().currentScene;
      }
    }),
    {
      name: "room-editor-scene"
    }
  )
);
