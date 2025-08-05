// @/components/DesignPreviewPanel.jsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Trash2, Move, Plus } from 'lucide-react'

const CANVAS_SIZE = {
  width: 500,  // Preview size (scaled down from 1400px)
  height: 500,
  scale: 500 / 1400  // Scale factor: preview size / actual size
}

const IMAGE_AREA = {
  // Image area within the 1400x1400 canvas (300,300 to 1100,1100)
  x: 300 * CANVAS_SIZE.scale,
  y: 300 * CANVAS_SIZE.scale, 
  width: 800 * CANVAS_SIZE.scale,
  height: 800 * CANVAS_SIZE.scale
}

export default function DesignPreviewPanel({ 
  imageUrl, 
  textSettings,
  onTextSettingsChange,
  onAddCustomText,
  selectedTextId,
  onSelectText 
}) {
  const [dragState, setDragState] = useState(null)
  const panelRef = useRef(null)

  // Convert compositor coordinates (1400x1400) to preview coordinates (500x500)
  const compositorToPreview = (x, y) => ({
    x: x * CANVAS_SIZE.scale,
    y: y * CANVAS_SIZE.scale
  })

  // Convert preview coordinates to compositor coordinates  
  const previewToCompositor = (x, y) => ({
    x: x / CANVAS_SIZE.scale,
    y: y / CANVAS_SIZE.scale
  })

  const handleMouseDown = (e, textKey) => {
    e.preventDefault()
    const rect = panelRef.current.getBoundingClientRect()
    
    // Get current position of the text
    let currentX, currentY
    if (['topText', 'bottomText', 'leftText', 'rightText'].includes(textKey)) {
      // Traditional text positions
      const positions = getTraditionalTextPositions()
      currentX = positions[textKey]?.x || 700
      currentY = positions[textKey]?.y || 700
    } else {
      // Custom text element
      const element = textSettings.customElements?.find(el => el.id === textKey)
      currentX = element?.x || 700
      currentY = element?.y || 700
    }
    
    const previewPos = compositorToPreview(currentX, currentY)
    
    setDragState({
      textKey,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      offsetX: e.clientX - rect.left - previewPos.x,
      offsetY: e.clientY - rect.top - previewPos.y
    })
    onSelectText(textKey)
  }

  const handleMouseMove = (e) => {
    if (!dragState) return
    
    const rect = panelRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - dragState.offsetX
    const newY = e.clientY - rect.top - dragState.offsetY
    
    // Constrain to canvas
    const constrainedX = Math.max(0, Math.min(newX, CANVAS_SIZE.width))
    const constrainedY = Math.max(0, Math.min(newY, CANVAS_SIZE.height))
    
    // Convert back to compositor coordinates
    const compositorPos = previewToCompositor(constrainedX, constrainedY)
    
    // Update position
    if (['topText', 'bottomText', 'leftText', 'rightText'].includes(dragState.textKey)) {
      // Update traditional text position
      const updatedSettings = {
        ...textSettings,
        textPositions: {
          ...textSettings.textPositions,
          [dragState.textKey]: { x: compositorPos.x, y: compositorPos.y }
        }
      }
      onTextSettingsChange(updatedSettings)
    } else {
      // Update custom element position
      const updatedElements = textSettings.customElements?.map(el =>
        el.id === dragState.textKey 
          ? { ...el, x: compositorPos.x, y: compositorPos.y }
          : el
      ) || []
      
      const updatedSettings = {
        ...textSettings,
        customElements: updatedElements
      }
      onTextSettingsChange(updatedSettings)
    }
  }

  const handleMouseUp = () => {
    setDragState(null)
  }

  const handleDeleteCustomText = (elementId) => {
    const updatedElements = textSettings.customElements?.filter(el => el.id !== elementId) || []
    const updatedSettings = {
      ...textSettings,
      customElements: updatedElements
    }
    onTextSettingsChange(updatedSettings)
    if (selectedTextId === elementId) {
      onSelectText(null)
    }
  }

  const getTraditionalTextPositions = () => {
    // Default positions for traditional text (can be overridden by textPositions)
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

  const getFontSize = (size) => {
    const sizeMap = { small: 12, medium: 16, large: 20, xl: 24 }
    return (sizeMap[size] || 16) * CANVAS_SIZE.scale
  }

  useEffect(() => {
    if (dragState) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragState])

  const traditionalPositions = getTraditionalTextPositions()

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">디자인 미리보기</h3>
        <button
          onClick={onAddCustomText}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus size={14} />
          <span>텍스트 추가</span>
        </button>
      </div>
      
      <div className="p-4">
        <div
          ref={panelRef}
          className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
          style={{ 
            width: CANVAS_SIZE.width, 
            height: CANVAS_SIZE.height,
            cursor: dragState ? 'grabbing' : 'default'
          }}
        >
          {/* Full Canvas Area Outline */}
          <div className="absolute inset-0 border border-blue-200 bg-white/20" />
          
          {/* Image Area Outline */}
          <div
            className="absolute border-2 border-blue-400 border-dashed bg-white/50"
            style={{
              left: IMAGE_AREA.x,
              top: IMAGE_AREA.y,
              width: IMAGE_AREA.width,
              height: IMAGE_AREA.height
            }}
          />
          
          {/* Background Image */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Design"
              className="absolute object-cover"
              style={{
                left: IMAGE_AREA.x,
                top: IMAGE_AREA.y,
                width: IMAGE_AREA.width,
                height: IMAGE_AREA.height
              }}
            />
          )}
          
          {/* Traditional Text Elements */}
          {['topText', 'bottomText', 'leftText', 'rightText'].map((textKey) => {
            const text = textSettings[textKey]
            if (!text || !text.trim()) return null
            
            const position = traditionalPositions[textKey]
            const previewPos = compositorToPreview(position.x, position.y)
            const isSelected = selectedTextId === textKey
            
            return (
              <div
                key={textKey}
                className={`absolute select-none cursor-grab active:cursor-grabbing ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: previewPos.x,
                  top: previewPos.y,
                  fontSize: getFontSize(textSettings.fontSize),
                  color: textSettings.textColor || '#8B4513',
                  fontWeight: 'bold',
                  fontFamily: textSettings.fontFamily || 'Arial',
                  transform: 'translate(-50%, -50%)',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                  zIndex: isSelected ? 10 : 5
                }}
                onMouseDown={(e) => handleMouseDown(e, textKey)}
              >
                {text.toUpperCase()}
                
                {/* Drag Handle */}
                {isSelected && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <Move size={12} />
                  </div>
                )}
              </div>
            )
          })}
          
          {/* Custom Text Elements */}
          {textSettings.customElements?.map((element) => {
            const previewPos = compositorToPreview(element.x, element.y)
            const isSelected = selectedTextId === element.id
            
            return (
              <div
                key={element.id}
                className={`absolute select-none cursor-grab active:cursor-grabbing ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: previewPos.x,
                  top: previewPos.y,
                  fontSize: getFontSize(element.fontSize),
                  color: element.color,
                  fontWeight: 'bold',
                  fontFamily: element.fontFamily || 'Arial',
                  transform: 'translate(-50%, -50%)',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                  zIndex: isSelected ? 10 : 5
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
              >
                {element.text}
                
                {/* Delete Button */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCustomText(element.id)
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                
                {/* Drag Handle */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center">
                  <Move size={12} />
                </div>
              </div>
            )
          })}
          
          {/* Helper Text */}
          {!textSettings.topText && !textSettings.bottomText && !textSettings.leftText && !textSettings.rightText && (!textSettings.customElements || textSettings.customElements.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
              텍스트를 추가하고 드래그해서 위치를 조정하세요
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-600 text-center">
          진한 점선: 이미지 영역 • 전체 영역이 편집 가능합니다
        </div>
      </div>
    </div>
  )
}