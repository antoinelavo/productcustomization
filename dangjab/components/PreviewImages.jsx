import React from 'react'
import { Eye, Star } from 'lucide-react'

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

function PreviewImages({ selectedImage, onImageSelect }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Eye className="mr-2" size={20} />
        사진 미리보기
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">
        아래 예시 사진 중 하나를 고르면 티셔츠에서 직접 보실 수 있습니다! <br></br><br></br>(나중에는 사용자가 직접 사진을 업로드 할 수 있게 할 계획입니다.)
      </p>
      
      <div className="grid grid-cols-3 gap-3">
        {PREVIEW_DOGS.map((dog) => (
          <button
            key={dog.id}
            onClick={() => onImageSelect(dog.fullImage)}
            className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
              selectedImage === dog.fullImage
                ? 'border-pink-500 ring-2 ring-pink-200' 
                : 'border-gray-200 hover:border-pink-300'
            }`}
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
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-xs font-medium text-gray-800">{dog.name}</span>
              </div>
            </div>
            
            {/* Selected indicator */}
            {selectedImage === dog.fullImage && (
              <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Clear selection button */}
      {selectedImage && PREVIEW_DOGS.some(dog => dog.fullImage === selectedImage) && (
        <button
          onClick={() => onImageSelect(null)}
          className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
        >
          초기화하기
        </button>
      )}
    </div>
  )
}

export default PreviewImages