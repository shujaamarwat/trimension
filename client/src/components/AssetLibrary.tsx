import React from "react";
import { useAssets } from "@/lib/stores/useAssets";
import { useScene } from "@/lib/stores/useScene";
import { useEditor } from "@/lib/stores/useEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Package } from "lucide-react";
import { ASSET_CATEGORIES } from "@/lib/assets";

const AssetLibrary: React.FC = () => {
  const { 
    searchQuery, 
    selectedCategory, 
    setSearchQuery, 
    setSelectedCategory, 
    getFilteredAssets 
  } = useAssets();
  
  const { addObject } = useScene();
  const { addHistoryEntry } = useEditor();

  const filteredAssets = getFilteredAssets();

  const handleAssetDrop = (assetId: string) => {
    // Add object to scene at origin
    const newObject = {
      assetId,
      transform: {
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: [1, 1, 1] as [number, number, number]
      },
      metadata: {
        tags: []
      }
    };

    addObject(newObject);
    addHistoryEntry({
      type: "ADD_OBJECT",
      data: newObject
    });
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {ASSET_CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-3">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group relative bg-muted rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleAssetDrop(asset.id)}
            >
              <div className="aspect-square bg-background rounded-md mb-2 flex items-center justify-center overflow-hidden">
                <img 
                  src={asset.thumbnail} 
                  alt={asset.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                  }}
                />
              </div>
              <div className="text-sm font-medium truncate">{asset.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{asset.category}</div>
            </div>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No assets found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default AssetLibrary;
