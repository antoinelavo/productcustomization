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

export default function DirectEditTshirtCustomizer({ 
  onBack, 
  initialData = {}, 
  onSave 
}) {
  const [textElements, setTextElements] = useState(initialData.textElements || [])
  const [selectedElementId, setSelectedElementId] = useState(null)
  const [activePanel, setActivePanel] = useState(PANEL_TYPES.DEFAULT)
  const [backgroundImage, setBackgroundImage] = useState(initialData.backgroundImage || null)
  
  // Product options state
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  
  const fileInputRef = useRef(null)
  
  // Get selected text element
  const selectedElement = textElements.find(el => el.id === selectedElementId)

  // Add new text element
  const addTextElement = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      text: '텍스트',
      x: 250, // Center of 500px canvas
      y: 200,
      fontSize: 24,
      fontFamily: '나눔 명조',
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
    setActivePanel(PANEL_TYPES.TEXT)
  }

  // Update text element
  const updateTextElement = (id, updates) => {
    setTextElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    )
  }

  // Delete text element
  const deleteTextElement = (id) => {
    setTextElements(prev => prev.filter(el => el.id !== id))
    if (selectedElementId === id) {
      setSelectedElementId(null)
      setActivePanel(PANEL_TYPES.DEFAULT)
    }
  }

  // Handle text selection
  const handleTextSelect = (id) => {
    setSelectedElementId(id)
    if (id && activePanel !== PANEL_TYPES.TEXT) {
      setActivePanel(PANEL_TYPES.TEXT)
    }
  }

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBackgroundImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle panel button clicks
  const handlePanelClick = (panelType) => {
    if (panelType === PANEL_TYPES.TEXT) {
      // If clicking text panel but no text selected, add new text
      if (!selectedElement) {
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
      backgroundImage,
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
      icon: Edit3, 
      label: '텍스트 편집',
      isActive: activePanel === PANEL_TYPES.TEXT 
    },
    { 
      type: PANEL_TYPES.IMAGE, 
      icon: Image, 
      label: '이미지 추가',
      isActive: activePanel === PANEL_TYPES.IMAGE 
    },
    { 
      type: PANEL_TYPES.DESIGN, 
      icon: Palette, 
      label: '디자인 추가',
      isActive: activePanel === PANEL_TYPES.DESIGN 
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">T-shirt 커스터마이징</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={addTextElement}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Type size={18} />
              <span>텍스트 추가</span>
            </button>
            
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              <span>다운로드</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto min-h-screen">
        {/* Center - T-shirt Canvas */}
        <div className="flex-1 p-8 flex justify-center items-center">
          <TshirtCanvas
            textElements={textElements}
            selectedElementId={selectedElementId}
            backgroundImage={backgroundImage}
            onTextSelect={handleTextSelect}
            onTextUpdate={updateTextElement}
            onTextDelete={deleteTextElement}
            isEditingMode={true}
          />
        </div>

        {/* Right Panel Controls */}
        <div className="flex">
          {/* Panel Selection Buttons */}
          <div className="w-16 bg-white border-l border-gray-200 flex flex-col items-center py-6 space-y-4">
            {panelButtons.map((button) => {
              const Icon = button.icon
              return (
                <button
                  key={button.type}
                  onClick={() => handlePanelClick(button.type)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                    button.isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                      setBackgroundImage(template.backgroundImage || null)
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
                  {selectedElement ? (
                    <TextEditingPanel
                      textElement={selectedElement}
                      onUpdate={(updates) => updateTextElement(selectedElement.id, updates)}
                      onClose={() => setActivePanel(PANEL_TYPES.DEFAULT)}
                      onDelete={() => deleteTextElement(selectedElement.id)}
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
                    onImageUpload={(imageData) => {
                      setBackgroundImage(imageData)
                    }}
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
                  <DesignPanel
                    onSelectDesign={(design) => {
                      // Handle design selection
                      console.log('Selected design:', design)
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}