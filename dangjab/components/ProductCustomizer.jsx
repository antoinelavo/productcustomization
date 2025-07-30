// @/components/ProductCustomizer.jsx
'use client'

import React, { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center } from '@react-three/drei'
import { easing } from 'maath'
import { motion } from 'framer-motion'
import PreviewImages from '@/components/PreviewImages'
import TextCustomizer from '@/components/TextCustomizer'
import TemplateSelector from '@/components/TemplateSelector'
import { useCompositeImage } from '@/components/ImageTextCompositor'
import { usePSDGenerator } from '@/components/PSDGenerator'
import { writePsd } from 'ag-psd'

import { 
  Upload, 
  ArrowLeft, 
  Download, 
  Palette,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  ShoppingCart,
  Info,
  Type,
  Image as ImageIcon
} from 'lucide-react'

const COLORS = [
  '#ffffff',  // white
  '#ccc',     // light gray
  '#999999',  // dark gray
  '#000000',  // black
  '#EFBD4E',  // yellow
  '#80C670',  // green  
  '#726DE8',  // purple
  '#EF674E',  // red
]

const TEMPLATE_IMAGES = {
  summer: '/templates/summer.png',
  travel: '/templates/travel.png'
}

export default function ProductCustomizer({ product }) {
  const [state, setState] = useState({
    selectedColor: '#ffffff',
    uploadedImage: null,
    selectedTemplate: null, // null, 'summer', 'travel'
    selectedSize: 'M',
    textSettings: {
      topText: '',
      bottomText: '',
      leftText: '',
      rightText: '',
      textColor: '#8B4513',
      fontSize: 'medium'
    }
  })
  
  const fileInputRef = useRef(null)
  const { generatePSD } = usePSDGenerator()

  // Get the current image to display (template or uploaded)
  const getCurrentImage = () => {
    if (state.selectedTemplate) {
      return TEMPLATE_IMAGES[state.selectedTemplate]
    }
    return state.uploadedImage
  }

  // Generate composite image with text overlay
  const { compositeImage, isGenerating, CompositorComponent } = useCompositeImage(getCurrentImage(), state.textSettings)

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setState(prev => ({ ...prev, uploadedImage: e.target?.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePreviewSelect = (imageUrl) => {
    setState(prev => ({ ...prev, uploadedImage: imageUrl }))
  }

  const handleTemplateSelect = (templateId) => {
    setState(prev => {
      let newTextSettings = { ...prev.textSettings }
      
      if (templateId === null) {
        // Going back to basic mode - clear all text
        newTextSettings = {
          topText: '',
          bottomText: '',
          leftText: '',
          rightText: '',
          textColor: '#8B4513',
          fontSize: 'medium'
        }
      } else {
        // Template selected - set default text and clear others
        newTextSettings = {
          topText: 'BBOSIK',
          bottomText: '',
          leftText: '',
          rightText: '',
          textColor: '#14a1daff',
          fontSize: 'medium'
        }
      }
      
      return {
        ...prev,
        selectedTemplate: templateId,
        textSettings: newTextSettings
      }
    })
  }

  const handleTextChange = (newTextSettings) => {
    setState(prev => ({ ...prev, textSettings: newTextSettings }))
  }

  const downloadDesign = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.setAttribute('download', 'custom-tshirt-design.png')
      link.setAttribute('href', canvas.toDataURL('image/png'))
      link.click()
    }
  }

const handleDownloadPSD = async () => {
  const currentImage = getCurrentImage()
  if (!currentImage) {
    alert('Please upload an image or select a template first!')
    return
  }

  alert('Generating PSD file... This may take a moment!')
  
  try {
    await downloadRealPSD()
    alert('PSD file downloaded successfully!')
  } catch (error) {
    console.error('PSD generation failed:', error)
    alert('Failed to generate PSD. Please try again.')
  }
}

const downloadRealPSD = async () => {
  // DEBUG: Let's first verify the text is being captured
  console.log('=== PSD Generation Debug ===')
  console.log('Top Text:', state.textSettings.topText)
  console.log('Bottom Text:', state.textSettings.bottomText)
  console.log('Left Text:', state.textSettings.leftText)
  console.log('Right Text:', state.textSettings.rightText)
  console.log('Text Color:', state.textSettings.textColor)
  console.log('Font Size:', state.textSettings.fontSize)
  console.log('Selected Template:', state.selectedTemplate)
  console.log('Current Image:', getCurrentImage())
  console.log('===============================')

  const fontSizeMap = {
    small: 18,
    medium: 24, 
    large: 30,
    xl: 36
  }

  const baseFontSize = fontSizeMap[state.textSettings.fontSize] || 24
  const textColor = hexToRgb(state.textSettings.textColor || '#8B4513')

  // Helper function to convert hex to RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 255
    } : { r: 139, g: 69, b: 19, a: 255 }
  }

  // Helper function to create properly sized text canvas (RASTERIZED - GUARANTEED TO WORK)
  const createTextCanvas = (text, fontSize, color, alignment = 'center') => {
    // Create temporary canvas to measure text
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    tempCtx.font = `bold ${fontSize}px Arial`
    
    const metrics = tempCtx.measureText(text)
    const textWidth = Math.ceil(metrics.width) + 80 // Extra padding
    const textHeight = Math.ceil(fontSize * 1.5) + 40 // Extra padding
    
    // Create properly sized canvas
    const canvas = document.createElement('canvas')
    canvas.width = textWidth
    canvas.height = textHeight
    const ctx = canvas.getContext('2d')
    
    // Clear background (transparent)
    ctx.clearRect(0, 0, textWidth, textHeight)
    
    // Set text properties
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textBaseline = 'middle'
    
    // Set alignment
    if (alignment === 'center') {
      ctx.textAlign = 'center'
      ctx.fillText(text, textWidth / 2, textHeight / 2)
    } else if (alignment === 'left') {
      ctx.textAlign = 'left'
      ctx.fillText(text, 40, textHeight / 2)
    } else if (alignment === 'right') {
      ctx.textAlign = 'right'
      ctx.fillText(text, textWidth - 40, textHeight / 2)
    }
    
    return { canvas, width: textWidth, height: textHeight }
  }

  // Helper function to create image canvas
  const createImageCanvas = async (imageUrl, width, height) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas)
      }
      img.src = imageUrl
    })
  }

  // Create the PSD structure
  const psd = {
    width: 1400,
    height: 1400,
    channels: 3,
    bitsPerChannel: 8,
    colorMode: 3,
    children: []
  }

  // Layer 1: Main Image (bottom layer)
  const currentImage = getCurrentImage()
  if (currentImage) {
    const imageCanvas = await createImageCanvas(currentImage, 800, 800)
    psd.children.push({
      name: state.selectedTemplate ? `Template - ${state.selectedTemplate}` : 'Main Image',
      left: 0,
      top: 0,
      right: 1400,
      bottom: 1400,
      canvas: imageCanvas,
      blendMode: 'normal',
      opacity: 255
    })
  }

  // Layer 2: Top Text (RASTERIZED BUT POSITIONED CORRECTLY)
  if (state.textSettings.topText && state.textSettings.topText.trim()) {
    const topTextSize = baseFontSize * 13
    const { canvas, width, height } = createTextCanvas(
      state.textSettings.topText.toUpperCase(), 
      topTextSize, 
      textColor,
      'center'
    )
    
    // Position centered horizontally, above the image area
    const left = (1400 - width) / 2
    const top = 50
    
    psd.children.push({
      name: 'Top Text',
      left: Math.round(left),
      top: Math.round(top),
      right: Math.round(left + width),
      bottom: Math.round(top + height),
      canvas: canvas,
      blendMode: 'normal',
      opacity: 255
    })
  }

  // Only add other text layers if not in template mode
  if (!state.selectedTemplate) {
    // Layer 3: Bottom Text
    if (state.textSettings.bottomText && state.textSettings.bottomText.trim()) {
      const bottomTextSize = baseFontSize * 2
      const { canvas, width, height } = createTextCanvas(
        state.textSettings.bottomText, 
        bottomTextSize, 
        textColor,
        'center'
      )
      
      // Position centered horizontally, below the image
      const left = (1400 - width) / 2
      const top = 1150
      
      psd.children.push({
        name: 'Bottom Text',
        left: Math.round(left),
        top: Math.round(top),
        right: Math.round(left + width),
        bottom: Math.round(top + height),
        canvas: canvas,
        blendMode: 'normal',
        opacity: 255
      })
    }

    // Layer 4: Left Text
    if (state.textSettings.leftText && state.textSettings.leftText.trim()) {
      const leftTextSize = baseFontSize * 2
      const { canvas, width, height } = createTextCanvas(
        state.textSettings.leftText, 
        leftTextSize, 
        textColor,
        'left'
      )
      
      // Position on left side, vertically centered with image
      const left = 20
      const top = 700 - (height / 2) // Centered with image (image center is at 700)
      
      psd.children.push({
        name: 'Left Text',
        left: Math.round(left),
        top: Math.round(top),
        right: Math.round(left + width),
        bottom: Math.round(top + height),
        canvas: canvas,
        blendMode: 'normal',
        opacity: 255
      })
    }

    // Layer 5: Right Text
    if (state.textSettings.rightText && state.textSettings.rightText.trim()) {
      const rightTextSize = baseFontSize * 2
      const { canvas, width, height } = createTextCanvas(
        state.textSettings.rightText, 
        rightTextSize, 
        textColor,
        'right'
      )
      
      // Position on right side, vertically centered with image
      const left = 1400 - width - 20 // 20px from right edge
      const top = 700 - (height / 2) // Centered with image
      
      psd.children.push({
        name: 'Right Text',
        left: Math.round(left),
        top: Math.round(top),
        right: Math.round(left + width),
        bottom: Math.round(top + height),
        canvas: canvas,
        blendMode: 'normal',
        opacity: 255
      })
    }
  }

  // Generate the PSD file
  const buffer = writePsd(psd)
  
  // Download the PSD
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = 'custom-tshirt-design.psd'
  link.click()
  
  // Clean up
  URL.revokeObjectURL(url)
}


  return (
    <section className="relative w-full h-[80svh] md:h-[80svh] bg-gray-50">
      {/* 3D Canvas Background */}
      <div 
        className="absolute inset-0 w-full lg:w-[70%] h-full"
        style={{
          backgroundImage: 'url(/images/grass-background.jpg)', // Add your grass image to public folder
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 2.5], fov: 25 }} 
          gl={{ preserveDrawingBuffer: true, antialias: false, alpha: true }}
        >
          <ambientLight intensity={0.5 * Math.PI} />
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
          <Suspense fallback={null}>
            {/* <CameraRig> */}
              <TransparentBackdrop />
              <Center>
                <Shirt 
                  color={state.selectedColor} 
                  decalImage={compositeImage || getCurrentImage()} 
                />
              </Center>
            {/* </CameraRig> */}
          </Suspense>
        </Canvas>

        <CompositorComponent />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <ResponsiveCustomizer 
          state={state} 
          setState={setState}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          handlePreviewSelect={handlePreviewSelect}
          handleTemplateSelect={handleTemplateSelect}
          handleTextChange={handleTextChange}
          downloadDesign={downloadDesign}
          handleDownloadPSD={handleDownloadPSD}
          isGenerating={isGenerating}
          compositeImage={compositeImage}
          getCurrentImage={getCurrentImage}
        />
      </div>
    </section>
  )
}

// Responsive Customizer that switches between desktop and mobile layouts
function ResponsiveCustomizer(props) {
  return (
    <>
      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden lg:block w-full h-full">
        <DesktopCustomizer {...props} />
      </div>
      
      {/* Mobile Layout - Hidden on desktop */}
      <div className="block lg:hidden w-full h-full">
        <MobileCustomizer {...props} />
      </div>
    </>
  )
}

// Desktop layout
function DesktopCustomizer({ state, setState, fileInputRef, handleImageUpload, handlePreviewSelect, handleTemplateSelect, handleTextChange, downloadDesign, handleDownloadPSD, isGenerating, compositeImage, getCurrentImage }) {
  const hasTextContent = state.textSettings.topText || state.textSettings.bottomText || 
                        state.textSettings.leftText || state.textSettings.rightText

  return (
    <div className="w-full h-full flex">
      {/* Left area - 3D Preview (70%) */}
      <div className="flex-[0.7] relative">
        {/* Disclaimer - Top Left */}
        <div className="absolute top-6 left-6 z-50 pointer-events-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm max-w-xs">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">미리보기 안내</p>
                <p className="text-xs leading-relaxed">
                  모든 제품은 전문 디자이너가 고객님과 무료 1:1 상담과 디자인 한 후 제작됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Controls (30%) */}
      <div className="flex-[0.3] p-6 space-y-6 bg-white/90 backdrop-blur-sm h-full overflow-y-auto pointer-events-auto">
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">커스터마이징</h2>
        </div>

        <PreviewImages 
          selectedImage={state.uploadedImage}
          onImageSelect={handlePreviewSelect}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          disabled={state.selectedTemplate !== null}
        />

        <TemplateSelector 
          selectedTemplate={state.selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
        />

        <TextCustomizer 
          textSettings={state.textSettings}
          onTextChange={handleTextChange}
          templateMode={state.selectedTemplate !== null}
        />

        {/* Color Selection */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Palette className="mr-2" size={20} />
            티셔츠 색상
          </h3>
          
          <div className="grid grid-cols-4 gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setState(prev => ({ ...prev, selectedColor: color }))}
                className={`w-12 h-12 rounded-full border-4 transition-all duration-200 hover:scale-110 ${
                  state.selectedColor === color 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadPSD}
            disabled={!getCurrentImage()}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            <span>PSD 다운로드</span>
          </button>

          <button
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            <span>장바구니에 담기</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Mobile layout with left drawer
function MobileCustomizer({ state, setState, fileInputRef, handleImageUpload, handlePreviewSelect, handleTemplateSelect, handleTextChange, downloadDesign, handleDownloadPSD, isGenerating, compositeImage, getCurrentImage }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('images')
  
  const hasTextContent = state.textSettings.topText || state.textSettings.bottomText || 
                        state.textSettings.leftText || state.textSettings.rightText

  const tabs = [
    { id: 'images', label: '이미지', icon: ImageIcon },
    { id: 'templates', label: '시안', icon: Palette },
    { id: 'text', label: '글자', icon: Type },
    { id: 'colors', label: '색상', icon: Palette },
  ]

  return (
    <div className="w-full h-full relative">
      {/* Status indicator and menu button at top */}
      <div className="absolute top-4 left-4 right-4 z-50 pointer-events-auto">
        <div className="flex items-center justify-between">
          {!drawerOpen && (
                      <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-200 hover:bg-white transition-all duration-200"
          >
            <Menu size={20} className="text-gray-700" />
          </button>
          )}
        </div>
      </div>

      {/* Disclaimer - Mobile Top Left (below top controls) */}
      <div className="absolute top-20 left-4 right-4 z-40 pointer-events-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">미리보기 안내</p>
              <p className="text-xs leading-relaxed">
                이것은 참고용 미리보기입니다. 모든 디자인은 전문 디자이너가 최종 검토 후 제작됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: drawerOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute top-0 left-0 bottom-0 w-80 bg-white shadow-2xl pointer-events-auto flex flex-col z-40"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">커스터마이징</h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-3 gap-[0.5em] rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Drawer Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'images' && (
              <div className="space-y-6">
                <PreviewImages 
                  selectedImage={state.uploadedImage}
                  onImageSelect={handlePreviewSelect}
                  fileInputRef={fileInputRef}
                  handleImageUpload={handleImageUpload}
                  disabled={state.selectedTemplate !== null}
                />
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6">
                <TemplateSelector 
                  selectedTemplate={state.selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                />
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-6">
                <TextCustomizer 
                  textSettings={state.textSettings}
                  onTextChange={handleTextChange}
                  templateMode={state.selectedTemplate !== null}
                />
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-6">
                {/* Color Selection */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Palette className="mr-2" size={20} />
                    티셔츠 색상
                  </h3>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setState(prev => ({ ...prev, selectedColor: color }))}
                        className={`w-12 h-12 rounded-full border-4 transition-all duration-200 hover:scale-110 ${
                          state.selectedColor === color 
                            ? 'border-gray-800 scale-110' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleDownloadPSD}
            disabled={!getCurrentImage()}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            <span>PSD 다운로드</span>
          </button>

          <button
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-[1em]"
          >
            <ShoppingCart size={20} />
            <span>장바구니에 담기</span>
          </button>

        </div>
      </motion.div>

      {/* Overlay when drawer is open */}
      {drawerOpen && (
        <div 
          className="absolute inset-0 bg-black/20 z-30 pointer-events-auto"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </div>
  )
}

// 3D Components
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
      opacity={0.2} // Adjust shadow opacity as needed (0.6 = 60% opacity)
    >
      <RandomizedLight amount={4} radius={9} intensity={0.55 * Math.PI} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25 * Math.PI} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function Shirt({ color, decalImage }) {
  const { nodes, materials } = useGLTF('/shirt_baked_collapsed.glb')
  
  useFrame((state, delta) => {
    if (materials?.lambert1?.color) {
      easing.dampC(materials.lambert1.color, color, 0.25, delta)
    }
  })
  
  return (
    <mesh 
      castShadow 
      geometry={nodes?.T_Shirt_male?.geometry} 
      material={materials?.lambert1} 
      material-roughness={1}
      dispose={null}
    >
      {decalImage && (
        <DecalTexture 
          position={[0, 0.04, 0.15]} 
          rotation={[0, 0, 0]} 
          scale={0.25} 
          imageUrl={decalImage}
        />
      )}
    </mesh>
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

useGLTF.preload('/shirt_baked_collapsed.glb')