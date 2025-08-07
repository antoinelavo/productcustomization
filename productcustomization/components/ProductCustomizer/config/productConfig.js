// @/config/productConfig.js
export const PRODUCT_CONFIGS = {
  tshirt: {
    name: 'T-Shirt',
    modelPath: '/models/shirt_baked_collapsed.glb',

    meshes: [
      {
        geometry: 'T_Shirt_male',        // Your mesh name from GLTF
        material: 'lambert1',            // Your material name from GLTF
        castShadow: true,
        receiveShadow: true,
        roughness: 1,
        acceptsDecal: true,              // This mesh can have decals
        position: [0, 0, 0],            // Optional positioning
        rotation: [0, 0, 0],            // Optional rotation
        scale: [1, 1, 1]                // Optional scaling
      }
      // Add more meshes here if your model has multiple parts:
      // {
      //   geometry: 'Collar',
      //   material: 'collar_material',
      //   acceptsDecal: false
      // }
    ],
    
    colorableMaterials: ['lambert1'],


    decal: {
      position: [0, 0.04, 0.15],
      rotation: [0, 0, 0],
      scale: 0.25
    },
    
    colors: [
      '#ffffff',  // white
      '#ccc',     // light gray
      '#999999',  // dark gray
      '#000000',  // black
      '#EFBD4E',  // yellow
      '#80C670',  // green  
      '#726DE8',  // purple
      '#EF674E',  // red
    ],
    defaultColor: '#ffffff',
    templates: {
      summer: {
        id: 'summer',
        name: 'Summer Vibes',
        image: '/templates/tshirt/summer.png',
        defaultText: {
          topText: 'SUMMER',
          bottomText: 'VIBES',
          leftText: '',
          rightText: '',
          textColor: '#14a1daff',
          fontSize: 'medium'
        }
      },
      travel: {
        id: 'travel',
        name: 'Travel Mode',
        image: '/templates/tshirt/travel.png',
        defaultText: {
          topText: 'ADVENTURE',
          bottomText: 'AWAITS',
          leftText: '',
          rightText: '',
          textColor: '#ff6b35',
          fontSize: 'medium'
        }
      },
      bbosik: {
        id: 'bbosik',
        name: 'BBOSIK Classic',
        image: '/templates/tshirt/bbosik.png',
        defaultText: {
          topText: 'BBOSIK',
          bottomText: '',
          leftText: '',
          rightText: '',
          textColor: '#14a1daff',
          fontSize: 'medium'
        }
      }
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    defaultSize: 'M',
    previewImages: [
      '/preview-images/tshirt/dog1.jpg',
      '/preview-images/tshirt/dog2.jpg',
      '/preview-images/tshirt/dog3.jpg',
    ]
  },

    tumbler: {
    name: 'Tumbler',
    modelPath: '/models/Tumbler.glb',

    meshes: [
        {
        geometry: 'cup_Baked_cup_Baked_0_1',
        material: 'Whole.001',
        castShadow: true,
        receiveShadow: true,
        roughness: 1,
        acceptsDecal: false,
        position: [0.004, -0.352, -0.001],
        rotation: [-Math.PI / 2, 0, 0],  // ✅ Fixed rotation
        scale: [2.915, 2.915, 2.915]
        },
        {
        geometry: 'cup_Baked_cup_Baked_0_2',
        material: 'Printable',
        castShadow: true,
        receiveShadow: true,
        roughness: 1,
        acceptsDecal: true,
        position: [0.004, -0.352, -0.001],
        rotation: [-Math.PI / 2, 0, 0], 
        scale: [2.915, 2.915, 2.915]
        },
        {
        geometry: 'lid_Baked_lid_Baked_0',
        material: 'Whole',  // ✅ Added material property
        castShadow: true,
        receiveShadow: true,
        roughness: 1,
        acceptsDecal: false,
        position: [0.004, 0.277, -0.001],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [2.915, 2.915, 2.915]
        }
    ],
    
    colorableMaterials: ['Whole.001', 'Whole', 'Printable'],  // ✅ Fixed material names

    decal: {
        position: [0, -0.04, 0.14],           // ✅ Keep working position
        rotation: [Math.PI / 2, 0, 0],   // ✅ Keep working decal rotation
        scale: [0.08,0.08,0.08]           // ✅ Fixed scale - much smaller!
    },

    colors: [
        '#FFFDD0',  // silver
        '#000000',  // black
    ],
    defaultColor: '#FFFDD0',
    
    // ... rest of your config
    }
}

// Helper function to get product config
export function getProductConfig(productType) {
  return PRODUCT_CONFIGS[productType] || PRODUCT_CONFIGS.tshirt
}

// Helper function to get template images object
export function getTemplateImages(productType) {
  const config = getProductConfig(productType)
  const templateImages = {}
  
  Object.values(config.templates).forEach(template => {
    templateImages[template.id] = template.image
  })
  
  return templateImages
}