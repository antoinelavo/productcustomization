// @/components/2DShirt/TemplatePanel.jsx
'use client'

import React from 'react'
import { Layers, Star, Heart } from 'lucide-react'

const TEMPLATE_CATEGORIES = [
  { id: 'popular', name: '인기 템플릿', icon: Star },
  { id: 'new', name: '신규 템플릿', icon: Layers },
  { id: 'favorite', name: '즐겨찾기', icon: Heart }
]

const SAMPLE_TEMPLATES = [
  {
    id: 1,
    name: '심플 텍스트',
    category: 'popular',
    thumbnail: '',
    textElements: [
      { id: 'temp-1', text: '심플한 텍스트', x: 250, y: 200, fontSize: 28, color: '#000000', fontFamily: '나눔 고딕' }
    ]
  },
  {
    id: 2,
    name: '상하 조합',
    category: 'popular',
    thumbnail: '',
    textElements: [
      { id: 'temp-2', text: '상단 텍스트', x: 250, y: 180, fontSize: 24, color: '#000000', fontFamily: '나눔 명조' },
      { id: 'temp-3', text: '하단 텍스트', x: 250, y: 320, fontSize: 20, color: '#666666', fontFamily: '나눔 명조' }
    ]
  },
  {
    id: 3,
    name: '컬러풀',
    category: 'new',
    thumbnail: '',
    textElements: [
      { id: 'temp-4', text: 'COLORFUL', x: 250, y: 200, fontSize: 32, color: '#ff6b6b', fontFamily: 'Arial', fontWeight: 'bold' }
    ]
  }
]

export function TemplatePanel({ onSelectTemplate }) {
  const [selectedCategory, setSelectedCategory] = React.useState('popular')
  
  const filteredTemplates = SAMPLE_TEMPLATES.filter(template => 
    template.category === selectedCategory
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">템플릿</h2>
        <p className="text-sm text-gray-600 mt-1">미리 만들어진 디자인을 선택하세요</p>
      </div>

      {/* Categories */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-1">
          {TEMPLATE_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="aspect-square border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors group"
            >
              <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center relative overflow-hidden">
                {/* Template Preview */}
                <div className="text-xs text-center">
                  {template.textElements.map((text, idx) => (
                    <div 
                      key={idx}
                      className="mb-1"
                      style={{ 
                        color: text.color, 
                        fontFamily: text.fontFamily,
                        fontWeight: text.fontWeight 
                      }}
                    >
                      {text.text}
                    </div>
                  ))}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                  <span className="text-blue-600 opacity-0 group-hover:opacity-100 text-sm font-medium">
                    선택
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">{template.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
