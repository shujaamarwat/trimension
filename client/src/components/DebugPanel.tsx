import React from "react";
import { useEditor } from "@/lib/stores/useEditor";
import { useScene } from "@/lib/stores/useScene";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DebugPanelProps {
  pointerInfo?: {
    position: [number, number, number] | null;
    objectId: string | null;
    isDragging: boolean;
    lastEvent: string;
  };
}

const DebugPanel: React.FC<DebugPanelProps> = ({ pointerInfo }) => {
  const { 
    selectedObjects, 
    tool, 
    snapToGrid, 
    gridSize,
    history,
    historyIndex 
  } = useEditor();
  
  const { currentScene } = useScene();

  const selectedObject = currentScene.objects.find(obj => 
    selectedObjects.includes(obj.id)
  );

  return (
    <div className="fixed top-4 right-4 w-80 max-h-[80vh] z-50">
      <ScrollArea className="h-full">
        <Card className="bg-background/95 backdrop-blur border-2 border-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              🐛 Debug Panel
              <Badge variant="destructive" className="text-xs">DEBUG</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            
            {/* Editor State */}
            <div>
              <h4 className="font-semibold text-yellow-600 mb-2">Editor State</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Current Tool:</span>
                  <Badge variant={tool === 'move' ? 'default' : 'secondary'}>
                    {tool}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Snap to Grid:</span>
                  <Badge variant={snapToGrid ? 'default' : 'secondary'}>
                    {snapToGrid ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Grid Size:</span>
                  <span className="font-mono">{gridSize}</span>
                </div>
              </div>
            </div>

            {/* Selection Info */}
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Selection</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Selected Count:</span>
                  <Badge variant="outline">{selectedObjects.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Selected IDs:</span>
                  <span className="font-mono text-xs">
                    {selectedObjects.length > 0 ? selectedObjects.join(', ') : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Object Details */}
            {selectedObject && (
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Selected Object</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-mono text-xs">{selectedObject.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Asset ID:</span>
                    <span className="font-mono text-xs">{selectedObject.assetId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="font-mono text-xs">
                      [{selectedObject.transform.position.map(p => p.toFixed(2)).join(', ')}]
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rotation:</span>
                    <span className="font-mono text-xs">
                      [{selectedObject.transform.rotation.map(r => r.toFixed(2)).join(', ')}]
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scale:</span>
                    <span className="font-mono text-xs">
                      [{selectedObject.transform.scale.map(s => s.toFixed(2)).join(', ')}]
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Pointer Info */}
            {pointerInfo && (
              <div>
                <h4 className="font-semibold text-purple-600 mb-2">Pointer Events</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Last Event:</span>
                    <Badge variant="outline">{pointerInfo.lastEvent}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Is Dragging:</span>
                    <Badge variant={pointerInfo.isDragging ? 'destructive' : 'secondary'}>
                      {pointerInfo.isDragging ? 'YES' : 'NO'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Hovered Object:</span>
                    <span className="font-mono text-xs">
                      {pointerInfo.objectId || 'None'}
                    </span>
                  </div>
                  {pointerInfo.position && (
                    <div className="flex justify-between">
                      <span>Pointer Position:</span>
                      <span className="font-mono text-xs">
                        [{pointerInfo.position.map(p => p.toFixed(2)).join(', ')}]
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scene Info */}
            <div>
              <h4 className="font-semibold text-orange-600 mb-2">Scene</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Total Objects:</span>
                  <Badge variant="outline">{currentScene.objects.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>History Entries:</span>
                  <span className="font-mono">{history.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>History Index:</span>
                  <span className="font-mono">{historyIndex}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="font-semibold text-gray-600 mb-2">Instructions</h4>
              <div className="text-xs space-y-1">
                <div>1. Click object to select</div>
                <div>2. Press W for move tool</div>
                <div>3. Click & drag to move</div>
                <div>4. Press G to toggle grid</div>
              </div>
            </div>

          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
};

export default DebugPanel;
