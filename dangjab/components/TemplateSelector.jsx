// @/components/TemplateSelector.jsx
import React from 'react'
import { Palette } from 'lucide-react'

const TEMPLATES = [
  { id: null, label: '기본', description: '기본' },
  { id: 'summer', label: '여름', description: '여름 시안' },
  { id: 'travel', label: '여행', description: '여행 시안' }
]

export default function TemplateSelector({ selectedTemplate, onTemplateSelect }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Palette className="mr-2" size={20} />
        시안 선택
      </h3>
      
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.id || 'basic'}
            onClick={() => onTemplateSelect(template.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              selectedTemplate === template.id
                ? 'border-gray-800 bg-gray-50 scale-105' 
                : 'border-gray-200 hover:border-gray-400 bg-white'
            }`}
          >
            <span className="text-lg font-bold text-gray-800 mb-1">
              {template.label}
            </span>
            <span className="text-xs text-gray-500 text-center">
              {template.description}
            </span>
          </button>
        ))}
      </div>
      
    </div>
  )
}