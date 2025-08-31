export interface Asset {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
  category: string;
  defaultTransform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
}

export interface SceneObject {
  id: string;
  assetId: string;
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  metadata: {
    tags: string[];
  };
}

export interface Scene {
  id: string;
  name: string;
  objects: SceneObject[];
  createdAt: string;
  updatedAt: string;
}

export type ToolMode = "select" | "move" | "rotate" | "scale" | "delete";

export interface EditorState {
  selectedObjects: string[];
  tool: ToolMode;
  snapToGrid: boolean;
  gridSize: number;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export interface HistoryEntry {
  type: string;
  data: any;
  timestamp: number;
}
