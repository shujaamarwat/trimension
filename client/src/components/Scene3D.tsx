import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useScene } from "@/lib/stores/useScene";
import { useEditor } from "@/lib/stores/useEditor";
import { useAssets } from "@/lib/stores/useAssets";
import DebugPanel from "./DebugPanel";

// Component for rendering individual scene objects
const SceneObjectRenderer: React.FC<{ object: any }> = ({ object }) => {
  const { assets } = useAssets();
  const { selectedObjects, tool } = useEditor();
  const asset = assets.find(a => a.id === object.assetId);
  
  if (!asset) return null;

  const isSelected = selectedObjects.includes(object.id);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    
    console.log('🟡 OBJECT POINTER DOWN:', {
      objectId: object.id,
      isSelected,
      tool,
      canMove: tool === 'move' && isSelected
    });
    
    // If in move tool and object is selected, start dragging
    if (tool === 'move' && isSelected) {
      // Set the dragging object in the parent component
      event.nativeEvent.stopPropagation();
    }
  };

  try {
    const { scene } = useGLTF(asset.url);
    const clonedScene = scene.clone();
    
    return (
      <group
        position={object.transform.position}
        rotation={object.transform.rotation}
        scale={object.transform.scale}
        userData={{ objectId: object.id }}
        onPointerDown={handlePointerDown}
      >
        <primitive object={clonedScene} />
        {isSelected && (
          <>
            <mesh>
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshBasicMaterial color="yellow" wireframe />
            </mesh>
            {tool === 'move' && (
              <mesh>
                <boxGeometry args={[1.3, 1.3, 1.3]} />
                <meshBasicMaterial color="red" wireframe opacity={0.5} transparent />
              </mesh>
            )}
          </>
        )}
      </group>
    );
  } catch (error) {
    // Fallback to a simple box if model fails to load
    return (
      <group
        position={object.transform.position}
        rotation={object.transform.rotation}
        scale={object.transform.scale}
        userData={{ objectId: object.id }}
        onPointerDown={handlePointerDown}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={isSelected ? "#ffaa00" : "#888888"} />
        </mesh>
        {isSelected && (
          <>
            <mesh>
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshBasicMaterial color="yellow" wireframe />
            </mesh>
            {tool === 'move' && (
              <mesh>
                <boxGeometry args={[1.3, 1.3, 1.3]} />
                <meshBasicMaterial color="red" wireframe opacity={0.5} transparent />
              </mesh>
            )}
          </>
        )}
      </group>
    );
  }
};

// Isometric camera setup component
const IsometricCamera: React.FC = () => {
  const { camera, gl, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      const distance = 20; // Closer for a tighter room view
      const angle = Math.PI / 4;
      const heightAngle = Math.atan(1 / Math.sqrt(2));

      camera.position.set(
        distance * Math.sin(angle),
        distance * Math.sin(heightAngle),
        distance * Math.cos(angle)
      );
      camera.lookAt(0, 0, 0);

      const aspect = size.width / size.height;
      const viewSize = 10; // Zoom in to fit the 20x20 grid
      camera.left = -viewSize * aspect;
      camera.right = viewSize * aspect;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.near = 0.1;
      camera.far = 1000;
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  return null;
};

// Grid and snapping component
const GridAndSnap: React.FC = () => {
  const { snapToGrid, gridSize } = useEditor();
  
  if (!snapToGrid) return null;

  // Grid size of 20 with 40 divisions for 0.5 unit increments
  return (
    <primitive 
      object={new THREE.GridHelper(20, 40, "#888888", "#444444")} 
      position={[0, 0, 0]}
    />
  );
};

// Ground plane for drag interactions
const GroundPlane: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} visible={false}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

export interface Scene3DRef {
  resetCamera: () => void;
}

// Main 3D Scene component
const Scene3D = forwardRef<Scene3DRef, {}>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentScene, updateObject } = useScene();
  const { selectedObjects, setSelectedObjects, tool, snapToGrid, gridSize } = useEditor();
  const [draggingObject, setDraggingObject] = useState<string | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState<THREE.Vector3 | null>(null);
  const controlsRef = useRef<any>(null);
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    position: null as [number, number, number] | null,
    objectId: null as string | null,
    isDragging: false,
    lastEvent: 'None'
  });

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
    }
  }));

  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    
    console.log('🔵 CLICK EVENT:', {
      object: event.object,
      objectId: event.object?.userData?.objectId,
      point: event.point,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey
    });
    
    setDebugInfo(prev => ({
      ...prev,
      lastEvent: 'Click',
      position: event.point ? [event.point.x, event.point.y, event.point.z] : null,
      objectId: event.object?.userData?.objectId || null
    }));
    
    if (event.object && event.object.userData?.objectId) {
      const objectId = event.object.userData.objectId;
      
      if (event.ctrlKey || event.metaKey) {
        // Multi-select
        if (selectedObjects.includes(objectId)) {
          setSelectedObjects(selectedObjects.filter(id => id !== objectId));
        } else {
          setSelectedObjects([...selectedObjects, objectId]);
        }
      } else {
        // Single select
        setSelectedObjects([objectId]);
      }
    } else {
      // Clicked on empty space
      setSelectedObjects([]);
    }
  };

  const handlePointerDown = (event: any) => {
    console.log('🟡 POINTER DOWN:', {
      object: event.object,
      objectId: event.object?.userData?.objectId,
      point: event.point,
      tool,
      selectedObjects,
      isSelected: event.object?.userData?.objectId ? selectedObjects.includes(event.object.userData.objectId) : false
    });
    
    setDebugInfo(prev => ({
      ...prev,
      lastEvent: 'Pointer Down',
      position: event.point ? [event.point.x, event.point.y, event.point.z] : null,
      objectId: event.object?.userData?.objectId || null
    }));
    
    if (event.object && event.object.userData?.objectId) {
      const objectId = event.object.userData.objectId;
      const isSelected = selectedObjects.includes(objectId);
      
      if (tool === 'move' && isSelected) {
        console.log('🟢 STARTING DRAG for object:', objectId);
        setDraggingObject(objectId);
        setDragStartPosition(event.point.clone());
        setDebugInfo(prev => ({ ...prev, isDragging: true }));
        event.stopPropagation();
      }
    }
  };

  const handlePointerMove = (event: any) => {
    if (draggingObject && tool === 'move') {
      const point = event.point;
      if (point) {
        const snappedX = snapToGridValue(point.x);
        const snappedY = snapToGridValue(point.y);
        const snappedZ = snapToGridValue(point.z);
        
        console.log('🔴 DRAGGING:', {
          draggingObject,
          originalPoint: [point.x, point.y, point.z],
          snappedPoint: [snappedX, snappedY, snappedZ],
          snapToGrid,
          gridSize
        });
        
        updateObject(draggingObject, {
          transform: {
            ...currentScene.objects.find(obj => obj.id === draggingObject)?.transform,
            position: [snappedX, snappedY, snappedZ]
          }
        });
        
        setDebugInfo(prev => ({
          ...prev,
          lastEvent: 'Dragging',
          position: [snappedX, snappedY, snappedZ]
        }));
      }
    } else {
      // Update debug info even when not dragging
      setDebugInfo(prev => ({
        ...prev,
        lastEvent: 'Pointer Move',
        position: event.point ? [event.point.x, event.point.y, event.point.z] : null,
        objectId: event.object?.userData?.objectId || null
      }));
    }
  };

  const handlePointerUp = (event: any) => {
    console.log('🟣 POINTER UP:', { draggingObject });
    
    if (draggingObject) {
      console.log('🔵 ENDING DRAG for object:', draggingObject);
      setDraggingObject(null);
      setDragStartPosition(null);
      setDebugInfo(prev => ({ ...prev, isDragging: false, lastEvent: 'Pointer Up' }));
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Debug Panel */}
      <DebugPanel pointerInfo={debugInfo} />
      
      <Canvas
        ref={canvasRef}
        camera={{
          position: [10, 10, 10],
          near: 0.1,
          far: 1000
        }}
        orthographic
        gl={{ 
          antialias: true,
          preserveDrawingBuffer: true
        }}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <IsometricCamera />
        
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <GridAndSnap />

        <GroundPlane />

        {currentScene.objects.map((object) => (
          <SceneObjectRenderer key={object.id} object={object} />
        ))}

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          enabled={!draggingObject}
          maxZoom={100}
          minZoom={0.1}
        />
      </Canvas>
    </div>
  );
});

export default Scene3D;
