import React, { useState, useRef } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import Scene3D, { Scene3DRef } from "./Scene3D";
import AssetLibrary from "./AssetLibrary";
import ObjectList from "./ObjectList";
import Toolbar from "./Toolbar";
import StatusBar from "./StatusBar";
import AIPanel from "./AIPanel";
import ExportModal from "./ExportModal";
import TextureUploadDialog from "./TextureUploadDialog";
import ShortcutsHelp from "./ShortcutsHelp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ModeToolbar } from "./ModeToolbar";
import { MoveToolbar } from "./MoveToolbar";

const Editor: React.FC = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTextureDialog, setShowTextureDialog] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const scene3DRef = useRef<Scene3DRef>(null);

  useKeyboardShortcuts();

  const handleResetView = () => {
    if (scene3DRef.current) {
      scene3DRef.current.resetCamera();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <Toolbar 
        onExport={() => setShowExportModal(true)}
        onHelp={() => setShowShortcutsHelp(true)}
        onResetView={handleResetView}
      />

      {/* Main Editor Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40} collapsible={true}>
            <div className="h-full border-r border-border bg-card">
              <Tabs defaultValue="assets" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4 m-2">
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="properties">Props</TabsTrigger>
                  <TabsTrigger value="textures">Textures</TabsTrigger>
                  <TabsTrigger value="ai">AI</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-hidden">
                  <TabsContent value="assets" className="h-full m-0">
                    <AssetLibrary />
                  </TabsContent>
                  
                  <TabsContent value="properties" className="h-full m-0">
                    <ObjectList />
                  </TabsContent>
                  
                  <TabsContent value="textures" className="h-full m-0 p-4">
                    <button 
                      onClick={() => setShowTextureDialog(true)}
                      className="w-full p-2 border border-dashed border-border rounded-lg text-sm hover:bg-accent"
                    >
                      Upload Texture
                    </button>
                  </TabsContent>
                  
                  <TabsContent value="ai" className="h-full m-0">
                    <AIPanel />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Main Canvas Area */}
          <ResizablePanel defaultSize={75}>
            <div className="h-full flex flex-col relative">
              <div className="flex-1">
                <Scene3D ref={scene3DRef} />
              </div>
              <ModeToolbar />
              <MoveToolbar />
              <StatusBar />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Modals */}
      <ExportModal 
        open={showExportModal} 
        onOpenChange={setShowExportModal} 
      />
      
      <TextureUploadDialog 
        open={showTextureDialog} 
        onOpenChange={setShowTextureDialog} 
      />
      
      <ShortcutsHelp 
        open={showShortcutsHelp} 
        onOpenChange={setShowShortcutsHelp} 
      />
    </div>
  );
};

export default Editor;
