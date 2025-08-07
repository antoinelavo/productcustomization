import React, { useRef } from 'react'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'

function TransparentBackdrop() {
  const shadows = useRef()
  
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={5}
      resolution={2048}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
      opacity={0.99} // Adjust shadow opacity as needed (0.6 = 60% opacity)
    >
      <RandomizedLight amount={4} radius={9} intensity={0.55 * Math.PI} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25 * Math.PI} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

export default TransparentBackdrop