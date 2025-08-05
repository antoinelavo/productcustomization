// @/components/2DShirt/TshirtCanvas.jsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Trash2, RotateCw, Lock } from 'lucide-react'
import CurvedText from '@/components/2DShirt/CurvedText'

const CANVAS_SIZE = {
  width: 500,
  height: 600
}

const DESIGN_AREA = {
  x: 130,      // 25% from left
  y: 100,      // Where design area starts
  width: 200,  // 50% of canvas width
  height: 300  // Design area height
}

const ELEMENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image'
}

export default function TshirtCanvas({
  textElements,
  imageElements,
  selectedElementId,
  selectedElementType,
  onElementSelect,
  onTextUpdate,
  onImageUpdate,
  onTextDelete,
  onImageDelete,
  isEditingMode
}) {
  const [dragState, setDragState] = useState(null)
  const [resizeState, setResizeState] = useState(null)
  const [rotateState, setRotateState] = useState(null)
  const canvasRef = useRef(null)

  // Calculate blue selection box bounds for text using accurate text measurement
  const getTextSelectionBounds = (element) => {
    // Handle curved text differently
    if (element.isCurved) {
      const curveRadius = element.curveRadius || 100
      
      // Calculate more precise curved text bounds
      let textWidth, textHeight
      
      if (typeof document !== 'undefined') {
        // Create a canvas for text measurement
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Set font properties to match the text element
        ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`
        
        // Measure the actual text width
        const textMetrics = ctx.measureText(element.text)
        textWidth = textMetrics.width
        textHeight = element.fontSize
      } else {
        // Fallback for SSR - use estimation
        const charWidth = element.fontSize * 0.6
        textWidth = element.text.length * charWidth
        textHeight = element.fontSize
      }
      
      // For curved text, create tighter bounds based on actual arc
      // The arc width is roughly the text width, height includes the curve
      const arcHeight = curveRadius * 0.3 // Much smaller than before
      const effectiveWidth = textWidth  // Cap the width
      const effectiveHeight = textHeight
      
      const padding = 8
      const boxWidth = effectiveWidth
      const boxHeight = effectiveHeight
      
      return {
        width: boxWidth,
        height: boxHeight,
        left: element.x - boxWidth / 2,
        right: element.x + boxWidth / 2,
        top: element.y - boxHeight / 2,
        bottom: element.y + boxHeight / 2
      }
    }

    // Regular text measurement
    let textWidth, textHeight
    
    // Check if we're in browser environment (not SSR)
    if (typeof document !== 'undefined') {
      // Create a canvas for text measurement
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set font properties to match the text element
      ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`
      
      // Measure the actual text width
      const textMetrics = ctx.measureText(element.text)
      textWidth = textMetrics.width
      textHeight = element.fontSize
    } else {
      // Fallback for SSR - use estimation
      const charWidth = element.fontSize * 0.8
      textWidth = Math.max(element.text.length * charWidth, element.fontSize)
      textHeight = element.fontSize
    }
    
    // Add small padding for better visual appearance
    const padding = 4
    const boxWidth = textWidth + padding * 2
    const boxHeight = textHeight + padding * 2
    
    return {
      width: boxWidth,
      height: boxHeight,
      left: element.x - boxWidth / 2,
      right: element.x + boxWidth / 2,
      top: element.y - boxHeight / 2,
      bottom: element.y + boxHeight / 2
    }
  }

  // Calculate selection bounds for images
  const getImageSelectionBounds = (element) => {
    const padding = 4
    const boxWidth = element.width + padding * 2
    const boxHeight = element.height + padding * 2
    
    return {
      width: boxWidth,
      height: boxHeight,
      left: element.x - boxWidth / 2,
      right: element.x + boxWidth / 2,
      top: element.y - boxHeight / 2,
      bottom: element.y + boxHeight / 2
    }
  }

  // Check if element is locked
  const isElementLocked = (elementId, elementType) => {
    if (elementType === ELEMENT_TYPES.TEXT) {
      const element = textElements.find(el => el.id === elementId)
      return element?.locked === true  // Only locked if explicitly set to true
    } else {
      const element = imageElements.find(el => el.id === elementId)
      return element?.locked === true  // Only locked if explicitly set to true
    }
  }

  // Handle mouse down for dragging
  const handleMouseDown = (e, elementId, elementType) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Don't allow dragging of locked elements
    if (isElementLocked(elementId, elementType)) {
      onElementSelect(elementId, elementType)
      return
    }
    
    const element = elementType === ELEMENT_TYPES.TEXT 
      ? textElements.find(el => el.id === elementId)
      : imageElements.find(el => el.id === elementId)
    
    if (!element) return

    const rect = canvasRef.current.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top

    setDragState({
      elementId,
      elementType,
      startX,
      startY,
      offsetX: startX - element.x,
      offsetY: startY - element.y
    })

    onElementSelect(elementId, elementType)
  }

  // Handle mouse down for resizing (corner handles)
  const handleResizeMouseDown = (e, elementId, elementType, corner) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Don't allow resizing of locked elements
    if (isElementLocked(elementId, elementType)) {
      return
    }
    
    const element = elementType === ELEMENT_TYPES.TEXT 
      ? textElements.find(el => el.id === elementId)
      : imageElements.find(el => el.id === elementId)
    
    if (!element) return

    const rect = canvasRef.current.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top

    // Calculate initial distance from corner to center
    const initialDistance = Math.sqrt(
      Math.pow(startX - element.x, 2) + Math.pow(startY - element.y, 2)
    )

    setResizeState({
      elementId,
      elementType,
      corner,
      startX,
      startY,
      startFontSize: elementType === ELEMENT_TYPES.TEXT ? element.fontSize : null,
      startWidth: elementType === ELEMENT_TYPES.IMAGE ? element.width : null,
      startHeight: elementType === ELEMENT_TYPES.IMAGE ? element.height : null,
      centerX: element.x,
      centerY: element.y,
      initialDistance
    })

    onElementSelect(elementId, elementType)
  }

  // Handle mouse down for rotation
  const handleRotateMouseDown = (e, elementId, elementType) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Don't allow rotation of locked elements
    if (isElementLocked(elementId, elementType)) {
      return
    }
    
    const element = elementType === ELEMENT_TYPES.TEXT 
      ? textElements.find(el => el.id === elementId)
      : imageElements.find(el => el.id === elementId)
    
    if (!element) return

    const rect = canvasRef.current.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top

    // Calculate initial angle
    const initialAngle = Math.atan2(startY - element.y, startX - element.x) * 180 / Math.PI

    setRotateState({
      elementId,
      elementType,
      centerX: element.x,
      centerY: element.y,
      initialAngle,
      startRotation: element.rotation || 0
    })

    onElementSelect(elementId, elementType)
  }

  // Handle mouse move for dragging, resizing, and rotating
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    // Handle dragging
    if (dragState) {
      const newX = currentX - dragState.offsetX
      const newY = currentY - dragState.offsetY

      // Constrain to design area
      const constrainedX = Math.max(DESIGN_AREA.x, 
        Math.min(newX, DESIGN_AREA.x + DESIGN_AREA.width))
      const constrainedY = Math.max(DESIGN_AREA.y,
        Math.min(newY, DESIGN_AREA.y + DESIGN_AREA.height))

      if (dragState.elementType === ELEMENT_TYPES.TEXT) {
        onTextUpdate(dragState.elementId, {
          x: constrainedX,
          y: constrainedY
        })
      } else {
        onImageUpdate(dragState.elementId, {
          x: constrainedX,
          y: constrainedY
        })
      }
    }

    // Handle resizing
    if (resizeState) {
      // Calculate current distance from mouse to center
      const currentDistance = Math.sqrt(
        Math.pow(currentX - resizeState.centerX, 2) + Math.pow(currentY - resizeState.centerY, 2)
      )
      
      // Determine scale factor based on direction
      const distanceRatio = currentDistance / resizeState.initialDistance
      const scaleFactor = Math.max(0.3, Math.min(3, distanceRatio)) // Constrain between 30% and 300%
      
      if (resizeState.elementType === ELEMENT_TYPES.TEXT) {
        const newFontSize = Math.max(8, Math.min(72, resizeState.startFontSize * scaleFactor))
        onTextUpdate(resizeState.elementId, {
          fontSize: newFontSize
        })
      } else {
        const newWidth = Math.max(20, Math.min(200, resizeState.startWidth * scaleFactor))
        const newHeight = Math.max(20, Math.min(200, resizeState.startHeight * scaleFactor))
        onImageUpdate(resizeState.elementId, {
          width: newWidth,
          height: newHeight
        })
      }
    }

    // Handle rotation
    if (rotateState) {
      const currentAngle = Math.atan2(currentY - rotateState.centerY, currentX - rotateState.centerX) * 180 / Math.PI
      const angleDelta = currentAngle - rotateState.initialAngle
      const newRotation = rotateState.startRotation + angleDelta

      if (rotateState.elementType === ELEMENT_TYPES.TEXT) {
        onTextUpdate(rotateState.elementId, {
          rotation: newRotation
        })
      } else {
        onImageUpdate(rotateState.elementId, {
          rotation: newRotation
        })
      }
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setDragState(null)
    setResizeState(null)
    setRotateState(null)
  }

  // Handle double click to edit text
  const handleDoubleClick = (elementId, elementType) => {
    onElementSelect(elementId, elementType)
  }

  // Handle canvas click (deselect)
  const handleCanvasClick = (e) => {
    // Only deselect if we didn't click on a text or image element
    const isTextElement = e.target.closest('[data-element-type="text"]')
    const isImageElement = e.target.closest('[data-element-type="image"]')
    
    if (!isTextElement && !isImageElement) {
      onElementSelect(null, null)
    }
  }

  // Add event listeners for drag, resize, and rotate
  useEffect(() => {
    if (dragState || resizeState || rotateState) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragState, resizeState, rotateState])

  // Add ESC key to deselect
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (selectedElementId || selectedElementType)) {
        onElementSelect(null, null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedElementId, selectedElementType, onElementSelect])

  // Text style helper
  const getTextStyle = (element) => ({
    position: 'absolute',
    left: element.x,
    top: element.y,
    fontSize: `${element.fontSize}px`,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle,
    textDecoration: element.textDecoration,
    textAlign: element.textAlign,
    letterSpacing: `${element.letterSpacing}px`,
    lineHeight: element.lineHeight,
    transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
    cursor: isEditingMode && !element.locked ? 'move' : element.locked ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    zIndex: selectedElementId === element.id && selectedElementType === ELEMENT_TYPES.TEXT ? 8 : 3,
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    // Add visual indicator for locked elements
    opacity: element.locked ? 0.8 : 1
  })

  // Image style helper
  const getImageStyle = (element) => ({
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
    cursor: isEditingMode && !element.locked ? 'move' : element.locked ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    zIndex: selectedElementId === element.id && selectedElementType === ELEMENT_TYPES.IMAGE ? 10 : 5,
    objectFit: 'contain',
    // Add visual indicator for locked elements
    opacity: element.locked ? 0.8 : 1
  })

  return (
    <div className="relative">
      {/* T-shirt Container */}
      <div 
        ref={canvasRef}
        className="relative rounded-lg overflow-hidden"
        style={{ 
          width: CANVAS_SIZE.width, 
          height: CANVAS_SIZE.height,
          background: 'transparent'
        }}
        onClick={handleCanvasClick}
      >
        {/* T-shirt Background Image */}
        <img
          src="/images/tumbler.png"
          alt="T-shirt"
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />

        {/* Design Area Boundary - Only show when editing */}
        {isEditingMode && (selectedElementId && selectedElementType) && (
          <div
            className="absolute border-2 border-black border-dashed bg-transparent"
            style={{
              left: DESIGN_AREA.x,
              top: DESIGN_AREA.y,
              width: DESIGN_AREA.width,
              height: DESIGN_AREA.height,
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Image Elements */}
        {imageElements.map((element) => {
          const isSelected = selectedElementId === element.id && selectedElementType === ELEMENT_TYPES.IMAGE
          const isLocked = element.locked || false
          const selectionBounds = getImageSelectionBounds(element)
          
          return (
            <div key={element.id} style={{ position: 'relative' }} data-element-type="image">
              {/* Image Element */}
              <img
                src={element.src}
                alt="Uploaded"
                style={getImageStyle(element)}
                onMouseDown={(e) => handleMouseDown(e, element.id, ELEMENT_TYPES.IMAGE)}
                onDoubleClick={() => handleDoubleClick(element.id, ELEMENT_TYPES.IMAGE)}
                className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              />

              {/* Lock indicator for locked elements */}
              {/* {isLocked && (
                <div
                  className="absolute w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center"
                  style={{
                    left: selectionBounds.left - 5,
                    top: selectionBounds.bottom + 5,
                    zIndex: 15
                  }}
                  title="템플릿 요소 (수정 불가)"
                >
                  <Lock size={10} />
                </div>
              )} */}

              {/* Editing Handles - Only show when selected, in editing mode, and NOT locked */}
              {isSelected && isEditingMode && !isLocked && (
                <>
                  {/* Corner Handles */}
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-nw-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.left - 10,
                      top: selectionBounds.top - 10,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, ELEMENT_TYPES.IMAGE, 'top-left')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-ne-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.right,
                      top: selectionBounds.top - 10,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, ELEMENT_TYPES.IMAGE, 'top-right')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-sw-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.left - 10,
                      top: selectionBounds.bottom,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, ELEMENT_TYPES.IMAGE, 'bottom-left')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-se-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.right,
                      top: selectionBounds.bottom,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, ELEMENT_TYPES.IMAGE, 'bottom-right')}
                  />

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onImageDelete(element.id)
                    }}
                    className="absolute w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors hover:scale-110"
                    style={{
                      left: selectionBounds.right + 15,
                      top: selectionBounds.top - 15,
                      zIndex: 15
                    }}
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>

                  {/* Rotation Handle */}
                  <div
                    className="absolute w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-grab active:cursor-grabbing hover:scale-110"
                    style={{
                      left: element.x,
                      top: selectionBounds.top - 25,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 15
                    }}
                    title="Rotate"
                    onMouseDown={(e) => handleRotateMouseDown(e, element.id, ELEMENT_TYPES.IMAGE)}
                  >
                    <RotateCw size={12} />
                  </div>
                </>
              )}
            </div>
          )
        })}

        {/* Text Elements */}
        {textElements.map((element) => {
          const isSelected = selectedElementId === element.id && selectedElementType === ELEMENT_TYPES.TEXT
          const isLocked = element.locked || false
          const selectionBounds = getTextSelectionBounds(element)
          
          return (
            <div key={element.id} style={{ position: 'relative' }} data-element-type="text">
              {/* Text Element - Use CurvedText component */}
              <div
                onMouseDown={(e) => handleMouseDown(e, element.id, ELEMENT_TYPES.TEXT)}
                onDoubleClick={() => handleDoubleClick(element.id, ELEMENT_TYPES.TEXT)}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  cursor: isEditingMode && !element.locked ? 'move' : element.locked ? 'not-allowed' : 'pointer',
                  zIndex: selectedElementId === element.id && selectedElementType === ELEMENT_TYPES.TEXT ? 8 : 3,
                }}
              >
                <CurvedText
                  element={element}
                  isSelected={isSelected}
                  className={`${isSelected ? 'ring-2 ring-blue-500' : ''} ${isLocked ? 'ring-2 ring-amber-400' : ''}`}
                />
              </div>

              {/* Lock indicator for locked elements */}
              {isLocked && (
                <div
                  className="absolute w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center"
                  style={{
                    left: selectionBounds.left - 5,
                    top: selectionBounds.bottom + 5,
                    zIndex: 15
                  }}
                  title="템플릿 요소 (수정 불가)"
                >
                  <Lock size={10} />
                </div>
              )}

              {/* Editing Handles - Only show when selected, in editing mode, and NOT locked */}
              {isSelected && isEditingMode && !isLocked && (
                <>
                  {/* Corner Handles */}
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-nw-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.left - 10,
                      top: selectionBounds.top - 10,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, ELEMENT_TYPES.TEXT, 'top-left')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-ne-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.right,
                      top: selectionBounds.top - 10,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, ELEMENT_TYPES.TEXT, 'top-right')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-sw-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.left - 10,
                      top: selectionBounds.bottom,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, ELEMENT_TYPES.TEXT, 'bottom-left')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-se-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.right,
                      top: selectionBounds.bottom,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, ELEMENT_TYPES.TEXT, 'bottom-right')}
                  />

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onTextDelete(element.id)
                    }}
                    className="absolute w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors hover:scale-110"
                    style={{
                      left: selectionBounds.right + 15,
                      top: selectionBounds.top - 15,
                      zIndex: 15
                    }}
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>

                  {/* Rotation Handle */}
                  <div
                    className="absolute w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-grab active:cursor-grabbing hover:scale-110"
                    style={{
                      left: element.x,
                      top: selectionBounds.top - 25,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 15
                    }}
                    title="Rotate"
                    onMouseDown={(e) => handleRotateMouseDown(e, element.id, ELEMENT_TYPES.TEXT)}
                  >
                    <RotateCw size={12} />
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>텍스트나 이미지를 클릭하여 선택하고 드래그하여 이동하세요</p>
        <p>모서리 핸들: 중앙으로 드래그하면 작게, 바깥으로 드래그하면 크게</p>
        <p>빈 영역 클릭 또는 ESC 키로 선택 해제</p>
      </div>
    </div>
  )
}