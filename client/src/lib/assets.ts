import { Asset } from "./types";

export const ASSET_CATEGORIES = [
  "room",
  "bed", 
  "table",
  "lamp",
  "rug",
  "frames",
  "plant",
  "window",
  "chair"
] as const;

export const DEFAULT_ASSETS: Asset[] = [
  {
    id: "bed_01",
    name: "Modern Bed",
    thumbnail: "/assets/thumbnails/bed_01.png",
    url: "/assets/models/bed_01.glb",
    category: "bed",
    defaultTransform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  },
  {
    id: "table_01",
    name: "Coffee Table",
    thumbnail: "/assets/thumbnails/table_01.png", 
    url: "/assets/models/table_01.glb",
    category: "table",
    defaultTransform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  },
  {
    id: "lamp_01",
    name: "Table Lamp",
    thumbnail: "/assets/thumbnails/lamp_01.png",
    url: "/assets/models/lamp_01.glb", 
    category: "lamp",
    defaultTransform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  },
  {
    id: "chair_01",
    name: "Office Chair",
    thumbnail: "/assets/thumbnails/chair_01.png",
    url: "/assets/models/chair_01.glb",
    category: "chair",
    defaultTransform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  },
  {
    id: "rug_01",
    name: "Area Rug",
    thumbnail: "/assets/thumbnails/rug_01.png",
    url: "/assets/models/rug_01.glb",
    category: "rug",
    defaultTransform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  },
  {
    id: "plant_01",
    name: "Potted Plant",
    thumbnail: "/assets/thumbnails/plant_01.png",
    url: "/assets/models/plant_01.glb",
    category: "plant",
    defaultTransform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  },
  {
    id: "window_01",
    name: "Window Frame",
    thumbnail: "/assets/thumbnails/window_01.png",
    url: "/assets/models/window_01.glb",
    category: "window",
    defaultTransform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  },
  {
    id: "frame_01",
    name: "Picture Frame",
    thumbnail: "/assets/thumbnails/frame_01.png",
    url: "/assets/models/frame_01.glb",
    category: "frames",
    defaultTransform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  }
];
