// @/components/ImageTextCompositor.jsx - Updated for hybrid approach
'use client'

import React, { useRef, useEffect, useState } from 'react'
import html2canvas from 'html2canvas'

// Hook for generating composite image using the hybrid text structure
export function useCompositeImage(imageUrl, textSettings) {
  const [compositeImage, setCompositeImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const containerRef = useRef()

  useEffect(() => {
    const hasImage = imageUrl
    const hasTraditionalText = textSettings?.topText || textSettings?.bottomText || 
                              textSettings?.leftText || textSettings?.rightText
    const hasCustomText = textSettings?.customElements && textSettings.customElements.length > 0
    
    if (!hasImage && !hasTraditionalText && !hasCustomText) {
      setCompositeImage(null)
      return
    }

    setIsGenerating(true)

    // Small delay to ensure images are loaded
    const timer = setTimeout(async () => {
      if (containerRef.current) {
        try {
          const canvas = await html2canvas(containerRef.current, {
            backgroundColor: null,
            scale: 1,
            useCORS: true,
            allowTaint: false
          })
          
          const dataURL = canvas.toDataURL('image/png', 0.9)
          setCompositeImage(dataURL)
        } catch (error) {
          console.error('Failed to generate composite image:', error)
          setCompositeImage(imageUrl || null)
        }
      }
      setIsGenerating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [imageUrl, textSettings])

  return { compositeImage, isGenerating, containerRef }
}

// Updated CSS-based compositor component for hybrid approach
function CSSImageCompositor({ imageUrl, textSettings, containerRef }) {
  
  const getFontSize = (size) => {
    const fontSizeMap = {
      small: '18px',
      medium: '24px', 
      large: '30px',
      xl: '36px'
    }
    return fontSizeMap[size] || '24px'
  }

  // Get traditional text positions (with fallbacks)
  const getTraditionalTextPositions = () => {
    const defaults = {
      topText: { x: 700, y: 200 },
      bottomText: { x: 700, y: 1200 },
      leftText: { x: 100, y: 700 },
      rightText: { x: 1300, y: 700 }
    }
    
    return {
      ...defaults,
      ...textSettings?.textPositions
    }
  }

  const traditionalPositions = getTraditionalTextPositions()

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '1400px',
        height: '1400px',
        backgroundColor: 'transparent',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold'
      }}
    >
      {/* Background Image - Fixed position and size */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Design"
          style={{
            position: 'absolute',
            top: '300px',
            left: '300px',
            width: '800px',
            height: '800px',
            objectFit: 'cover',
            zIndex: 10 // High z-index to ensure it's on top of text
          }}
          crossOrigin="anonymous"
        />
      )}

      {/* Traditional Text Elements */}
      {['topText', 'bottomText', 'leftText', 'rightText'].map((textKey) => {
        const text = textSettings?.[textKey]
        if (!text || !text.trim()) return null
        
        const position = traditionalPositions[textKey]
        
        return (
          <div
            key={textKey}
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              fontSize: getFontSize(textSettings?.fontSize),
              color: textSettings?.textColor || '#8B4513',
              fontWeight: 'bold',
              fontFamily: textSettings?.fontFamily || 'Arial, sans-serif',
              whiteSpace: 'nowrap',
              zIndex: 1, // Behind image
              transform: 'translate(-50%, -50%)', // Center text on coordinates
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)' // White outline for visibility
            }}
          >
            {text.toUpperCase()}
          </div>
        )
      })}

      {/* Custom Text Elements */}
      {textSettings?.customElements?.map((element) => (
        <div
          key={element.id}
          style={{
            position: 'absolute',
            left: element.x,
            top: element.y,
            fontSize: getFontSize(element.fontSize),
            color: element.color,
            fontWeight: 'bold',
            fontFamily: element.fontFamily || 'Arial, sans-serif',
            whiteSpace: 'nowrap',
            zIndex: 1, // Behind image
            transform: 'translate(-50%, -50%)', // Center text on coordinates
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)' // White outline for visibility
          }}
        >
          {element.text}
        </div>
      ))}
    </div>
  )
}

// Drop-in replacement for your current hook
export function useCompositeImageWithElements(imageUrl, textSettings) {
  const { compositeImage, isGenerating, containerRef } = useCompositeImage(imageUrl, textSettings)
  
  return {
    compositeImage,
    isGenerating,
    // Render the hidden compositor
    CompositorComponent: () => (
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <CSSImageCompositor
          imageUrl={imageUrl}
          textSettings={textSettings}
          containerRef={containerRef}
        />
      </div>
    )
  }
}

export default CSSImageCompositor