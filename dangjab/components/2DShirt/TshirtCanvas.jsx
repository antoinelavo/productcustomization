// @/components/2DShirt/TshirtCanvas.jsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Trash2, RotateCw } from 'lucide-react'

const CANVAS_SIZE = {
  width: 500,
  height: 600
}

const DESIGN_AREA = {
  x: 125,      // 25% from left
  y: 150,      // Where design area starts
  width: 250,  // 50% of canvas width
  height: 300  // Design area height
}

export default function TshirtCanvas({
  textElements,
  selectedElementId,
  backgroundImage,
  onTextSelect,
  onTextUpdate,
  onTextDelete,
  isEditingMode
}) {
  const [dragState, setDragState] = useState(null)
  const [resizeState, setResizeState] = useState(null)
  const [rotateState, setRotateState] = useState(null)
  const canvasRef = useRef(null)

  // Calculate blue selection box bounds (includes padding around text)
    const getSelectionBounds = (element) => {
    const textLength = element.text.length
    const fontSize = element.fontSize
    
    // Estimate text dimensions with padding for the blue selection box
    const charWidth = fontSize * 0.8 // Fixed and increased from 0.6 to 0.8
    const textWidth = Math.max(textLength * charWidth, fontSize) // Minimum width = font size
    const textHeight = fontSize // Increased from 1.2 to 1.4 for better coverage
    
    // Add some padding to ensure full text coverage
    const padding = 0
    const boxWidth = textWidth
    const boxHeight = textHeight
    
    return {
        width: boxWidth,
        height: boxHeight,
        left: element.x - boxWidth / 2,
        right: element.x + boxWidth / 2,
        top: element.y - boxHeight / 2,
        bottom: element.y + boxHeight / 2
    }
    }

  // Handle mouse down for dragging text
  const handleMouseDown = (e, elementId) => {
    e.preventDefault()
    e.stopPropagation()
    
    const element = textElements.find(el => el.id === elementId)
    if (!element) return

    const rect = canvasRef.current.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top

    setDragState({
      elementId,
      startX,
      startY,
      offsetX: startX - element.x,
      offsetY: startY - element.y
    })

    onTextSelect(elementId)
  }

  // Handle mouse down for resizing (corner handles)
  const handleResizeMouseDown = (e, elementId, corner) => {
    e.preventDefault()
    e.stopPropagation()
    
    const element = textElements.find(el => el.id === elementId)
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
      corner,
      startX,
      startY,
      startFontSize: element.fontSize,
      centerX: element.x,
      centerY: element.y,
      initialDistance
    })

    onTextSelect(elementId)
  }

  // Handle mouse down for rotation
  const handleRotateMouseDown = (e, elementId) => {
    e.preventDefault()
    e.stopPropagation()
    
    const element = textElements.find(el => el.id === elementId)
    if (!element) return

    const rect = canvasRef.current.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top

    // Calculate initial angle
    const initialAngle = Math.atan2(startY - element.y, startX - element.x) * 180 / Math.PI

    setRotateState({
      elementId,
      centerX: element.x,
      centerY: element.y,
      initialAngle,
      startRotation: element.rotation || 0
    })

    onTextSelect(elementId)
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    // Handle text dragging
    if (dragState) {
      const newX = currentX - dragState.offsetX
      const newY = currentY - dragState.offsetY

      // Constrain to design area
      const constrainedX = Math.max(DESIGN_AREA.x, 
        Math.min(newX, DESIGN_AREA.x + DESIGN_AREA.width))
      const constrainedY = Math.max(DESIGN_AREA.y,
        Math.min(newY, DESIGN_AREA.y + DESIGN_AREA.height))

      onTextUpdate(dragState.elementId, {
        x: constrainedX,
        y: constrainedY
      })
    }

    // Handle resizing
    if (resizeState) {
      // Calculate current distance from mouse to center
      const currentDistance = Math.sqrt(
        Math.pow(currentX - resizeState.centerX, 2) + Math.pow(currentY - resizeState.centerY, 2)
      )
      
      // Determine scale factor based on direction
      // If current distance > initial distance = moving away from center = larger
      // If current distance < initial distance = moving towards center = smaller
      const distanceRatio = currentDistance / resizeState.initialDistance
      const scaleFactor = Math.max(0.3, Math.min(3, distanceRatio)) // Constrain between 30% and 300%
      
      const newFontSize = Math.max(8, Math.min(72, resizeState.startFontSize * scaleFactor))
      
      onTextUpdate(resizeState.elementId, {
        fontSize: newFontSize
      })
    }

    // Handle rotation
    if (rotateState) {
      const currentAngle = Math.atan2(currentY - rotateState.centerY, currentX - rotateState.centerX) * 180 / Math.PI
      const angleDelta = currentAngle - rotateState.initialAngle
      const newRotation = rotateState.startRotation + angleDelta

      onTextUpdate(rotateState.elementId, {
        rotation: newRotation
      })
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setDragState(null)
    setResizeState(null)
    setRotateState(null)
  }

  // Handle double click to edit text
  const handleDoubleClick = (elementId) => {
    onTextSelect(elementId)
  }

  // Handle canvas click (deselect)
  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      onTextSelect(null)
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
    cursor: isEditingMode ? 'move' : 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    zIndex: selectedElementId === element.id ? 10 : 5,
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  })

  return (
    <div className="relative">
      {/* T-shirt Container - Just the image, no background */}
      <div 
        ref={canvasRef}
        className="relative rounded-lg overflow-hidden"
        style={{ 
          width: CANVAS_SIZE.width, 
          height: CANVAS_SIZE.height,
          background: 'white'
        }}
        onClick={handleCanvasClick}
      >
        {/* T-shirt Background Image - This should be your actual t-shirt image */}
        <img
          src="/images/tshirt.png" // Replace with your t-shirt image URL
          alt="T-shirt"
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            backgroundImage: 'url("")', // Fallback or placeholder
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />

        {/* Design Area Boundary - Only show when editing */}
        {isEditingMode && (
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

        {/* Background Image Layer */}
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Background"
            className="absolute object-contain"
            style={{
              left: DESIGN_AREA.x,
              top: DESIGN_AREA.y,
              width: DESIGN_AREA.width,
              height: DESIGN_AREA.height,
              zIndex: 1
            }}
          />
        )}

        {/* Text Elements */}
        {textElements.map((element) => {
          const isSelected = selectedElementId === element.id
          const selectionBounds = getSelectionBounds(element)
          
          return (
            <div key={element.id} style={{ position: 'relative' }}>
              {/* Text Element */}
              <div
                style={getTextStyle(element)}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onDoubleClick={() => handleDoubleClick(element.id)}
                className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              >
                {element.text}
              </div>

              {/* Editing Handles - Only show when selected and in editing mode */}
              {isSelected && isEditingMode && (
                <>
                    {/* Selection Area Visualization */}
                    {/* <div
                    className="absolute border-2 border-red-500 bg-red-100 bg-opacity-20 pointer-events-none"
                    style={{
                        left: selectionBounds.left,
                        top: selectionBounds.top,
                        width: selectionBounds.width,
                        height: selectionBounds.height,
                        zIndex: 14
                    }}
                    /> */}

                  {/* Corner Handles - Positioned at blue selection box corners */}
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-nw-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.left - 10,
                      top: selectionBounds.top - 10,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'top-left')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-ne-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.right,
                      top: selectionBounds.top - 10,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'top-right')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-sw-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.left - 10,
                      top: selectionBounds.bottom,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'bottom-left')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white cursor-se-resize hover:scale-150 transition-transform"
                    style={{
                      left: selectionBounds.right,
                      top: selectionBounds.bottom,
                      zIndex: 15
                    }}
                    title="Resize"
                    onMouseDown={(e) => handleResizeMouseDown(e, element.id, 'bottom-right')}
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
                    onMouseDown={(e) => handleRotateMouseDown(e, element.id)}
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
        <p>텍스트를 클릭하여 선택하고 드래그하여 이동하세요</p>
        <p>모서리 핸들: 중앙으로 드래그하면 작게, 바깥으로 드래그하면 크게</p>
      </div>
    </div>
  )
}