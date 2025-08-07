'use client'

import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Decal } from '@react-three/drei'
import { easing } from 'maath'
import { getProductConfig } from './config/productConfig'

function ProductModel({ productType, color, decalImage }) {
  const config = getProductConfig(productType)
  const { nodes, materials } = useGLTF(config.modelPath)
  
  useFrame((state, delta) => {
    // Handle multiple materials that should change color
    if (config.colorableMaterials) {
      config.colorableMaterials.forEach(materialName => {
        const material = materials?.[materialName]
        if (material?.color) {
          easing.dampC(material.color, color, 0.25, delta)
        }
      })
    } else {
      // Fallback to single material (backward compatibility)
      const material = materials?.[config.modelNodes.material]
      if (material?.color) {
        easing.dampC(material.color, color, 0.25, delta)
      }
    }
  })
  
  return (
    <group dispose={null}>
      {/* Method 1: Render specific meshes defined in config */}
      {config.meshes ? (
        config.meshes.map((meshConfig, index) => (
          <mesh
            key={index}
            castShadow={meshConfig.castShadow !== false}
            receiveShadow={meshConfig.receiveShadow !== false}
            geometry={nodes?.[meshConfig.geometry]?.geometry}
            material={materials?.[meshConfig.material]}
            material-roughness={meshConfig.roughness || 0.1}
            position={meshConfig.position || [0, 0, 0]}
            rotation={meshConfig.rotation || [0, 0, 0]}
            scale={meshConfig.scale || [1, 1, 1]}
          >
            {/* Only add decal to the main/decal mesh */}
            {decalImage && meshConfig.acceptsDecal && (
              <DecalTexture 
                position={config.decal.position}
                rotation={config.decal.rotation}
                scale={config.decal.scale}
                imageUrl={decalImage}
              />
            )}
          </mesh>
        ))
      ) : (
        // Method 2: Fallback to single mesh (backward compatibility)
        <mesh 
          castShadow 
          geometry={nodes?.[config.modelNodes.geometry]?.geometry} 
          material={materials?.[config.modelNodes.material]} 
          material-roughness={0.1}
        >
          {decalImage && (
            <DecalTexture 
              position={config.decal.position}
              rotation={config.decal.rotation}
              scale={config.decal.scale}
              imageUrl={decalImage}
            />
          )}
        </mesh>
      )}

      {/* Method 3: Auto-render all meshes from model */}
      {config.autoRenderAll && 
        Object.entries(nodes).map(([nodeName, node]) => {
          // Only render mesh nodes that have geometry
          if (!node.geometry) return null
          
          return (
            <mesh
              key={nodeName}
              castShadow
              receiveShadow
              geometry={node.geometry}
              material={node.material}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            >
              {/* Add decal only to specified mesh */}
              {decalImage && nodeName === config.decalMesh && (
                <DecalTexture 
                  position={config.decal.position}
                  rotation={config.decal.rotation}
                  scale={config.decal.scale}
                  imageUrl={decalImage}
                />
              )}
            </mesh>
          )
        })
      }
    </group>
  )
}

function DecalTexture({ position, rotation, scale, imageUrl }) {
  const texture = useTexture(imageUrl)
  
  return (
    <Decal 
      
      position={position} 
      rotation={rotation} 
      scale={scale} 
      map={texture} 
    />
  )
}

// Preload all models
const configs = getProductConfig()
Object.values(configs).forEach(config => {
  if (config?.modelPath) {
    useGLTF.preload(config.modelPath)
  }
})

export default ProductModel