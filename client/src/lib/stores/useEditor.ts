import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { EditorState, ToolMode, HistoryEntry } from "../types";

interface EditorStore extends EditorState {
  // History
  history: HistoryEntry[];
  historyIndex: number;
  
  // Actions
  setTool: (tool: ToolMode) => void;
  setSelectedObjects: (ids: string[]) => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  
  // History actions
  addHistoryEntry: (entry: Omit<HistoryEntry, "timestamp">) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useEditor = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    selectedObjects: [],
    tool: "select",
    snapToGrid: true,
    gridSize: 1,
    camera: {
      position: [10, 10, 10],
      target: [0, 0, 0]
    },
    history: [],
    historyIndex: -1,

    // Actions
    setTool: (tool) => set({ tool }),
    
    setSelectedObjects: (ids) => set({ selectedObjects: ids }),
    
    toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
    
    setGridSize: (size) => set({ gridSize: size }),

    // History management
    addHistoryEntry: (entry) => {
      const state = get();
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ ...entry, timestamp: Date.now() });
      
      // Limit history to 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      set({
        history: newHistory,
        historyIndex: newHistory.length - 1
      });
    },

    undo: () => {
      const state = get();
      if (state.historyIndex > 0) {
        set({ historyIndex: state.historyIndex - 1 });
        // Apply the undo operation here
      }
    },

    redo: () => {
      const state = get();
      if (state.historyIndex < state.history.length - 1) {
        set({ historyIndex: state.historyIndex + 1 });
        // Apply the redo operation here
      }
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1
  }))
);
