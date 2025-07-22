// Much simpler approach using CSS positioning + html2canvas for export
// npm install html2canvas

import React, { useRef, useEffect, useState } from 'react'
import html2canvas from 'html2canvas'

// Hook for generating composite image using CSS approach
export function useCSSCompositeImage(imageUrl, textSettings) {
  const [compositeImage, setCompositeImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const containerRef = useRef()

  useEffect(() => {
    if (!imageUrl) {
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
            scale: 1, // Higher quality
            useCORS: true,
            allowTaint: false
          })
          
          const dataURL = canvas.toDataURL('image/png', 0.9)
          setCompositeImage(dataURL)
        } catch (error) {
          console.error('Failed to generate composite image:', error)
          setCompositeImage(imageUrl) // Fallback to original image
        }
      }
      setIsGenerating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [imageUrl, textSettings])

  return { compositeImage, isGenerating, containerRef }
}

// CSS-based compositor component
function CSSImageCompositor({ imageUrl, textSettings, containerRef }) {
  // Font size mapping
  const fontSizeMap = {
    small: '18px',
    medium: '24px', 
    large: '30px',
    xl: '36px'
  }

  const baseFontSize = fontSizeMap[textSettings.fontSize] || '24px'
  const textColor = textSettings.textColor || '#8B4513'

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
      {/* Top Text - Behind Image */}
      {textSettings.topText && (
        <div
          style={{
            position: 'absolute',
            top: '-70px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: `calc(${baseFontSize} * 13)`,
            color: textColor,
            fontWeight: 'bold',
            textAlign: 'center',
            zIndex: 1, // Behind image
            whiteSpace: 'nowrap'
          }}
        >
          {textSettings.topText.toUpperCase()}
        </div>
      )}

      {/* Dog Image - On Top with Fixed 1:1 Ratio */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Dog"
          style={{
            position: 'absolute',
            top: '300px',
            left: '300px', // Centered: (512 - 300) / 2 = 106
            width: '800px',
            height: '800px', // Fixed 1:1 square ratio
            objectFit: 'cover', // Fills the square, may crop edges
            zIndex: 10 // High z-index to ensure it's on top of ALL text
          }}
          crossOrigin="anonymous"
        />
      )}

      {/* Left Text - Rotated, Behind Image */}
      {textSettings.leftText && (
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            fontSize: `calc(${baseFontSize} * 2)`,
            color: textColor,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            zIndex: 1 // Behind image
          }}
        >
          {textSettings.leftText}
        </div>
      )}

      {/* Right Text - Rotated, Behind Image */}
      {textSettings.rightText && (
        <div
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            fontSize: `calc(${baseFontSize} * 2)`,
            color: textColor,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            zIndex: 1 // Behind image
          }}
        >
          {textSettings.rightText}
        </div>
      )}

      {/* Bottom Text - Behind Image */}
      {textSettings.bottomText && (
        <div
          style={{
            position: 'absolute',
            bottom: '17%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: `calc(${baseFontSize} * 2)`,
            color: textColor,
            fontWeight: 'bold',
            textAlign: 'center',
            zIndex: 1, // Behind image
            whiteSpace: 'nowrap'
          }}
        >
          {textSettings.bottomText}
        </div>
      )}
    </div>
  )
}

// Alternative: Simple implementation without html2canvas (if you want to avoid dependencies)
export function createSimpleCompositeImage(imageUrl, textSettings) {
  return new Promise((resolve) => {
    // For now, just return the original image
    // This is a fallback if html2canvas doesn't work
    resolve(imageUrl)
  })
}

// Drop-in replacement for your current hook
export function useCompositeImage(imageUrl, textSettings) {
  const { compositeImage, isGenerating, containerRef } = useCSSCompositeImage(imageUrl, textSettings)
  
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