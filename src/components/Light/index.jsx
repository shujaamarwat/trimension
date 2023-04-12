import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

import * as THREE from "three";
import { useThree } from "react-three-fiber";
import { createMesh, diff, material } from "../Utility";
import { useRef } from "react";

function WindowLight({ position, color }) {
  const { scene } = useThree();
  RectAreaLightUniformsLib.init();
  const rectLight = new THREE.RectAreaLight(color, 5, 17, 17);
  rectLight.position.set(position[0], position[1], position[2]);
  rectLight.rotation.x = -Math.PI;
  scene.add(rectLight);
  scene.add(new RectAreaLightHelper(rectLight));
}

function Frame() {
  const meshRef = useRef();
  const position = {x: 5, z: 1, y: -22.5};
  const size = [17, 1, 1];

  const createBox = (args, position, rotation) => (
    createMesh(meshRef, <boxGeometry args={args} />, material.frame, position, rotation)
  );

  return (
    <group>
      {createBox(size, [position.x, position.z, position.y])}
      {createBox(size, [position.x+8, position.z+8, position.y], [0, 0, Math.PI / 2])}
      {createBox(size, [position.x, position.z+16, position.y])}
      {createBox(size, [position.x-8, position.z+8, position.y], [0, 0, Math.PI / 2])}
      {createBox(size, [position.x, position.z+8, position.y])}
      {createBox(size, [position.x, position.z+8, position.y], [0, 0, Math.PI / 2])}
    </group>
  );
}


export const Light = () => {
  return(
    <>
      <ambientLight intensity={0.5} />
      <Frame/>
      {/* <directionalLight intensity={0.5} /> */}
      <WindowLight position={[diff.light, 4 + diff.light, -18-diff.light]} color="0xf4e99b"/>
    </>
  );
};
