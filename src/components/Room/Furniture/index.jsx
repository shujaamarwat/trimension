import { useRef } from "react";
import { createMesh, createRoundedMesh, diff, material } from "../../Utility";

function Bed() {
  // create bed
  const meshRef = useRef();

  const position = {x: -15-diff.furniture, z: -15, y: 16+diff.furniture}

  return (
    <group>
      {/* Top */}
      {createMesh(meshRef, <boxGeometry args={[6, 3, 10]} />, material.foam, [position.x, position.z, position.y])}
      {createRoundedMesh(meshRef, [4, 1, 6], material.cushion, [position.x, position.z+2, position.y])}
      {createMesh(meshRef, <boxGeometry args={[24, 3, 10]} />, material.sheet, [position.x+15, position.z, position.y])}
      {/* Bottom */}
      {createRoundedMesh(meshRef, [30, 2, 10], material.wood,[position.x+12, position.z-2.5, position.y])}
    </group>
  );
}

function Chair() {
  // create chair
  const position = {x: -8-diff.furniture, z: -17.5, y: -5-diff.furniture}

  const meshRef = useRef();
  const wheels = [
    [position.x, 4.5],
    [position.x-4.5, 0],
    [position.x, -4.5],
    [position.x+4.5, 0],
  ];

  const geometry = <cylinderGeometry args={[0.6, 0.6, 0.5]}/>;
  const createWheelMesh = (position, i) => {
    let rotation = [Math.PI / 2, 0, 0]

    if (i % 2 === 0) {
      rotation[2] = Math.PI / 2;
    }
    return createMesh(meshRef, geometry, material.metal, position, rotation);

  };



  return (
    <group>
      {/* Seat */}
      {createRoundedMesh(meshRef, [8, 1, 8], material.wood, [position.x, position.z+7, position.y])}
      {/* Back */}
      {createRoundedMesh(meshRef, [1, 8, 8], material.wood, [position.x+3.5, position.z+13, position.y])}
      {createRoundedMesh(meshRef, [0.5, 3, 1], material.metal, [position.x+3.5, position.z+8, position.y])}

      {/* Leg Support */}
      {createMesh(meshRef, <cylinderGeometry args={[0.5, 0.5, 7]} />, material.metal, [position.x, position.z+3.5, position.y])}
      {/* Legs */}
      {createRoundedMesh(meshRef, [10, 0.5, 1], material.metal, Object.values(position), 0.25)}
      {createRoundedMesh(meshRef, [1, 0.5, 10], material.metal, Object.values(position), 0.25)}
      {/* Wheels */}
      {
        wheels.map((wheel, i) => {
          return createWheelMesh([wheel[0], position.z-0.5, position.y + wheel[1]], i)
        })
      }
    </group>
  );

}

function Desk() {
  // create desk
  const position = {x: -12-diff.furniture, z: -13, y: 6-diff.furniture}
  const meshRef = useRef();
  const size = {"bottom": [8, 0.5, 1.5], "legs":[1, 11, 1]}
  return (
    <group>
      {createMesh(meshRef, <boxGeometry args={[10, 1, 27]} />,  material.desk, [position.x, position.z + 6, position.y -10])}
      {/* Legs */}
      {createMesh(meshRef, <boxGeometry args={size.legs} />, material.leg, [position.x, position.z,  position.y ])}
      {createMesh(meshRef, <boxGeometry args={size.legs} />, material.leg, [position.x, position.z, position.y - 20])}
      {/* Bottom */}
      {createRoundedMesh(meshRef, size.bottom, material.leg, [position.x, position.z-5.2, position.y ], 0.25)}
      {createRoundedMesh(meshRef, size.bottom, material.leg, [position.x, position.z-5.2, position.y-20 ], 0.25)}

    </group>
  );
}

export function Furniture() {
  return(
    <group>
      <Bed />
      <Chair />
      <Desk />
    </group>
  )
}
