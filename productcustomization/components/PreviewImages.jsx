//PreviewImages
import React, { useState } from 'react'
import { Eye, Star, Upload, X, Scissors } from 'lucide-react'
import LassoTool from '@/components/LassoTool'

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

function PreviewImages({ selectedImage, onImageSelect, fileInputRef, handleImageUpload, disabled = false }) {
  const [showLassoTool, setShowLassoTool] = useState(false)
  
  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  // Check if the selected image is a user upload (not from preview dogs)
  const isUserUpload = selectedImage && !PREVIEW_DOGS.some(dog => dog.fullImage === selectedImage)

  const clearUploadedImage = () => {
    if (!disabled) {
      onImageSelect(null)
    }
  }

  const handleRemoveBackground = () => {
    if (!disabled) {
      setShowLassoTool(true)
    }
  }

  const handleLassoComplete = (processedImageUrl) => {
    onImageSelect(processedImageUrl)
    setShowLassoTool(false)
  }

  const handleLassoClose = () => {
    setShowLassoTool(false)
  }

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 ${
      disabled ? 'opacity-50' : ''
    }`}>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Eye className="mr-2" size={20} />
        사진 선택
      </h3>
      
      {/* Upload Section - Primary Action */}
      <div className="mb-6">
        <p className={`text-sm mb-3 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          고객님의 반려동물 사진을 업로드해주세요
        </p>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={disabled}
        />
        
        {/* Upload Button or Uploaded Image Display */}
        {isUserUpload ? (
          <div className="relative">
            {/* Show uploaded image */}
            <div className={`relative rounded-xl overflow-hidden border-2 ring-2 ${
              disabled 
                ? 'border-gray-300 ring-gray-200' 
                : 'border-blue-500 ring-blue-200'
            }`}>
              <img 
                src={selectedImage} 
                alt="업로드된 이미지"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-sm font-medium text-gray-800">업로드된 사진</span>
              </div>
              <div className={`absolute top-2 right-2 rounded-full p-1 ${
                disabled ? 'bg-gray-400' : 'bg-blue-500'
              }`}>
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
            
            {/* Upload actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUploadClick}
                disabled={disabled}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  disabled 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Upload size={16} />
                <span>다른 사진 업로드</span>
              </button>
              <button
                onClick={clearUploadedImage}
                disabled={disabled}
                className={`flex items-center justify-center space-x-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  disabled 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}
              >
                <X size={16} />
                <span>삭제</span>
              </button>
            </div>
            
            {/* Background removal button */}
            <button
              onClick={handleRemoveBackground}
              disabled={disabled}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-200 mt-2 ${
                disabled 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
              }`}
            >
              <Scissors size={16} />
              <span>배경 제거</span>
            </button>
          </div>
        ) : (
          /* Upload Button */
          <button
            onClick={handleUploadClick}
            disabled={disabled}
            className={`w-full flex items-center justify-center space-x-3 py-4 px-6 font-bold rounded-xl transition-colors duration-200 shadow-lg ${
              disabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Upload size={20} />
            <span>반려동물 사진 업로드</span>
          </button>
        )}
      </div>
      
      {/* Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className={`px-2 bg-white ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            또는 예시 사진 선택
          </span>
        </div>
      </div>
      
      {/* Preview Dogs Section - Secondary Options */}
      <p className={`text-sm mb-4 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
        아래 예시 사진으로 미리 체험해보세요
      </p>
      
      <div className="grid grid-cols-3 gap-3">
        {PREVIEW_DOGS.map((dog) => (
          <button
            key={dog.id}
            onClick={() => !disabled && onImageSelect(dog.fullImage)}
            disabled={disabled}
            className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              disabled 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:scale-105'
            } ${
              selectedImage === dog.fullImage && !isUserUpload && !disabled
                ? 'border-pink-500 ring-2 ring-pink-200' 
                : 'border-gray-200 hover:border-pink-300'
            } ${(isUserUpload || disabled) ? 'opacity-50' : ''}`}
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
            <div className={`absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center ${(isUserUpload || disabled) ? 'hidden' : ''}`}>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-xs font-medium text-gray-800">{dog.name}</span>
              </div>
            </div>
            
            {/* Selected indicator */}
            {selectedImage === dog.fullImage && !isUserUpload && !disabled && (
              <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Clear selection button - only show if preview dog is selected and no upload */}
      {selectedImage && !isUserUpload && !disabled && PREVIEW_DOGS.some(dog => dog.fullImage === selectedImage) && (
        <button
          onClick={() => onImageSelect(null)}
          className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
        >
          선택 취소
        </button>
      )}
      
      {/* Disabled message */}
      {disabled && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">알림:</span> 템플릿 모드에서는 이미지 업로드가 비활성화됩니다. 
            템플릿에 적용할 사진 (반려동물 사진)은 아래 "업로드" 버튼을 눌러 추가해주세요. 
          </p>
        </div>
      )}
      
      {/* Lasso Tool Modal - Only show when not disabled */}
      {!disabled && (
        <LassoTool
          isOpen={showLassoTool}
          imageUrl={selectedImage}
          onClose={handleLassoClose}
          onComplete={handleLassoComplete}
        />
      )}
    </div>
  )
}

export default PreviewImages