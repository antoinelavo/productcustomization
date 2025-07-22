'use client'

import React, { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center } from '@react-three/drei'
import { easing } from 'maath'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewImages from '@/components/PreviewImages'
import TextCustomizer from '@/components/TextCustomizer'
import { useCompositeImage } from '@/components/ImageTextCompositor'

import { 
  Camera, 
  Upload, 
  ArrowLeft, 
  Download, 
  Palette,
  Heart,
  Sparkles,
  Loader,
  ChevronUp,
  ChevronDown,
  Menu
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

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function TShirtCustomizer() {
  const [state, setState] = useState({
    intro: true,
    selectedColor: '#ffffff',
    uploadedImage: null,
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

  // Generate composite image with text overlay
  const { compositeImage, isGenerating, CompositorComponent } = useCompositeImage(state.uploadedImage, state.textSettings)

  const transition = { type: 'spring', duration: 0.8 }
  
  const config = {
    initial: { x: -100, opacity: 0, transition: { ...transition, delay: 0.5 } },
    animate: { x: 0, opacity: 1, transition: { ...transition, delay: 0 } },
    exit: { x: -100, opacity: 0, transition: { ...transition, delay: 0 } }
  }

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

  const handleTextChange = (newTextSettings) => {
    setState(prev => ({ ...prev, textSettings: newTextSettings }))
  }

  const downloadDesign = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.setAttribute('download', 'dog-tshirt-design.png')
      link.setAttribute('href', canvas.toDataURL('image/png'))
      link.click()
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 2.5], fov: 25 }} 
          gl={{ preserveDrawingBuffer: true,
                antialias: false    // Fixed: was antialiasfalse
              }}
          style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #eff6ff 100%)' }}
          
        >
          <ambientLight intensity={0.5 * Math.PI} />
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
          <Suspense fallback={null}>
            <CameraRig intro={state.intro}>
              <Backdrop color="#EFBD4E" />
              <Center>
                <Shirt 
                  color={state.selectedColor} 
                  decalImage={compositeImage || state.uploadedImage} 
                />
              </Center>
            </CameraRig>
          </Suspense>
        </Canvas>

        <CompositorComponent />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={transition}
          className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 md:p-6 z-50 pointer-events-auto"
        >
          <div className="flex items-center space-x-2 w-[10em] hidden sm:block">
            <img src="logo.png" alt="Logo" />
          </div>
          
          <motion.div 
            animate={{ x: state.intro ? 0 : 100, opacity: state.intro ? 1 : 0 }} 
            transition={transition}
            className="text-pink-500"
          >
          </motion.div>
        </motion.header>

        {/* Main Content Overlay */}
        <AnimatePresence mode="wait">
          {state.intro ? (
            <motion.section key="main" {...config} className="absolute inset-0 flex items-center justify-center p-6 z-40 pointer-events-auto">
              <div className="max-w-2xl text-center">
                  <h1 className="text-4xl">
                    커스텀 티셔츠 만들기!
                  </h1>
                
                <motion.div
                  key="content"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    damping: 7,
                    stiffness: 30,
                    restDelta: 0.001,
                    duration: 0.6,
                    delay: 0.2,
                  }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setState(prev => ({ ...prev, intro: false }))}
                    style={{ backgroundColor: "#EFBD4E" }}
                    className="inline-flex items-center space-x-3 px-8 py-4 text-white font-bold text-lg rounded-full hover:scale-105 transition-transform duration-200 shadow-xl"
                  >
                    <span>시작하기</span>
                  </button>
                </motion.div>
              </div>
            </motion.section>
          ) : (
            <motion.section key="custom" {...config} className="absolute inset-0 z-40 pointer-events-none">
              <ResponsiveCustomizer 
                state={state} 
                setState={setState}
                fileInputRef={fileInputRef}
                handleImageUpload={handleImageUpload}
                handlePreviewSelect={handlePreviewSelect}
                handleTextChange={handleTextChange}
                downloadDesign={downloadDesign}
                isGenerating={isGenerating}
                compositeImage={compositeImage}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
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

// Desktop layout (your existing sidebar layout)
function DesktopCustomizer({ state, setState, fileInputRef, handleImageUpload, handlePreviewSelect, handleTextChange, downloadDesign, isGenerating, compositeImage }) {
  const hasTextContent = state.textSettings.topText || state.textSettings.bottomText || 
                        state.textSettings.leftText || state.textSettings.rightText

  return (
    <div className="w-full h-full flex">
      {/* Left Panel - Controls */}
      <div className="w-80 p-6 space-y-6 bg-white/90 backdrop-blur-sm h-full overflow-y-auto pt-[7em] pointer-events-auto">
        <PreviewImages 
          selectedImage={state.uploadedImage}
          onImageSelect={handlePreviewSelect}
        />

        <TextCustomizer 
          textSettings={state.textSettings}
          onTextChange={handleTextChange}
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
            onClick={downloadDesign}
            disabled={!state.uploadedImage}
            style={{ backgroundColor: "#161616" }}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 text-white font-bold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Download size={20} />
            <span>사진 다운로드하기</span>
          </button>
          
          <button
            onClick={() => setState(prev => ({ ...prev, intro: true }))}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>돌아가기</span>
          </button>
        </div>
      </div>

      {/* Right Panel - 3D View Instructions */}
      <div className="flex-1 p-6 flex items-end justify-end">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 max-w-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">안내</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p className="hidden sm:block">🖱️ 마우스를 <strong>움직여서</strong> 티셔츠를 회전해보세요.</p>
                                                
            {compositeImage && hasTextContent && !isGenerating && (
              <p>✨ <strong>이름 및 문구가 적용되었습니다!</strong></p>
            )}
            
            {state.uploadedImage && hasTextContent && (
              <p>🎨 <strong>커스텀 디자인이 준비되었습니다!</strong></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile layout with bottom drawer
function MobileCustomizer({ state, setState, fileInputRef, handleImageUpload, handlePreviewSelect, handleTextChange, downloadDesign, isGenerating, compositeImage }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('images')
  
  const hasTextContent = state.textSettings.topText || state.textSettings.bottomText || 
                        state.textSettings.leftText || state.textSettings.rightText

  const tabs = [
    { id: 'images', label: '이미지', icon: Upload },
    { id: 'text', label: '텍스트', icon: Menu },
    { id: 'colors', label: '색상', icon: Palette },
  ]

  return (
    <div className="w-full h-full relative pointer-events-none">
      {/* Status indicator at top */}
      <div className="absolute top-[4%] right-4 left-4 z-50 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200 text-center">
          <div className="text-sm text-gray-600">
            <p className="block sm:hidden">📱 <strong>터치해서</strong> 티셔츠를 회전해보세요.</p>
            {compositeImage && hasTextContent && !isGenerating && <span>✨ 디자인 완료!</span>}
          </div>
        </div>
      </div>

      {/* Bottom Drawer */}
      <motion.div
        initial={{ y: "85%" }}
        animate={{ y: drawerOpen ? "13%" : "85%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl pointer-events-auto flex flex-col"
        style={{ height: "100dvh" }}
      >
        {/* Drawer Handle */}
        <div 
          className="flex justify-center pt-4 pb-2 cursor-pointer flex-shrink-0"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Drawer Header */}
        <div className="px-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">커스터마이징</h2>
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {drawerOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-200 ${
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
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 pb-8">
            {activeTab === 'images' && (
              <div className="space-y-6">
                <PreviewImages 
                  selectedImage={state.uploadedImage}
                  onImageSelect={handlePreviewSelect}
                />
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-6">
                <TextCustomizer 
                  textSettings={state.textSettings}
                  onTextChange={handleTextChange}
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
                  
                  <div className="grid grid-cols-4 gap-4">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setState(prev => ({ ...prev, selectedColor: color }))}
                        className={`w-16 h-16 rounded-full border-4 transition-all duration-200 hover:scale-110 ${
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
                    onClick={downloadDesign}
                    disabled={!state.uploadedImage}
                    style={{ backgroundColor: "#161616" }}
                    className="w-full flex items-center justify-center space-x-2 py-4 px-6 text-white font-bold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Download size={20} />
                    <span>사진 다운로드하기</span>
                  </button>
                  
                  <button
                    onClick={() => setState(prev => ({ ...prev, intro: true }))}
                    className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors duration-200"
                  >
                    <ArrowLeft size={20} />
                    <span>돌아가기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// 3D Components (unchanged)
function Backdrop({ color }) {
  const shadows = useRef()
  useFrame((state, delta) => {
    if (shadows.current?.getMesh()?.material?.color) {
      easing.dampC(shadows.current.getMesh().material.color, color, 0.25, delta)
    }
  })
  
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
    >
      <RandomizedLight amount={4} radius={9} intensity={0.55 * Math.PI} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25 * Math.PI} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function CameraRig({ children, intro }) {
  const group = useRef()
  
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [intro ? -state.viewport.width / 4 : 0, 0, 2], 0.25, delta)
    if (group.current) {
      easing.dampE(group.current.rotation, [-state.pointer.y / 5, state.pointer.x / 3, 0], 0.25, delta)
    }
  })
  
  return <group ref={group}>{children}</group>
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