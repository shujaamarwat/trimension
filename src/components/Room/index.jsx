import { useRef } from "react";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Light } from "../Light";
import { material } from "../Utility";

function MainObject(props) {
  const { type } = props;
  const meshRef = useRef();
  const pos = 52;
  const diff = 5;
  const size = [pos, pos, 3];
  switch (type) {
    case "left-wall":
      return (
        <mesh ref={meshRef} position={[0, 0+diff, -20-diff]}>
          <boxGeometry args={size} />
          {material.wall}
        </mesh>
      );
    case "right-wall":
      return (
        <mesh
          ref={meshRef}
          position={[-20-diff, diff, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <boxGeometry args={size} />
          {material.wall}
        </mesh>
      );
    case "floor":
      return (
        <mesh
          ref={meshRef}
          position={[0, -20, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <boxGeometry args={size} />
          <meshStandardMaterial color={0xb38e5d} />
        </mesh>
      );
    default:
      return null;
  }
};


const Surface = () => {
  return(
    <>
      <MainObject type="floor"/>
      <MainObject type="left-wall"/>
      <MainObject type="right-wall"/>
    </>
  )
}
const Camera = () => {
  return(
    <>
      <OrthographicCamera
        makeDefault
        position={[10, 10, 10]}
        zoom={5}
        near={-6}
        far={100}
      />
      <OrbitControls />
    </>
  )
}

const Objects = () => {
  return(
    <group>
      <Surface/>
    </group>
  );
}
const Room = () => {
  return (
    <div className="h-screen bg-midnight">
      <Canvas>
        <Camera/>
        <Light/>
        <Objects/>
      </Canvas>
    </div>
  );
};
export default Room;
