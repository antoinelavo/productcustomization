
import { writePsd } from 'ag-psd'
import React, { useCallback } from 'react'

export function useCSSBasedPSDGenerator() {
  
  // Helper function to convert canvas to ImageData
  const canvasToImageData = useCallback((canvas) => {
    const ctx = canvas.getContext('2d')
    return ctx.getImageData(0, 0, canvas.width, canvas.height)
  }, [])

  // Create text layer that matches your CSS exactly
  const createTextLayer = useCallback((text, cssStyle, containerWidth = 1400, containerHeight = 1400) => {
    const canvas = document.createElement('canvas')
    canvas.width = containerWidth
    canvas.height = containerHeight
    const ctx = canvas.getContext('2d')
    
    // Clear with transparent background
    ctx.clearRect(0, 0, containerWidth, containerHeight)
    
    // Parse CSS font size - handle calc() expressions
    let fontSize = 24 // default
    if (cssStyle.fontSize) {
      if (cssStyle.fontSize.includes('calc(')) {
        // Extract the calculation from calc(24px * 13) format
        const match = cssStyle.fontSize.match(/calc\((\d+)px \* (\d+)\)/)
        if (match) {
          fontSize = parseInt(match[1]) * parseInt(match[2])
        }
      } else {
        fontSize = parseInt(cssStyle.fontSize.replace('px', ''))
      }
    }
    
    // Set font properties to match CSS
    ctx.font = `bold ${fontSize}px Arial, sans-serif`
    ctx.fillStyle = cssStyle.color || '#8B4513'
    ctx.textAlign = cssStyle.textAlign || 'left'
    ctx.textBaseline = 'top'
    
    // Add text stroke for better visibility
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    ctx.lineWidth = 1
    
    // Calculate position based on CSS positioning
    let x = 0, y = 0
    
    if (cssStyle.textAlign === 'center') {
      x = containerWidth / 2
      ctx.textAlign = 'center'
    } else if (cssStyle.right) {
      x = containerWidth - parseInt(cssStyle.right.replace('px', ''))
      ctx.textAlign = 'right'
    } else if (cssStyle.left) {
      x = parseInt(cssStyle.left.replace('px', ''))
    }
    
    if (cssStyle.top) {
      if (cssStyle.top.includes('%')) {
        y = (containerHeight * parseInt(cssStyle.top.replace('%', ''))) / 100
      } else {
        y = parseInt(cssStyle.top.replace('px', ''))
      }
    } else if (cssStyle.bottom) {
      if (cssStyle.bottom.includes('%')) {
        y = containerHeight - (containerHeight * parseInt(cssStyle.bottom.replace('%', ''))) / 100
      } else {
        y = containerHeight - parseInt(cssStyle.bottom.replace('px', ''))
      }
    }
    
    // Adjust for middle baseline if needed
    if (cssStyle.top === '50%') {
      ctx.textBaseline = 'middle'
    }
    
    console.log(`Drawing text "${text}" at position (${x}, ${y}) with font size ${fontSize}px`)
    
    // Draw text
    ctx.strokeText(text, x, y)
    ctx.fillText(text, x, y)
    
    return canvas
  }, [])

  // Load image as canvas with exact CSS dimensions
  const loadImageAsCanvas = useCallback((imageUrl, cssStyle) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        // Use exact dimensions from CSS
        const width = parseInt(cssStyle.width.replace('px', '')) || 800
        const height = parseInt(cssStyle.height.replace('px', '')) || 800
        
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        // Clear canvas first
        ctx.clearRect(0, 0, width, height)
        
        // Draw image with object-fit: cover behavior
        const imgAspect = img.width / img.height
        const canvasAspect = width / height
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0
        
        if (imgAspect > canvasAspect) {
          // Image is wider - fit height, crop width
          drawHeight = height
          drawWidth = height * imgAspect
          offsetX = (width - drawWidth) / 2
        } else {
          // Image is taller - fit width, crop height
          drawWidth = width
          drawHeight = width / imgAspect
          offsetY = (height - drawHeight) / 2
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
        
        console.log(`Created image canvas ${width}x${height}`)
        resolve(canvas)
      }
      
      img.onerror = (error) => {
        console.error('Failed to load image:', error)
        reject(error)
      }
      
      img.src = imageUrl
    })
  }, [])

  // Main PSD generation function that mirrors your CSS
  const generatePSDFromCSS = useCallback(async (imageUrl, textSettings) => {
    try {
      console.log('Starting CSS-based PSD generation...')
      console.log('Image URL:', imageUrl)
      console.log('Text settings:', textSettings)
      
      const layers = []
      const psdWidth = 1400
      const psdHeight = 1400

      // Font size mapping from your CSS
      const fontSizeMap = {
        small: '18px',
        medium: '24px', 
        large: '30px',
        xl: '36px'
      }
      const baseFontSize = fontSizeMap[textSettings.fontSize] || '24px'
      const textColor = textSettings.textColor || '#8B4513'

      // Create layers in the same order as your CSS (background to foreground)

      // 1. Top Text Layer (behind image, z-index: 1)
      if (textSettings.topText && textSettings.topText.trim()) {
        console.log('Creating top text layer...')
        const topTextCanvas = createTextLayer(
          textSettings.topText.toUpperCase(),
          {
            fontSize: `calc(${baseFontSize} * 13)`, // matches your CSS
            color: textColor,
            textAlign: 'center',
            top: '-70px', // matches your CSS
            left: '50%'
          },
          psdWidth,
          psdHeight
        )
        const topTextImageData = canvasToImageData(topTextCanvas)
        layers.push({
          name: 'Top Text',
          opacity: 255,
          blendMode: 'normal',
          left: 0,
          top: 0,
          right: psdWidth,
          bottom: psdHeight,
          canvas: topTextCanvas,
          imageData: topTextImageData
        })
        console.log('Top text layer added')
      }

      // 2. Left Text Layer (behind image, z-index: 1)
      if (textSettings.leftText && textSettings.leftText.trim()) {
        console.log('Creating left text layer...')
        const leftTextCanvas = createTextLayer(
          textSettings.leftText,
          {
            fontSize: `calc(${baseFontSize} * 2)`, // matches your CSS
            color: textColor,
            left: '20px', // matches your CSS
            top: '50%'
          },
          psdWidth,
          psdHeight
        )
        const leftTextImageData = canvasToImageData(leftTextCanvas)
        layers.push({
          name: 'Left Text',
          opacity: 255,
          blendMode: 'normal',
          left: 0,
          top: 0,
          right: psdWidth,
          bottom: psdHeight,
          canvas: leftTextCanvas,
          imageData: leftTextImageData
        })
        console.log('Left text layer added')
      }

      // 3. Right Text Layer (behind image, z-index: 1)
      if (textSettings.rightText && textSettings.rightText.trim()) {
        console.log('Creating right text layer...')
        const rightTextCanvas = createTextLayer(
          textSettings.rightText,
          {
            fontSize: `calc(${baseFontSize} * 2)`, // matches your CSS
            color: textColor,
            right: '20px', // matches your CSS
            top: '50%'
          },
          psdWidth,
          psdHeight
        )
        const rightTextImageData = canvasToImageData(rightTextCanvas)
        layers.push({
          name: 'Right Text',
          opacity: 255,
          blendMode: 'normal',
          left: 0,
          top: 0,
          right: psdWidth,
          bottom: psdHeight,
          canvas: rightTextCanvas,
          imageData: rightTextImageData
        })
        console.log('Right text layer added')
      }

      // 4. Bottom Text Layer (behind image, z-index: 1)
      if (textSettings.bottomText && textSettings.bottomText.trim()) {
        console.log('Creating bottom text layer...')
        const bottomTextCanvas = createTextLayer(
          textSettings.bottomText,
          {
            fontSize: `calc(${baseFontSize} * 2)`, // matches your CSS
            color: textColor,
            textAlign: 'center',
            bottom: '17%', // matches your CSS
            left: '50%'
          },
          psdWidth,
          psdHeight
        )
        const bottomTextImageData = canvasToImageData(bottomTextCanvas)
        layers.push({
          name: 'Bottom Text',
          opacity: 255,
          blendMode: 'normal',
          left: 0,
          top: 0,
          right: psdWidth,
          bottom: psdHeight,
          canvas: bottomTextCanvas,
          imageData: bottomTextImageData
        })
        console.log('Bottom text layer added')
      }

      // 5. Dog Image Layer (on top, z-index: 10)
      if (imageUrl) {
        try {
          console.log('Loading image...')
          const imageCanvas = await loadImageAsCanvas(imageUrl, {
            width: '800px', // matches your CSS
            height: '800px', // matches your CSS
            objectFit: 'cover'
          })
          
          // Create a full-size canvas and position the image
          const fullImageCanvas = document.createElement('canvas')
          fullImageCanvas.width = psdWidth
          fullImageCanvas.height = psdHeight
          const fullImageCtx = fullImageCanvas.getContext('2d')
          
          // Position image at top: 300px, left: 300px (matches your CSS)
          fullImageCtx.drawImage(imageCanvas, 300, 300)
          
          const imageData = canvasToImageData(fullImageCanvas)
          layers.push({
            name: 'Dog Image',
            opacity: 255,
            blendMode: 'normal',
            left: 0,
            top: 0,
            right: psdWidth,
            bottom: psdHeight,
            canvas: fullImageCanvas,
            imageData: imageData
          })
          console.log('Image layer added')
        } catch (error) {
          console.warn('Failed to load image for PSD:', error)
        }
      }

      console.log(`Total layers created: ${layers.length}`)

      // Create composite canvas
      const compositeCanvas = document.createElement('canvas')
      compositeCanvas.width = psdWidth
      compositeCanvas.height = psdHeight
      const compositeCtx = compositeCanvas.getContext('2d')
      
      // Fill with transparent background
      compositeCtx.clearRect(0, 0, psdWidth, psdHeight)

      // Create PSD structure
      const psd = {
        width: psdWidth,
        height: psdHeight,
        channels: 4, // RGBA for transparency
        bitsPerChannel: 8,
        colorMode: 3, // RGB color mode
        layers: layers,
        canvas: compositeCanvas
      }

      console.log('Generating PSD buffer...')
      const buffer = writePsd(psd)
      
      console.log('PSD buffer created, size:', buffer.byteLength)
      
      // Create and trigger download
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'custom-tshirt-design-layered.psd'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log('PSD download completed!')
      return true
    } catch (error) {
      console.error('Failed to generate PSD:', error)
      console.error('Error details:', error.stack)
      return false
    }
  }, [createTextLayer, loadImageAsCanvas, canvasToImageData])

  return { generatePSDFromCSS }
}

// Updated hook to replace your existing PSD generator
export function usePSDGenerator() {
  const { generatePSDFromCSS } = useCSSBasedPSDGenerator()
  
  return {
    generatePSD: generatePSDFromCSS
  }
}