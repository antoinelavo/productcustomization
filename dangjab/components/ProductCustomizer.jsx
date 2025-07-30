// @/components/ProductCustomizer.jsx
'use client'

import React, { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center } from '@react-three/drei'
import { easing } from 'maath'
import { motion } from 'framer-motion'
import PreviewImages from '@/components/PreviewImages'
import { uploadImageToStorage } from '@/lib/supabaseStorage'
import { writePsdBuffer } from 'ag-psd'
import DesignPreviewPanel from '@/components/DesignPreviewPanel'
import TextCustomizer from '@/components/TextCustomizer' 
import { useCompositeImageWithElements } from '@/components/ImageTextCompositor'

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
  Loader2
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

export default function ProductCustomizer({ product, customizationData, onCustomizationChange }) {
  const [state, setState] = useState(customizationData)
  const [selectedTextId, setSelectedTextId] = useState(null)
  
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    uploadError: null
  })
  
  const fileInputRef = useRef(null)

  // Sync with parent when customizationData changes
  useEffect(() => {
    setState(customizationData);
  }, [customizationData]);

  // Helper function to update state and notify parent
  const updateCustomization = (newState) => {
    setState(newState);
    if (onCustomizationChange) {
      onCustomizationChange(newState);
    }
  };

  // Generate composite image with text overlay
  const { compositeImage, isGenerating, CompositorComponent } = useCompositeImageWithElements(
    state.uploadedImage, 
    state.textSettings || {}
  )

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset upload state
    setUploadState({ isUploading: true, uploadError: null })

    try {
      console.log('📤 Starting image upload:', file.name);

      // Upload to Supabase Storage
      const { url, error } = await uploadImageToStorage(file)

      if (error) {
        console.error('❌ Upload failed:', error);
        setUploadState({ isUploading: false, uploadError: error })
        return
      }

      if (url) {
        console.log('✅ Upload successful, URL:', url);
        updateCustomization(prev => ({ ...prev, uploadedImage: url }))
        setUploadState({ isUploading: false, uploadError: null })
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadState({ 
        isUploading: false, 
        uploadError: 'Upload failed. Please try again.' 
      })
    }

    // Clear the file input so the same file can be uploaded again if needed
    if (event.target) {
      event.target.value = ''
    }
  }

  const handlePreviewSelect = (imageUrl) => {
    updateCustomization(prev => ({ ...prev, uploadedImage: imageUrl }))
    // Clear any upload errors when selecting a preview image
    setUploadState(prev => ({ ...prev, uploadError: null }))
  }

  // NEW: Handlers for hybrid text system
  const handleTextSettingsChange = (newTextSettings) => {
    updateCustomization(prev => ({ ...prev, textSettings: newTextSettings }))
  }

  const handleAddCustomText = () => {
    const newElement = {
      id: `custom-${Date.now()}`,
      text: '새 텍스트',
      x: 700, // Center of 1400px canvas
      y: 700,
      fontSize: state.textSettings?.fontSize || 'medium',
      color: state.textSettings?.textColor || '#8B4513',
      fontFamily: state.textSettings?.fontFamily || 'Arial, sans-serif'
    }
    
    const updatedSettings = {
      ...state.textSettings,
      customElements: [...(state.textSettings?.customElements || []), newElement]
    }
    handleTextSettingsChange(updatedSettings)
    setSelectedTextId(newElement.id)
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

  // PSD Helper Functions - Updated for hybrid text system
  const createImageLayer = (imageUrl, canvasWidth, canvasHeight) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      const ctx = canvas.getContext('2d')
      
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const x = 300  // Fixed position
        const y = 300  // Fixed position  
        const drawWidth = 800   // Fixed size
        const drawHeight = 800  // Fixed size
        
        ctx.drawImage(img, x, y, drawWidth, drawHeight)
        resolve(canvas)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = imageUrl
    })
  }

  const createTextLayers = async (textSettings, canvasWidth, canvasHeight) => {
    const layers = []
    
    if (!textSettings) return layers

    // Font size mapping
    const fontSizeMap = { small: 18, medium: 24, large: 30, xl: 36 }
    
    // Traditional text positions (with custom overrides)
    const getTraditionalTextPositions = () => {
      const defaults = {
        topText: { x: 700, y: 200 },
        bottomText: { x: 700, y: 1200 },
        leftText: { x: 100, y: 700 },
        rightText: { x: 1300, y: 700 }
      }
      
      return {
        ...defaults,
        ...textSettings.textPositions
      }
    }

    const traditionalPositions = getTraditionalTextPositions()

    // Create layers for traditional text
    for (const textKey of ['topText', 'bottomText', 'leftText', 'rightText']) {
      const text = textSettings[textKey]
      if (!text || !text.trim()) continue

      const canvas = document.createElement('canvas')
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      const ctx = canvas.getContext('2d')
      
      const position = traditionalPositions[textKey]
      const fontSize = fontSizeMap[textSettings.fontSize] || 24
      
      ctx.font = `bold ${fontSize}px ${textSettings.fontFamily || 'Arial'}`
      ctx.fillStyle = textSettings.textColor || '#8B4513'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Add white stroke for visibility
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.strokeText(text.toUpperCase(), position.x, position.y)
      ctx.fillText(text.toUpperCase(), position.x, position.y)
      
      layers.push({
        name: `${textKey.replace('Text', '').toUpperCase()} Text`,
        canvas: canvas,
        opacity: 255,
        blendMode: 'normal'
      })
    }

    // Create layers for custom text elements
    if (textSettings.customElements) {
      for (const element of textSettings.customElements) {
        const canvas = document.createElement('canvas')
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        const ctx = canvas.getContext('2d')
        
        const fontSize = fontSizeMap[element.fontSize] || 24
        
        ctx.font = `bold ${fontSize}px ${element.fontFamily || 'Arial'}`
        ctx.fillStyle = element.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Add white stroke for visibility
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 3
        ctx.strokeText(element.text, element.x, element.y)
        ctx.fillText(element.text, element.x, element.y)
        
        layers.push({
          name: `Custom - ${element.text.substring(0, 10)}`,
          canvas: canvas,
          opacity: 255,
          blendMode: 'normal'
        })
      }
    }
    
    return layers
  }

  const downloadAsPSD = async () => {
    try {
      console.log('🎨 Starting PSD export...')
      setUploadState(prev => ({ ...prev, isUploading: true }))
      
      const canvasWidth = 1400
      const canvasHeight = 1400
      const layers = []
      
      // Background layer (transparent)
      const bgCanvas = document.createElement('canvas')
      bgCanvas.width = canvasWidth
      bgCanvas.height = canvasHeight
      const bgCtx = bgCanvas.getContext('2d')
      bgCtx.clearRect(0, 0, canvasWidth, canvasHeight)
      
      layers.push({
        name: 'Background',
        canvas: bgCanvas,
        opacity: 255,
        blendMode: 'normal'
      })
      
      // Image layer (if exists)
      if (state.uploadedImage) {
        console.log('📷 Adding image layer...')
        const imageCanvas = await createImageLayer(state.uploadedImage, canvasWidth, canvasHeight)
        layers.push({
          name: 'Design Image',
          canvas: imageCanvas,
          opacity: 255,
          blendMode: 'normal'
        })
      }
      
      // Text layers - UPDATED to use hybrid textSettings
      console.log('📝 Adding text layers...')
      const textLayers = await createTextLayers(state.textSettings, canvasWidth, canvasHeight)
      layers.push(...textLayers)
      
      console.log(`✅ Created ${layers.length} layers`)
      
      // Create PSD structure
      const psd = {
        width: canvasWidth,
        height: canvasHeight,
        channels: 4,
        bitsPerChannel: 8,
        colorMode: 3,
        children: layers.reverse()
      }
      
      console.log('🔄 Generating PSD buffer...')
      const buffer = writePsdBuffer(psd)
      
      // Download file
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `design-${Date.now()}.psd`
      link.click()
      
      console.log('✅ PSD exported successfully!')
      
    } catch (error) {
      console.error('❌ PSD export failed:', error)
      alert('PSD 내보내기에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setUploadState(prev => ({ ...prev, isUploading: false }))
    }
  }

  return (
    <section className="relative w-full h-[80svh] md:h-[80svh] bg-gray-50">
      {/* 3D Canvas Background */}
      <div 
        className="absolute inset-0 w-full lg:w-[70%] h-full"
        style={{
          backgroundImage: 'url(/images/grass-background.jpg)',
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
            <CameraRig>
              <TransparentBackdrop />
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
        <ResponsiveCustomizer 
          state={state} 
          updateCustomization={updateCustomization}
          uploadState={uploadState}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          handlePreviewSelect={handlePreviewSelect}
          // NEW: Pass hybrid text props
          textSettings={state.textSettings || {}}
          onTextSettingsChange={handleTextSettingsChange}
          onAddCustomText={handleAddCustomText}
          selectedTextId={selectedTextId}
          onSelectText={setSelectedTextId}
          downloadDesign={downloadDesign}
          downloadAsPSD={downloadAsPSD}
          isGenerating={isGenerating}
          compositeImage={compositeImage}
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

// Desktop layout - UPDATED for 3-column layout with DesignPreviewPanel
function DesktopCustomizer({ 
  state, 
  updateCustomization, 
  uploadState, 
  fileInputRef, 
  handleImageUpload, 
  handlePreviewSelect,
  textSettings,
  onTextSettingsChange,
  onAddCustomText,
  selectedTextId,
  onSelectText,
  downloadDesign, 
  downloadAsPSD,
  isGenerating, 
  compositeImage 
}) {
  const hasContent = state.uploadedImage || 
                    textSettings?.topText || textSettings?.bottomText || 
                    textSettings?.leftText || textSettings?.rightText ||
                    (textSettings?.customElements && textSettings.customElements.length > 0)

  return (
    <div className="w-full h-full flex">
      {/* Left area - 3D Preview (40%) */}
      <div className="flex-[0.7] relative">
        {/* Disclaimer - Top Left */}
        <div className="absolute top-6 left-6 z-50 pointer-events-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm">
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

        {/* Upload Status Overlay */}
        {uploadState.isUploading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-40 pointer-events-auto">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {uploadState.isUploading ? '처리 중...' : '이미지 업로드 중...'}
                  </p>
                  <p className="text-sm text-gray-600">잠시만 기다려주세요</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Middle - Design Preview Panel (30%) */}
      {/* <div className="flex-[0.3] p-4 overflow-y-auto pointer-events-auto">
        <DesignPreviewPanel
          imageUrl={state.uploadedImage}
          textSettings={textSettings}
          onTextSettingsChange={onTextSettingsChange}
          onAddCustomText={onAddCustomText}
          selectedTextId={selectedTextId}
          onSelectText={onSelectText}
        />
      </div> */}

      {/* Right Panel - Controls (30%) */}
      <div className="flex-[0.3] p-6 space-y-6 bg-white/90 backdrop-blur-sm h-full overflow-y-auto pointer-events-auto">
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">커스터마이징</h2>
        </div>

        {/* Hidden file input for uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={uploadState.isUploading}
        />

        <PreviewImages 
          selectedImage={state.uploadedImage}
          onImageSelect={handlePreviewSelect}
          fileInputRef={fileInputRef}
          uploadState={uploadState}
        />

        <TextCustomizer 
          textSettings={textSettings}
          onTextSettingsChange={onTextSettingsChange}
          selectedTextId={selectedTextId}
          onSelectText={onSelectText}
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
                onClick={() => updateCustomization(prev => ({ ...prev, selectedColor: color }))}
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
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadDesign}
              disabled={!hasContent}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              <span>PNG</span>
            </button>
            
            <button
              onClick={downloadAsPSD}
              disabled={!hasContent}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm">🎨</span>
              <span>PSD</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-600 text-center">
            PNG: 최종 이미지 • PSD: 포토샵 편집용 레이어
          </p>
        </div>
      </div>
    </div>
  )
}

// Mobile layout - UPDATED with new props
function MobileCustomizer({ 
  state, 
  updateCustomization, 
  uploadState, 
  fileInputRef, 
  handleImageUpload, 
  handlePreviewSelect,
  textSettings,
  onTextSettingsChange,
  onAddCustomText,
  selectedTextId,
  onSelectText,
  downloadDesign, 
  downloadAsPSD,
  isGenerating, 
  compositeImage 
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('images')
  
  const hasContent = state.uploadedImage || 
                    textSettings?.topText || textSettings?.bottomText || 
                    textSettings?.leftText || textSettings?.rightText ||
                    (textSettings?.customElements && textSettings.customElements.length > 0)

  const tabs = [
    { id: 'images', label: '이미지', icon: Upload },
    { id: 'text', label: '텍스트', icon: Menu },
    { id: 'preview', label: '미리보기', icon: Info },
    { id: 'colors', label: '색상', icon: Palette },
  ]

  return (
    <div className="w-full h-full relative">
      {/* Status indicator and menu button at top */}
      <div className="absolute top-4 left-4 right-4 z-50 pointer-events-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-200 hover:bg-white transition-all duration-200"
          >
            <Menu size={20} className="text-gray-700" />
          </button>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200">
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <span>📱 터치해서 회전하기</span>
            </div>
          </div>
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

      {/* Upload Status Overlay */}
      {uploadState.isUploading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50 pointer-events-auto">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">처리 중...</p>
                <p className="text-sm text-gray-600">잠시만 기다려주세요</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={uploadState.isUploading}
      />

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
          <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center space-x-1 py-2 px-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={14} />
                  <span className="text-xs font-medium">{tab.label}</span>
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
                  uploadState={uploadState}
                />
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-6">
                <TextCustomizer 
                  textSettings={textSettings}
                  onTextSettingsChange={onTextSettingsChange}
                  selectedTextId={selectedTextId}
                  onSelectText={onSelectText}
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-6">
                <DesignPreviewPanel
                  imageUrl={state.uploadedImage}
                  textSettings={textSettings}
                  onTextSettingsChange={onTextSettingsChange}
                  onAddCustomText={onAddCustomText}
                  selectedTextId={selectedTextId}
                  onSelectText={onSelectText}
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
                        onClick={() => updateCustomization(prev => ({ ...prev, selectedColor: color }))}
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

        {/* Bottom Action Buttons */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadDesign}
              disabled={!hasContent}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              <span>PNG</span>
            </button>
            
            <button
              onClick={downloadAsPSD}
              disabled={!hasContent}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm">🎨</span>
              <span>PSD</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-600 text-center">
            PNG: 최종 이미지 • PSD: 포토샵 편집용 레이어
          </p>
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
      opacity={0.2}
    >
      <RandomizedLight amount={4} radius={9} intensity={0.55 * Math.PI} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25 * Math.PI} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function CameraRig({ children }) {
  const group = useRef()
  
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0, 0, 2], 0.25, delta)
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