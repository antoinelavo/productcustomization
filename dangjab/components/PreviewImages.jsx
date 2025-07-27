import React, { useState } from 'react'
import { Eye, Star, Upload, X, Scissors, Loader2, AlertCircle } from 'lucide-react'
import LassoTool from '@/components/LassoTool'
import { uploadImageToStorage } from '@/lib/supabaseStorage'

// Sample dog images for preview - you can replace these with your actual image URLs
const PREVIEW_DOGS = [
  {
    id: 'golden_retriever',
    name: '골든 리트리버',
    thumbnail: '/dogs/golden_retriever_thumb.png',
    fullImage: '/dogs/golden_retriever.png'
  },
  {
    id: 'husky',
    name: '허스키',
    thumbnail: '/dogs/husky_thumb.png', 
    fullImage: '/dogs/husky.png'
  },
  {
    id: 'pomeranian',
    name: '포메라니안',
    thumbnail: '/dogs/pomeranian.png',
    fullImage: '/dogs/pomeranian.png'
  }
]

function PreviewImages({ 
  selectedImage, 
  onImageSelect, 
  fileInputRef, 
  handleImageUpload,
  uploadState = { isUploading: false, uploadError: null }
}) {
  const [showLassoTool, setShowLassoTool] = useState(false)
  const [localUploadState, setLocalUploadState] = useState({
    isUploading: false,
    uploadError: null
  })

  // Use either passed uploadState or local state
  const currentUploadState = uploadState.isUploading !== undefined ? uploadState : localUploadState
  
  const handleUploadClick = () => {
    if (!currentUploadState.isUploading) {
      fileInputRef.current?.click()
    }
  }

  // Enhanced upload handler with Supabase storage
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset upload state
    setLocalUploadState({ isUploading: true, uploadError: null })

    try {
      console.log('📤 Starting image upload:', file.name);

      // Upload to Supabase Storage
      const { url, error } = await uploadImageToStorage(file)

      if (error) {
        console.error('❌ Upload failed:', error);
        setLocalUploadState({ isUploading: false, uploadError: error })
        return
      }

      if (url) {
        console.log('✅ Upload successful, URL:', url);
        onImageSelect(url)
        setLocalUploadState({ isUploading: false, uploadError: null })
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      setLocalUploadState({ 
        isUploading: false, 
        uploadError: 'Upload failed. Please try again.' 
      })
    }

    // Clear the file input so the same file can be uploaded again if needed
    if (event.target) {
      event.target.value = ''
    }
  }

  // Check if the selected image is a user upload (not from preview dogs)
  const isUserUpload = selectedImage && !PREVIEW_DOGS.some(dog => dog.fullImage === selectedImage)

  const clearUploadedImage = () => {
    onImageSelect(null)
    // Clear any upload errors when clearing image
    setLocalUploadState(prev => ({ ...prev, uploadError: null }))
  }

  const handleRemoveBackground = () => {
    setShowLassoTool(true)
  }

  const handleLassoComplete = (processedImageUrl) => {
    onImageSelect(processedImageUrl)
    setShowLassoTool(false)
  }

  const handleLassoClose = () => {
    setShowLassoTool(false)
  }

  const handlePreviewSelect = (imageUrl) => {
    onImageSelect(imageUrl)
    // Clear any upload errors when selecting a preview image
    setLocalUploadState(prev => ({ ...prev, uploadError: null }))
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Eye className="mr-2" size={20} />
        사진 선택
      </h3>
      
      {/* Upload Section - Primary Action */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">
          고객님의 반려동물 사진을 업로드해주세요
        </p>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={currentUploadState.isUploading}
        />
        
        {/* Upload Button or Uploaded Image Display */}
        {currentUploadState.isUploading ? (
          /* Upload Progress */
          <div className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold rounded-xl">
            <Loader2 size={20} className="animate-spin" />
            <span>업로드 중...</span>
          </div>
        ) : isUserUpload ? (
          <div className="relative">
            {/* Show uploaded image */}
            <div className="relative rounded-xl overflow-hidden border-2 border-blue-500 ring-2 ring-blue-200">
              <img 
                src={selectedImage} 
                alt="업로드된 이미지"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NiA2NEgxMTZWNzZINzZWNjRaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMTYgNzZIMTI4VjExNkgxMTZWNzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMTYgMTE2SDc2VjEyOEgxMTZWMTE2WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNzYgMTE2SDY0Vjc2SDc2VjExNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-sm font-medium text-gray-800">
                  {selectedImage.includes('supabase') ? '업로드된 사진' : '업로드된 사진'}
                </span>
              </div>
              <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
            
            {/* Upload actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUploadClick}
                disabled={currentUploadState.isUploading}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <Upload size={16} />
                <span>다른 사진 업로드</span>
              </button>
              <button
                onClick={clearUploadedImage}
                disabled={currentUploadState.isUploading}
                className="flex items-center justify-center space-x-2 py-2 px-4 bg-red-100 hover:bg-red-200 disabled:bg-red-50 disabled:cursor-not-allowed text-red-700 text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <X size={16} />
                <span>삭제</span>
              </button>
            </div>
            
            {/* Background removal button */}
            <button
              onClick={handleRemoveBackground}
              disabled={currentUploadState.isUploading}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:cursor-not-allowed text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200 mt-2"
            >
              <Scissors size={16} />
              <span>배경 제거</span>
            </button>
          </div>
        ) : (
          /* Upload Button */
          <button
            onClick={handleUploadClick}
            disabled={currentUploadState.isUploading}
            className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors duration-200 shadow-lg"
          >
            <Upload size={20} />
            <span>반려동물 사진 업로드</span>
          </button>
        )}

        {/* Upload Error Display */}
        {currentUploadState.uploadError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">업로드 실패</p>
                <p className="text-sm text-red-600">{currentUploadState.uploadError}</p>
                <button
                  onClick={handleUploadClick}
                  className="text-sm text-red-700 underline hover:text-red-800 mt-1"
                >
                  다시 시도
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success indicator for uploaded images */}
        {isUserUpload && !currentUploadState.isUploading && !currentUploadState.uploadError && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">업로드 완료!</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는 예시 사진 선택</span>
        </div>
      </div>
      
      {/* Preview Dogs Section - Secondary Options */}
      <p className="text-sm text-gray-600 mb-4">
        아래 예시 사진으로 미리 체험해보세요
      </p>
      
      <div className="grid grid-cols-3 gap-3">
        {PREVIEW_DOGS.map((dog) => (
          <button
            key={dog.id}
            onClick={() => handlePreviewSelect(dog.fullImage)}
            disabled={currentUploadState.isUploading}
            className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
              selectedImage === dog.fullImage && !isUserUpload
                ? 'border-pink-500 ring-2 ring-pink-200' 
                : 'border-gray-200 hover:border-pink-300'
            } ${isUserUpload || currentUploadState.isUploading ? 'opacity-50' : ''}`}
          >
            {/* Image */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <img 
                src={dog.thumbnail} 
                alt={dog.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              {/* Fallback placeholder */}
              <div className="hidden w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 items-center justify-center">
                <span className="text-2xl">🐕</span>
              </div>
            </div>
            
            {/* Overlay on hover */}
            <div className={`absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center ${isUserUpload || currentUploadState.isUploading ? 'hidden' : ''}`}>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-xs font-medium text-gray-800">{dog.name}</span>
              </div>
            </div>
            
            {/* Selected indicator */}
            {selectedImage === dog.fullImage && !isUserUpload && (
              <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Clear selection button - only show if preview dog is selected and no upload */}
      {selectedImage && !isUserUpload && PREVIEW_DOGS.some(dog => dog.fullImage === selectedImage) && !currentUploadState.isUploading && (
        <button
          onClick={() => handlePreviewSelect(null)}
          className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
        >
          선택 취소
        </button>
      )}
      
      {/* Lasso Tool Modal */}
      <LassoTool
        isOpen={showLassoTool}
        imageUrl={selectedImage}
        onClose={handleLassoClose}
        onComplete={handleLassoComplete}
      />
    </div>
  )
}

export default PreviewImages