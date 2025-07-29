// @/components/2DShirt/DesignPanel.jsx
'use client'

import React from 'react'
import { Palette, Shapes, Sparkles, Zap } from 'lucide-react'

const DESIGN_CATEGORIES = [
  { id: 'graphics', name: '그래픽', icon: Shapes },
  { id: 'effects', name: '효과', icon: Sparkles },
  { id: 'patterns', name: '패턴', icon: Palette },
  { id: 'special', name: '특수', icon: Zap }
]

const SAMPLE_DESIGNS = [
  { id: 1, name: '하트', category: 'graphics', color: '#ff6b6b' },
  { id: 2, name: '별', category: 'graphics', color: '#ffd93d' },
  { id: 3, name: '번개', category: 'graphics', color: '#74c0fc' },
  { id: 4, name: '체크', category: 'patterns', color: '#51cf66' },
  { id: 5, name: '스트라이프', category: 'patterns', color: '#495057' },
  { id: 6, name: '글로우', category: 'effects', color: '#845ef7' }
]

export function DesignPanel({ onSelectDesign }) {
  const [selectedCategory, setSelectedCategory] = React.useState('graphics')
  
  const filteredDesigns = SAMPLE_DESIGNS.filter(design => 
    design.category === selectedCategory
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">디자인 추가</h2>
        <p className="text-sm text-gray-600 mt-1">그래픽 요소를 추가하세요</p>
      </div>

      {/* Categories */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          {DESIGN_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-100 text-purple-700'
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

      {/* Designs Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-3 gap-3">
          {filteredDesigns.map((design) => (
            <button
              key={design.id}
              onClick={() => onSelectDesign(design)}
              className="aspect-square border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors group flex items-center justify-center"
            >
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: design.color }}
              />
            </button>
          ))}
        </div>
        
        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <Palette size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">준비 중입니다</p>
          </div>
        )}
      </div>
    </div>
  )
}