import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useScene } from "@/lib/stores/useScene";
import { useEditor } from "@/lib/stores/useEditor";
import { useAssets } from "@/lib/stores/useAssets";

// Component for rendering individual scene objects
const SceneObjectRenderer: React.FC<{ object: any }> = ({ object }) => {
  const { assets } = useAssets();
  const { selectedObjects, tool } = useEditor();
  const { updateObject } = useScene();
  const asset = assets.find(a => a.id === object.assetId);
  const [isDragging, setIsDragging] = useState(false);
  
  if (!asset) return null;

  const isSelected = selectedObjects.includes(object.id);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (tool === 'move' && isSelected) {
      event.stopPropagation();
      setIsDragging(true);
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging && tool === 'move') {
      event.stopPropagation();
      
      // Get intersection point
      const point = event.point;
      updateObject(object.id, {
        transform: {
          ...object.transform,
          position: [point.x, point.y, point.z]
        }
      });
    }
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      event.stopPropagation();
      setIsDragging(false);
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
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <primitive object={clonedScene} />
        {isSelected && (
          <mesh>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshBasicMaterial color="yellow" wireframe />
          </mesh>
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
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={isSelected ? "#ffaa00" : "#888888"} />
        </mesh>
        {isSelected && (
          <mesh>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshBasicMaterial color="yellow" wireframe />
          </mesh>
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
      // Set isometric angles (30° and 45°)
      const distance = 50;
      const isoX = Math.cos(Math.PI / 6) * Math.cos(Math.PI / 4) * distance; // 30° * 45°
      const isoY = Math.sin(Math.PI / 6) * distance; // 30°
      const isoZ = Math.cos(Math.PI / 6) * Math.sin(Math.PI / 4) * distance; // 30° * 45°

      camera.position.set(isoX, isoY, isoZ);
      camera.lookAt(0, 0, 0);

      // Set orthographic camera properties
      const aspect = size.width / size.height;
      const viewSize = 20;
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

  return (
    <primitive 
      object={new THREE.GridHelper(20, 20, "#888888", "#444444")} 
      position={[0, 0, 0]}
    />
  );
};

// Ground plane for drag interactions
const GroundPlane: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} visible={false}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial />
    </mesh>
  );
};

// Main 3D Scene component
const Scene3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentScene } = useScene();
  const { selectedObjects, setSelectedObjects } = useEditor();

  const handleClick = (event: any) => {
    event.stopPropagation();
    
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

  return (
    <div className="w-full h-full">
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
          preserveDrawingBuffer: true // For PNG export
        }}
        onClick={handleClick}
      >
        <IsometricCamera />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Grid */}
        <GridAndSnap />

        {/* Ground plane for interactions */}
        <GroundPlane />

        {/* Scene Objects */}
        {currentScene.objects.map((object) => (
          <SceneObjectRenderer key={object.id} object={object} />
        ))}

        {/* Controls */}
        <OrbitControls
          enableRotate={false} // Lock rotation for isometric view
          enableZoom={true}
          enablePan={true}
          maxZoom={100}
          minZoom={0.1}
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;
