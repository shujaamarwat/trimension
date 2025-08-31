import { create } from "zustand";
import { Asset } from "../types";
import { DEFAULT_ASSETS } from "../assets";

interface AssetStore {
  assets: Asset[];
  searchQuery: string;
  selectedCategory: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  getFilteredAssets: () => Asset[];
  addAsset: (asset: Asset) => void;
}

export const useAssets = create<AssetStore>((set, get) => ({
  assets: DEFAULT_ASSETS,
  searchQuery: "",
  selectedCategory: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  getFilteredAssets: () => {
    const { assets, searchQuery, selectedCategory } = get();
    
    return assets.filter((asset) => {
      const matchesSearch = searchQuery === "" || 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === null || 
        asset.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  },

  addAsset: (asset) => set((state) => ({ 
    assets: [...state.assets, asset] 
  }))
}));
