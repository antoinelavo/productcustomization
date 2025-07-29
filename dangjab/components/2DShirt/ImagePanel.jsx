// @/components/2DShirt/ImagePanel.jsx
'use client'

import React, { useRef } from 'react'
import { Upload, Image, Search } from 'lucide-react'

export default function ImagePanel({ onImageUpload }) {
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageUpload(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStockImageSelect = (imageUrl) => {
    onImageUpload(imageUrl)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">이미지 추가</h2>
        <p className="text-sm text-gray-600 mt-1">이미지를 업로드하거나 선택하세요</p>
      </div>

      {/* Upload Section */}
      <div className="p-6 border-b border-gray-200">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
        >
          <div className="text-center">
            <Upload size={32} className="mx-auto text-gray-400 group-hover:text-blue-500 mb-4" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
              이미지 업로드
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF 파일 지원
            </p>
          </div>
        </button>
      </div>

      {/* Stock Images */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">스톡 이미지</h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search size={16} className="text-gray-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Placeholder stock images */}
            {Array.from({ length: 6 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleStockImageSelect(`https://via.placeholder.com/150x150?text=Image${idx+1}`)}
                className="aspect-square bg-gray-100 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors flex items-center justify-center"
              >
                <Image size={24} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}