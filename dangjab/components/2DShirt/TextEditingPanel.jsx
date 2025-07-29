// @/components/2DShirt/TextEditingPanel.jsx
'use client'

import React, { useState } from 'react'
import { 
  X, 
  Trash2, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Link
} from 'lucide-react'

const FONT_FAMILIES = [
  { value: '나눔 명조', label: '나눔 명조' },
  { value: '나눔 고딕', label: '나눔 고딕' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' }
]

const TEXT_COLORS = [
  // Row 1
  ['#1a237e', '#7b1fa2', '#2e7d32', '#000000', '#ffffff', '#29b6f6', '#ff9800', '#ffeb3b', '#f8bbd9', '#e1bee7', '#8d6e63'],
  // Row 2  
  ['#c5cae9', '#f3e5f5', '#388e3c', '#ffeb3b', '#e91e63', '#4caf50', '#9e9e9e', '#f8bbd9', '#3f51b5', '#d32f2f', '#e1f5fe'],
  // Row 3
  ['#eeeeee', '#d4af37', '#c0ff8c', '#e91e63', '#4caf50', '#2196f3', '#fff9c4', '#757575', '#b3e5fc', '#8bc34a']
]

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72]

export default function TextEditingPanel({ 
  textElement, 
  onUpdate, 
  onClose, 
  onDelete 
}) {
  const [showFontDropdown, setShowFontDropdown] = useState(false)
  const [showSizeDropdown, setShowSizeDropdown] = useState(false)

  // Handle text input change
  const handleTextChange = (e) => {
    onUpdate({ text: e.target.value })
  }

  // Handle font family change
  const handleFontFamilyChange = (fontFamily) => {
    onUpdate({ fontFamily })
    setShowFontDropdown(false)
  }

  // Handle font size change
  const handleFontSizeChange = (fontSize) => {
    onUpdate({ fontSize })
    setShowSizeDropdown(false)
  }

  // Toggle text style
  const toggleStyle = (property, value, currentValue) => {
    onUpdate({ 
      [property]: currentValue === value ? 'normal' : value 
    })
  }

  // Handle alignment change
  const handleAlignmentChange = (textAlign) => {
    onUpdate({ textAlign })
  }

  // Handle color change
  const handleColorChange = (color) => {
    onUpdate({ color })
  }

  // Handle numeric input change
  const handleNumericChange = (property, value) => {
    onUpdate({ [property]: parseFloat(value) || 0 })
  }

  const isActive = (property, value) => textElement[property] === value

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">폰트 스타일</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="삭제"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            텍스트 내용
          </label>
          <textarea
            value={textElement.text}
            onChange={handleTextChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="텍스트를 입력하세요"
          />
        </div>

        {/* Font Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            서체 선택
          </label>
          <div className="relative">
            <button
              onClick={() => setShowFontDropdown(!showFontDropdown)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 transition-colors"
            >
              <span>{textElement.fontFamily}</span>
              <ChevronDown size={16} />
            </button>
            
            {showFontDropdown && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => handleFontFamilyChange(font.value)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                      textElement.fontFamily === font.value ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            글자 크기
          </label>
          <div className="relative">
            <button
              onClick={() => setShowSizeDropdown(!showSizeDropdown)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 transition-colors"
            >
              <span>{textElement.fontSize}px</span>
              <ChevronDown size={16} />
            </button>
            
            {showSizeDropdown && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                      textElement.fontSize === size ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Text Formatting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            텍스트 서식
          </label>
          <div className="flex space-x-1">
            <button
              onClick={() => toggleStyle('fontWeight', 'bold', textElement.fontWeight)}
              className={`p-2 border rounded-lg transition-colors ${
                isActive('fontWeight', 'bold') 
                  ? 'bg-blue-100 border-blue-300 text-blue-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            
            <button
              onClick={() => toggleStyle('fontStyle', 'italic', textElement.fontStyle)}
              className={`p-2 border rounded-lg transition-colors ${
                isActive('fontStyle', 'italic') 
                  ? 'bg-blue-100 border-blue-300 text-blue-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            
            <button
              onClick={() => toggleStyle('textDecoration', 'underline', textElement.textDecoration)}
              className={`p-2 border rounded-lg transition-colors ${
                isActive('textDecoration', 'underline') 
                  ? 'bg-blue-100 border-blue-300 text-blue-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              title="Underline"
            >
              <Underline size={16} />
            </button>
            
            <button
              onClick={() => toggleStyle('textDecoration', 'line-through', textElement.textDecoration)}
              className={`p-2 border rounded-lg transition-colors ${
                isActive('textDecoration', 'line-through') 
                  ? 'bg-blue-100 border-blue-300 text-blue-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </button>
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            텍스트 정렬
          </label>
          <div className="flex space-x-1">
            <button
              onClick={() => handleAlignmentChange('left')}
              className={`p-2 border rounded-lg transition-colors flex-1 ${
                isActive('textAlign', 'left') 
                  ? 'bg-blue-100 border-blue-300 text-blue-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AlignLeft size={16} className="mx-auto" />
            </button>
            
            <button
              onClick={() => handleAlignmentChange('center')}
              className={`p-2 border rounded-lg transition-colors flex-1 ${
                isActive('textAlign', 'center') 
                  ? 'bg-blue-100 border-blue-300 text-blue-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AlignCenter size={16} className="mx-auto" />
            </button>
            
            <button
              onClick={() => handleAlignmentChange('right')}
              className={`p-2 border rounded-lg transition-colors flex-1 ${
                isActive('textAlign', 'right') 
                  ? 'bg-blue-100 border-blue-300 text-blue-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AlignRight size={16} className="mx-auto" />
            </button>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            글씨 색상 - 노랑
          </label>
          <div className="space-y-2">
            {TEXT_COLORS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-1">
                {row.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      textElement.color === color 
                        ? 'border-gray-800 scale-110' 
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Character & Line Spacing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              문자 간격
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleNumericChange('letterSpacing', textElement.letterSpacing - 1)}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronDown size={16} />
              </button>
              <input
                type="number"
                value={textElement.letterSpacing}
                onChange={(e) => handleNumericChange('letterSpacing', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <button
                onClick={() => handleNumericChange('letterSpacing', textElement.letterSpacing + 1)}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              행 간격
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleNumericChange('lineHeight', Math.max(0.5, textElement.lineHeight - 0.1))}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronDown size={16} />
              </button>
              <input
                type="number"
                step="0.1"
                value={textElement.lineHeight}
                onChange={(e) => handleNumericChange('lineHeight', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <button
                onClick={() => handleNumericChange('lineHeight', textElement.lineHeight + 0.1)}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            회전
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleNumericChange('rotation', textElement.rotation - 15)}
              className="p-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              <ChevronDown size={16} />
            </button>
            <input
              type="number"
              value={textElement.rotation}
              onChange={(e) => handleNumericChange('rotation', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span className="text-sm text-gray-500">°</span>
            <button
              onClick={() => handleNumericChange('rotation', textElement.rotation + 15)}
              className="p-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              <ChevronUp size={16} />
            </button>
          </div>
        </div>

        {/* Pattern */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            패턴
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <button
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronDown size={16} />
              </button>
              <input
                type="number"
                defaultValue={1}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <button
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronUp size={16} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link size={16} className="text-gray-400" />
              <button
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronDown size={16} />
              </button>
              <input
                type="number"
                defaultValue={1}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <button
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}