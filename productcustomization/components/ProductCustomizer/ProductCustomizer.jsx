// @/components/ProductCustomizer.jsx
'use client'

import React, { useState, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight, Environment, Center } from '@react-three/drei'
import { motion } from 'framer-motion'
import PreviewImages from '@/components/PreviewImages'
import TextCustomizer from '@/components/TextCustomizer'
import TemplateSelector from '@/components/TemplateSelector'
import { useCompositeImage } from '@/components/ProductCustomizer/ImageTextCompositor'
import Shirt from './3DModel'
import TransparentBackdrop from './TransparentBackdrop'
import { getProductConfig } from './config/productConfig'


import { 
  Download, 
  Palette,
  Menu,
  X,
  ShoppingCart,
  Info,
  Type,
  Image as ImageIcon
} from 'lucide-react'
import ProductModel from './3DModel'

import { OrbitControls } from '@react-three/drei'


export default function ProductCustomizer({ productType }) {
  const productConfig = getProductConfig(productType)

  const [state, setState] = useState({
    selectedColor: productConfig.defaultColor,
    selectedSize: productConfig.defaultSize,
    uploadedImage: null,
    selectedTemplate: null, // null, 'summer', 'travel'
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

  // Get the current image to display (template or uploaded)
  const getCurrentImage = () => {
    if (state.selectedTemplate) {
      return productConfig.templates[state.selectedTemplate]?.image
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
          const template = productConfig.templates[templateId]
          if (template?.defaultText) {
            newTextSettings = { ...template.defaultText }
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
      link.setAttribute('download', `custom-${productType}-design.png`)
      link.setAttribute('href', canvas.toDataURL('image/png'))
      link.click()
    }
  }

  return (
    <section className="relative w-full h-[80svh] md:h-[80svh] bg-gray-50">
      {/* 3D Canvas Background */}
      <div 
        className="absolute inset-0 w-full lg:w-[70%] h-full"
        style={{
          backgroundImage: 'url(/images/background.jpg)', 
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
          <OrbitControls
            enableZoom={false}        // Allow zooming
            enablePan={false}         // Allow panning
            enableRotate={true}      // Allow rotation
            rotateSpeed={1.0}        // Rotation sensitivity
            minPolarAngle={Math.PI/2.5}        // Minimum vertical rotation
            maxPolarAngle={Math.PI/2}  // Maximum vertical rotation
            minAzimuthAngle={-Math.PI / 4}  // Minimum horizontal rotation (left limit)
            maxAzimuthAngle={Math.PI / 4}   // Maximum horizontal rotation (right limit)
          />
          <ambientLight intensity={0.5 * Math.PI} />
          <Environment preset="city"/>
          <Suspense fallback={null}>
            {/* <CameraRig> */}
              <TransparentBackdrop />
              <Center>
                <ProductModel
                  productType={productType}
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
          productConfig={productConfig} 
          state={state} 
          setState={setState}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          handlePreviewSelect={handlePreviewSelect}
          handleTemplateSelect={handleTemplateSelect}
          handleTextChange={handleTextChange}
          downloadDesign={downloadDesign}
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
function DesktopCustomizer({ state, setState, productConfig, fileInputRef, handleImageUpload, handlePreviewSelect, handleTemplateSelect, handleTextChange, getCurrentImage }) {

  return (
    <div className="w-full h-full flex">
      {/* Left area - 3D Preview (70%) */}
      <div className="flex-[0.7] relative">

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

        {/* <TemplateSelector 
          selectedTemplate={state.selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
        /> */}

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
            {productConfig.colors.map((color) => (
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
    </div>
  )
}

// Mobile layout with left drawer
function MobileCustomizer({ state, setState, productConfig, fileInputRef, handleImageUpload, handlePreviewSelect, handleTemplateSelect, handleTextChange, getCurrentImage }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('images')


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
      <div className="absolute top-20 left-4 right-4 z-40 pointer-events-auto hidden md:block">
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
                  previewImages={productConfig.previewImages}
                  fileInputRef={fileInputRef}
                  handleImageUpload={handleImageUpload}
                  disabled={state.selectedTemplate !== null}
                />
              </div>
            )}

            {/* {activeTab === 'templates' && (
              <div className="space-y-6">
                <TemplateSelector 
                  selectedTemplate={state.selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                  templates={Object.values(productConfig.templates)}
                />
              </div>
            )} */}

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
                    {productConfig.colors.map((color) => (
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