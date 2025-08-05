import React, { useState, useRef, useEffect } from 'react'
import { X, Check, RotateCcw, Scissors } from 'lucide-react'

function LassoTool({ isOpen, imageUrl, onClose, onComplete }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [path, setPath] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [originalImageData, setOriginalImageData] = useState(null)
  const [processedImageUrl, setProcessedImageUrl] = useState(null)

  useEffect(() => {
    if (isOpen && imageUrl) {
      loadImageToCanvas()
    }
  }, [isOpen, imageUrl])

  const loadImageToCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Set canvas size to fit image while maintaining aspect ratio
      const maxWidth = 800
      const maxHeight = 600
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
      
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      // Store original image data
      setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height))
    }
    
    img.src = imageUrl
  }

  const getMousePos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const getTouchPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const touch = e.touches[0]
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    setIsComplete(false)
    setPreviewMode(false)
    
    const pos = e.type.includes('touch') ? getTouchPos(e) : getMousePos(e)
    setPath([pos])
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return
    
    const pos = e.type.includes('touch') ? getTouchPos(e) : getMousePos(e)
    const newPath = [...path, pos]
    setPath(newPath)
    
    // Draw the lasso path
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Redraw original image
    ctx.putImageData(originalImageData, 0, 0)
    
    // Draw lasso path
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    
    if (newPath.length > 1) {
      ctx.moveTo(newPath[0].x, newPath[0].y)
      for (let i = 1; i < newPath.length; i++) {
        ctx.lineTo(newPath[i].x, newPath[i].y)
      }
    }
    ctx.stroke()
    
    // Check if we're close to the starting point to complete the path
    if (newPath.length > 10) {
      const start = newPath[0]
      const current = pos
      const distance = Math.sqrt(Math.pow(current.x - start.x, 2) + Math.pow(current.y - start.y, 2))
      
      if (distance < 20) {
        completeSelection()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const completeSelection = () => {
    setIsDrawing(false)
    setIsComplete(true)
    
    // Close the path
    const completePath = [...path, path[0]]
    setPath(completePath)
    
    // Generate preview
    generatePreview(completePath)
  }

  const generatePreview = (completePath) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Create final image with background removed
    const resultCanvas = document.createElement('canvas')
    resultCanvas.width = canvas.width
    resultCanvas.height = canvas.height
    const resultCtx = resultCanvas.getContext('2d')
    
    // Draw original image
    resultCtx.putImageData(originalImageData, 0, 0)
    
    // Apply mask using the lasso path
    resultCtx.globalCompositeOperation = 'destination-in'
    resultCtx.beginPath()
    if (completePath.length > 0) {
      resultCtx.moveTo(completePath[0].x, completePath[0].y)
      for (let i = 1; i < completePath.length; i++) {
        resultCtx.lineTo(completePath[i].x, completePath[i].y)
      }
    }
    resultCtx.closePath()
    resultCtx.fill()
    
    // Get the image data to find bounding box of non-transparent pixels
    const imageData = resultCtx.getImageData(0, 0, resultCanvas.width, resultCanvas.height)
    const data = imageData.data
    
    let minX = resultCanvas.width, minY = resultCanvas.height
    let maxX = 0, maxY = 0
    
    // Find bounding box of non-transparent pixels
    for (let y = 0; y < resultCanvas.height; y++) {
      for (let x = 0; x < resultCanvas.width; x++) {
        const alpha = data[(y * resultCanvas.width + x) * 4 + 3]
        if (alpha > 0) { // Non-transparent pixel
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }
    
    // If we found content, scale it to fill the canvas
    if (minX < maxX && minY < maxY) {
      const cropWidth = maxX - minX + 1
      const cropHeight = maxY - minY + 1
      
      // Create a canvas for the cropped content
      const croppedCanvas = document.createElement('canvas')
      croppedCanvas.width = cropWidth
      croppedCanvas.height = cropHeight
      const croppedCtx = croppedCanvas.getContext('2d')
      
      // Draw the cropped area
      croppedCtx.putImageData(
        resultCtx.getImageData(minX, minY, cropWidth, cropHeight),
        0, 0
      )
      
      // Create final scaled canvas
      const scaledCanvas = document.createElement('canvas')
      scaledCanvas.width = canvas.width
      scaledCanvas.height = canvas.height
      const scaledCtx = scaledCanvas.getContext('2d')
      
      // Apply slight blur for smoother edges
      scaledCtx.filter = 'blur(1px)'
      
      // Scale the cropped content to fill the entire canvas
      scaledCtx.drawImage(
        croppedCanvas,
        0, 0, cropWidth, cropHeight,
        0, 0, canvas.width, canvas.height
      )
      
      // Show preview
      setProcessedImageUrl(scaledCanvas.toDataURL())
    } else {
      // Fallback if no content found
      setProcessedImageUrl(resultCanvas.toDataURL())
    }
    
    setPreviewMode(true)
  }

  const handleConfirm = () => {
    onComplete(processedImageUrl)
    handleClose()
  }

  const handleRedo = () => {
    setPath([])
    setIsComplete(false)
    setPreviewMode(false)
    setProcessedImageUrl(null)
    loadImageToCanvas()
  }

  const handleClose = () => {
    setPath([])
    setIsComplete(false)
    setPreviewMode(false)
    setProcessedImageUrl(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Scissors className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">배경 제거</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Instructions */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-800">
            {!isComplete ? (
              "반려동물 주변을 마우스로 따라 그려주세요. 시작점 근처로 돌아오면 자동으로 완성됩니다."
            ) : previewMode ? (
              "미리보기를 확인하고 확인 또는 다시 시도를 선택해주세요."
            ) : (
              "영역이 선택되었습니다. 미리보기를 보시겠습니까?"
            )}
          </p>
        </div>
        
        {/* Canvas Area */}
        <div className="p-6">
          <div className="flex justify-center">
            {previewMode ? (
              <div className="relative">
                <img 
                  src={processedImageUrl} 
                  alt="미리보기"
                  className="max-w-full max-h-96 rounded-lg shadow-lg"
                  style={{ background: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px' }}
                />
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="border border-gray-300 rounded-lg shadow-lg cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-center space-x-4 p-6 border-t border-gray-200">
          {previewMode ? (
            <>
              <button
                onClick={handleRedo}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다시 시도</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>확인</span>
              </button>
            </>
          ) : isComplete ? (
            <>
              <button
                onClick={handleRedo}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다시 시도</span>
              </button>
              <button
                onClick={() => generatePreview(path)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                <span>미리보기</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LassoTool