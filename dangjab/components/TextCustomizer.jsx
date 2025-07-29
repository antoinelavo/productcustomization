// @/components/TextCustomizer.jsx - Hybrid approach with traditional + custom text
'use client'

import React from 'react'
import { Type, Plus, Trash2, Palette, Move } from 'lucide-react'

const FONT_SIZES = [
  { value: 'small', label: '작게', size: '100px' },
  { value: 'medium', label: '보통', size: '100px' },
  { value: 'large', label: '크게', size: '100px' },
  { value: 'xl', label: '매우 크게', size: '100px' }
]

const FONT_FAMILIES = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' }
]

const TEXT_COLORS = [
  '#000000', '#ffffff', '#8B4513', '#FF0000', 
  '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'
]

export default function TextCustomizer({ 
  textSettings, 
  onTextSettingsChange, 
  selectedTextId, 
  onSelectText 
}) {
  
  const addCustomText = () => {
    const newElement = {
      id: `custom-${Date.now()}`,
      text: '새 텍스트',
      x: 700, // Center of 1400px canvas
      y: 700,
      fontSize: textSettings.fontSize || 'medium',
      color: textSettings.textColor || '#8B4513',
      fontFamily: textSettings.fontFamily || 'Arial, sans-serif'
    }
    
    const updatedSettings = {
      ...textSettings,
      customElements: [...(textSettings.customElements || []), newElement]
    }
    onTextSettingsChange(updatedSettings)
    onSelectText(newElement.id)
  }

  const updateTraditionalText = (textKey, value) => {
    const updatedSettings = {
      ...textSettings,
      [textKey]: value
    }
    onTextSettingsChange(updatedSettings)
  }

  const updateGlobalSetting = (key, value) => {
    const updatedSettings = {
      ...textSettings,
      [key]: value
    }
    onTextSettingsChange(updatedSettings)
  }

  const updateCustomElement = (elementId, updates) => {
    const updatedElements = textSettings.customElements?.map(element =>
      element.id === elementId ? { ...element, ...updates } : element
    ) || []
    
    const updatedSettings = {
      ...textSettings,
      customElements: updatedElements
    }
    onTextSettingsChange(updatedSettings)
  }

  const deleteCustomElement = (elementId) => {
    const updatedElements = textSettings.customElements?.filter(el => el.id !== elementId) || []
    const updatedSettings = {
      ...textSettings,
      customElements: updatedElements
    }
    onTextSettingsChange(updatedSettings)
    if (selectedTextId === elementId) {
      onSelectText(null)
    }
  }

  const selectedCustomElement = textSettings.customElements?.find(el => el.id === selectedTextId)
  const isTraditionalTextSelected = ['topText', 'bottomText', 'leftText', 'rightText'].includes(selectedTextId)

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Type className="mr-2" size={20} />
        텍스트 설정
      </h3>

      {/* Traditional Text Inputs */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700">기본 텍스트</h4>
        
        {[
          { key: 'topText', label: '상단 텍스트', placeholder: '상단에 표시할 텍스트' },
          { key: 'bottomText', label: '하단 텍스트', placeholder: '하단에 표시할 텍스트' },
          { key: 'leftText', label: '왼쪽 텍스트', placeholder: '왼쪽에 표시할 텍스트' },
          { key: 'rightText', label: '오른쪽 텍스트', placeholder: '오른쪽에 표시할 텍스트' }
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <div className="relative">
              <input
                type="text"
                value={textSettings[field.key] || ''}
                onChange={(e) => updateTraditionalText(field.key, e.target.value)}
                onClick={() => onSelectText(field.key)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedTextId === field.key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300'
                }`}
                placeholder={field.placeholder}
              />
              {selectedTextId === field.key && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Move size={16} className="text-blue-500" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Global Text Settings */}
      <div className="space-y-4 mb-6 border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-700">전체 텍스트 설정</h4>
        
        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기본 글자 크기
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => updateGlobalSetting('fontSize', size.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  textSettings.fontSize === size.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기본 글꼴
          </label>
          <select
            value={textSettings.fontFamily || 'Arial, sans-serif'}
            onChange={(e) => updateGlobalSetting('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기본 글자 색상
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {TEXT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateGlobalSetting('textColor', color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                  textSettings.textColor === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          {/* Custom Color Input */}
          <input
            type="color"
            value={textSettings.textColor || '#8B4513'}
            onChange={(e) => updateGlobalSetting('textColor', e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
        </div>
      </div>

      {/* Custom Text Elements */}
      <div className="space-y-4 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700">추가 텍스트</h4>
          <button
            onClick={addCustomText}
            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            <Plus size={14} />
            <span>추가</span>
          </button>
        </div>

        {/* Custom Elements List */}
        {textSettings.customElements && textSettings.customElements.length > 0 && (
          <div className="space-y-2">
            {textSettings.customElements.map((element) => (
              <div
                key={element.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedTextId === element.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onSelectText(element.id)}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="font-medium truncate"
                    style={{ 
                      color: element.color,
                      fontFamily: element.fontFamily 
                    }}
                  >
                    {element.text || '(빈 텍스트)'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteCustomElement(element.id)
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Custom Element Editor */}
      {selectedCustomElement && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-purple-700">선택된 텍스트 편집</h4>
          
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              텍스트 내용
            </label>
            <input
              type="text"
              value={selectedCustomElement.text}
              onChange={(e) => updateCustomElement(selectedCustomElement.id, { text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="텍스트를 입력하세요"
            />
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              글자 크기
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => updateCustomElement(selectedCustomElement.id, { fontSize: size.value })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCustomElement.fontSize === size.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              글꼴
            </label>
            <select
              value={selectedCustomElement.fontFamily}
              onChange={(e) => updateCustomElement(selectedCustomElement.id, { fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              글자 색상
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => updateCustomElement(selectedCustomElement.id, { color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                    selectedCustomElement.color === color
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Custom Color Input */}
            <input
              type="color"
              value={selectedCustomElement.color}
              onChange={(e) => updateCustomElement(selectedCustomElement.id, { color: e.target.value })}
              className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>

          {/* Position Display */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div>
              <span className="font-medium">X 위치: </span>
              {Math.round(selectedCustomElement.x)}px
            </div>
            <div>
              <span className="font-medium">Y 위치: </span>
              {Math.round(selectedCustomElement.y)}px
            </div>
          </div>
        </div>
      )}

      {/* Selected Traditional Text Info */}
      {isTraditionalTextSelected && (
        <div className="space-y-2 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-blue-700">선택된 기본 텍스트</h4>
          <p className="text-sm text-gray-600">
            기본 텍스트는 전체 설정을 따릅니다. 개별 설정을 원하시면 "추가 텍스트"를 사용하세요.
          </p>
        </div>
      )}

      {/* Helper Text */}
      {!textSettings.topText && !textSettings.bottomText && !textSettings.leftText && !textSettings.rightText && (!textSettings.customElements || textSettings.customElements.length === 0) && (
        <div className="text-center text-gray-500 text-sm py-4">
          기본 텍스트를 입력하거나 추가 텍스트를 만들어 시작하세요
        </div>
      )}
    </div>
  )
}