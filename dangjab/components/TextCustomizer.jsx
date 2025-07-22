import React, { useState } from 'react'
import { Type, Palette, RotateCcw } from 'lucide-react'

const TEXT_COLORS = [
  '#8B4513', // Brown (like in the example)
  '#FF6B35', // Orange
  '#000000', // Black
  '#FFFFFF', // White
  '#FF1744', // Red
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#9C27B0', // Purple
  '#FFD700', // Gold
  '#E91E63', // Pink
]

const FONT_SIZES = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Extra Large', value: 'xl' }
]

function TextCustomizer({ textSettings, onTextChange }) {
  const [showPreview, setShowPreview] = useState(false)

  const handleTextChange = (field, value) => {
    onTextChange({
      ...textSettings,
      [field]: value
    })
  }

  const resetText = () => {
    onTextChange({
      topText: '',
      bottomText: '',
      leftText: '',
      rightText: '',
      textColor: '#8B4513',
      fontSize: 'medium'
    })
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Type className="mr-2" size={20} />
            이름 및 문구 넣기
        </h3>
        <button
          onClick={resetText}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          title="Reset all text"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      

      <div className="space-y-4">
        {/* Top Text (Curved) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이름
          </label>
          <input
            type="text"
            value={textSettings.topText || ''}
            onChange={(e) => handleTextChange('topText', e.target.value)}
            placeholder="예: BBOSIK, MY DOG"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            maxLength={20}
          />
        </div>

        {/* Left and Right Text (Dates) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              왼쪽 날짜
            </label>
            <input
              type="text"
              value={textSettings.leftText || ''}
              onChange={(e) => handleTextChange('leftText', e.target.value)}
              placeholder="2023.05.21"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              maxLength={15}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              오른쪽 날짜
            </label>
            <input
              type="text"
              value={textSettings.rightText || ''}
              onChange={(e) => handleTextChange('rightText', e.target.value)}
              placeholder="2021.02.25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              maxLength={15}
            />
          </div>
        </div>

        {/* Bottom Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            아래 문구
          </label>
          <input
            type="text"
            value={textSettings.bottomText || ''}
            onChange={(e) => handleTextChange('bottomText', e.target.value)}
            placeholder="예: The reasons why I live"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            maxLength={30}
          />
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            글자 색상
          </label>
          <div className="grid grid-cols-5 gap-2">
            {TEXT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleTextChange('textColor', color)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  textSettings.textColor === color 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default TextCustomizer