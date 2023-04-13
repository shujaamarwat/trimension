import { useRef } from "react";
import { createMesh, createRoundedMesh, diff, material } from "../../Utility";

import { useLoader } from "react-three-fiber";
import * as THREE from "three";

import keyboard from '../../../media/keyboard.jpg'

function Mouse() {

  const meshRef = useRef();
  const position = {x: -10-diff.furniture, z: -6.4, y: diff.furniture-18}

  // const geometry = <cylinderGeometry args={[0.4, 0.5, 1]} />
  const size = [1.5, 0.5, 1];
  return (
    <>
      {/* {createMesh(meshRef, geometry, material.wall, Object.values(position))} */}
      {createRoundedMesh(meshRef, size , material.wall, Object.values(position))}

    </>
  );
}

function Keyboard() {
  const texture = useLoader(THREE.TextureLoader, keyboard)

  const meshRef = useRef();
  const position = {x: -10-diff.furniture, z: -6.4, y: diff.furniture-14}

  const geometry = <boxGeometry attach="geometry" args={[4.5, 2, 0.1]}/>
  const material = <meshBasicMaterial attach="material" map={texture} />
  const rotation = [Math.PI/2, 0, Math.PI/2];
  return (
    <>
      {createMesh(meshRef, geometry, material, Object.values(position), rotation)}
    </>
  );
}



function Monitor() {
  // create desk
  const position = {x: -14-diff.furniture, z: -5, y: diff.furniture-14}
  const meshRef = useRef();
  return (
    <group>
      {createMesh(meshRef, <boxGeometry args={[2, 0.2, 1.2]} />, material.wall, [position.x+1, position.z-1.5,  position.y ])}
      {createMesh(meshRef, <boxGeometry args={[0.2, 3, 1]} />, material.wall, [position.x, position.z, position.y ])}
      {createRoundedMesh(meshRef, [0.5, 6, 10], material.wall, [position.x, position.z+2.5, position.y ])}
      {createRoundedMesh(meshRef, [0.5, 6, 10], material.leg, [position.x+0.01, position.z+2.9, position.y ])}

    </group>
  );
}
export const Electronics = () => {
  return(
    <group>
      <Monitor/>
      <Keyboard/>
      <Mouse/>
    </group>
  );
}
