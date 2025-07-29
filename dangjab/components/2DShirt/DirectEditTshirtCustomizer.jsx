// @/components/2DShirt/DirectEditTshirtCustomizer.jsx
'use client'

import React, { useState, useRef } from 'react'
import { ArrowLeft, Type, Image, Download, Palette, Shirt, Package, Layers, Edit3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DefaultPanel from '@/components/2DShirt/DefaultPanel'
import TemplatePanel from '@/components/2DShirt/TemplatePanel'
import TextEditingPanel from '@/components/2DShirt/TextEditingPanel'
import ImagePanel from '@/components/2DShirt/ImagePanel'
import DesignPanel from '@/components/2DShirt/DesignPanel'
import TshirtCanvas from '@/components/2DShirt/TshirtCanvas'

const PANEL_TYPES = {
  DEFAULT: 'default',
  TEMPLATE: 'template', 
  TEXT: 'text',
  IMAGE: 'image',
  DESIGN: 'design'
}

const ELEMENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image'
}

export default function DirectEditTshirtCustomizer({ 
  onBack, 
  initialData = {}, 
  onSave 
}) {
  const [textElements, setTextElements] = useState(initialData.textElements || [])
  const [imageElements, setImageElements] = useState(initialData.imageElements || [])
  const [selectedElementId, setSelectedElementId] = useState(null)
  const [selectedElementType, setSelectedElementType] = useState(null) // 'text' or 'image'
  const [activePanel, setActivePanel] = useState(PANEL_TYPES.DEFAULT)
  
  // Product options state
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  
  const fileInputRef = useRef(null)
  
  // Get selected text element
  const selectedTextElement = textElements.find(el => el.id === selectedElementId && selectedElementType === ELEMENT_TYPES.TEXT)
  const selectedImageElement = imageElements.find(el => el.id === selectedElementId && selectedElementType === ELEMENT_TYPES.IMAGE)

  // Add new text element
  const addTextElement = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      text: '텍스트',
      x: 250, // Center of 500px canvas
      y: 200,
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1,
      rotation: 0
    }
    
    setTextElements(prev => [...prev, newElement])
    setSelectedElementId(newElement.id)
    setSelectedElementType(ELEMENT_TYPES.TEXT)
    setActivePanel(PANEL_TYPES.TEXT)
  }

  // Add new image element
  const addImageElement = (imageSrc) => {
    const newElement = {
      id: `image-${Date.now()}`,
      src: imageSrc,
      x: 250, // Center of canvas
      y: 200,
      width: 120, // Default size
      height: 120,
      rotation: 0
    }
    
    setImageElements(prev => [...prev, newElement])
    setSelectedElementId(newElement.id)
    setSelectedElementType(ELEMENT_TYPES.IMAGE)
    setActivePanel(PANEL_TYPES.DEFAULT) // Go back to default panel after adding image
  }

  // Update text element
  const updateTextElement = (id, updates) => {
    setTextElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    )
  }

  // Update image element
  const updateImageElement = (id, updates) => {
    setImageElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    )
  }

  // Delete text element
  const deleteTextElement = (id) => {
    setTextElements(prev => prev.filter(el => el.id !== id))
    if (selectedElementId === id && selectedElementType === ELEMENT_TYPES.TEXT) {
      setSelectedElementId(null)
      setSelectedElementType(null)
      setActivePanel(PANEL_TYPES.DEFAULT)
    }
  }

  // Delete image element
  const deleteImageElement = (id) => {
    setImageElements(prev => prev.filter(el => el.id !== id))
    if (selectedElementId === id && selectedElementType === ELEMENT_TYPES.IMAGE) {
      setSelectedElementId(null)
      setSelectedElementType(null)
      setActivePanel(PANEL_TYPES.DEFAULT)
    }
  }

  // Handle element selection (unified for text and images)
  const handleElementSelect = (id, type) => {
    setSelectedElementId(id)
    setSelectedElementType(type)
    
    // Auto-switch to text panel if text is selected
    if (id && type === ELEMENT_TYPES.TEXT && activePanel !== PANEL_TYPES.TEXT) {
      setActivePanel(PANEL_TYPES.TEXT)
    }
  }

  // Handle image upload (creates a new image element)
  const handleImageUpload = (imageSrc) => {
    addImageElement(imageSrc)
  }

  // Handle panel button clicks
  const handlePanelClick = (panelType) => {
    if (panelType === PANEL_TYPES.TEXT) {
      // If clicking text panel but no text selected, add new text
      if (!selectedTextElement) {
        addTextElement()
      } else {
        setActivePanel(panelType)
      }
    } else {
      setActivePanel(panelType)
    }
  }

  // Handle add to cart
  const handleAddToCart = () => {
    const orderData = {
      textElements,
      imageElements,
      selectedSize,
      quantity,
      timestamp: new Date().toISOString()
    }
    console.log('Adding to cart:', orderData)
    if (onSave) {
      onSave(orderData)
    }
  }

  // Panel button configuration
  const panelButtons = [
    { 
      type: PANEL_TYPES.TEMPLATE, 
      icon: Layers, 
      label: '템플릿',
      isActive: activePanel === PANEL_TYPES.TEMPLATE 
    },
    { 
      type: PANEL_TYPES.TEXT, 
      icon: Type, 
      label: '텍스트 편집',
      isActive: activePanel === PANEL_TYPES.TEXT 
    },
    { 
      type: PANEL_TYPES.IMAGE, 
      icon: Image, 
      label: '이미지 추가',
      isActive: activePanel === PANEL_TYPES.IMAGE 
    }
    // { 
    //   type: PANEL_TYPES.DESIGN, 
    //   icon: Palette, 
    //   label: '디자인 추가',
    //   isActive: activePanel === PANEL_TYPES.DESIGN 
    // }
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto min-h-screen">
        {/* Center - T-shirt Canvas */}
        <div className="flex-1 p-8 flex justify-center items-center">
          <TshirtCanvas
            textElements={textElements}
            imageElements={imageElements}
            selectedElementId={selectedElementId}
            selectedElementType={selectedElementType}
            onElementSelect={handleElementSelect}
            onTextUpdate={updateTextElement}
            onImageUpdate={updateImageElement}
            onTextDelete={deleteTextElement}
            onImageDelete={deleteImageElement}
            isEditingMode={true}
          />
        </div>

        {/* Right Panel Controls */}
        <div className="flex">
          {/* Panel Selection Buttons */}
          <div className="w-16 flex flex-col items-center py-6 space-y-4">
            {panelButtons.map((button) => {
              const Icon = button.icon
              return (
                <button
                  key={button.type}
                  onClick={() => handlePanelClick(button.type)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                    button.isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={button.label}
                >
                  <Icon size={20} />
                </button>
              )
            })}
          </div>

          {/* Dynamic Panel Content */}
          <div className="w-80 bg-white border-l border-gray-200">
            <AnimatePresence mode="wait">
              {activePanel === PANEL_TYPES.DEFAULT && (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DefaultPanel
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              )}

              {activePanel === PANEL_TYPES.TEMPLATE && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TemplatePanel 
                    onSelectTemplate={(template) => {
                      setTextElements(template.textElements || [])
                      setImageElements(template.imageElements || [])
                    }}
                  />
                </motion.div>
              )}

              {activePanel === PANEL_TYPES.TEXT && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedTextElement ? (
                    <TextEditingPanel
                      textElement={selectedTextElement}
                      onUpdate={(updates) => updateTextElement(selectedTextElement.id, updates)}
                      onClose={() => setActivePanel(PANEL_TYPES.DEFAULT)}
                      onDelete={() => deleteTextElement(selectedTextElement.id)}
                    />
                  ) : (
                    <div className="p-6 text-center">
                      <Type size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-4">편집할 텍스트를 선택하거나 새로 추가하세요</p>
                      <button
                        onClick={addTextElement}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        텍스트 추가
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activePanel === PANEL_TYPES.IMAGE && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ImagePanel
                    onImageUpload={handleImageUpload}
                  />
                </motion.div>
              )}

              {activePanel === PANEL_TYPES.DESIGN && (
                <motion.div
                  key="design"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* <DesignPanel
                  /> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}