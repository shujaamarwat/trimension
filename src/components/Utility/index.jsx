import { RoundedBox } from "@react-three/drei";

export const material = {
  "wood": <meshStandardMaterial color={0x8b5a2b} />,
  "metal": <meshStandardMaterial color={0x7f7f7f} />,

  // Room
  "wall": <meshStandardMaterial color={0xD8DDE3} />,
  "frame": <meshStandardMaterial color={0xffffff} />,

  // Bed
  "sheet": <meshStandardMaterial color={0x9761c1} />,
  "foam": <meshStandardMaterial color={0xE0A57E} />,
  "cushion": <meshStandardMaterial color={0xDD9363} />,

  // Table
  "desk": <meshStandardMaterial color={0x4f3104} />,
  "leg": <meshStandardMaterial color={0x383838} />,
}

export const diff = {
  "furniture": 5,
  "light": 5,
}

export const createMesh = (ref, geometry, material, position, rotation) => {
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      {geometry}
      {material}
    </mesh>
  );
};

export const createRoundedMesh = (ref, size, material, position, rad, rotation) => {
  if(rad === undefined){
    rad = 0.25
  }
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <RoundedBox args={size} radius={rad}>
        {material}
      </RoundedBox>
    </mesh>
  );
};

