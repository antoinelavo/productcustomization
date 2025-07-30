// @/components/2DShirt/TemplatePanel.jsx
'use client'

import React, { useState } from 'react'
import { AlertTriangle, X, Check } from 'lucide-react'

const TEMPLATES = {
  travel: {
    id: 'travel',
    name: '여행',
    textElements: [
      {
        id: 'travel-name',
        text: 'RUNGJI',
        x: 250,
        y: 180,
        fontSize: 32,
        fontFamily: 'Arial',
        color: '#00b7ffff',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        letterSpacing: 2,
        lineHeight: 1,
        rotation: 0,
        isCurved: true,
        curveRadius: 30,
        curveDirection: 'up',
        locked: false
      }
    ],
    imageElements: [
      {
        id: 'travel-bg',
        src: '/templates/travel.png',
        x: 250,
        y: 230,
        width: 200,
        height: 125,
        rotation: 0,
        locked: true
      }
    ]
  },
  summer: {
    id: 'summer',
    name: '여름',
    textElements: [
      {
        id: 'summer-name',
        text: 'DDUNGJA',
        x: 250,
        y: 180,
        fontSize: 32,
        fontFamily: 'Arial',
        color: '#00b7ffff',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        letterSpacing: 2,
        lineHeight: 1,
        rotation: 0,
        isCurved: true,
        curveRadius: 30,
        curveDirection: 'up',
        locked: false
      }
    ],
    imageElements: [
      {
        id: 'summer-bg',
        src: '/templates/summer.png',
        x: 250,
        y: 230,
        width: 200,
        height: 125,
        rotation: 0,
        locked: true
      }
    ]
  }
}

export default function TemplatePanel({ onSelectTemplate }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template)
    setShowConfirmDialog(true)
  }

  const handleConfirmApply = () => {
    if (selectedTemplate && onSelectTemplate) {
      onSelectTemplate(selectedTemplate)
    }
    setShowConfirmDialog(false)
    setSelectedTemplate(null)
  }

  const handleCancelApply = () => {
    setShowConfirmDialog(false)
    setSelectedTemplate(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">시안 선택</h2>
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {Object.values(TEMPLATES).map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 group-hover:text-blue-700">
                    {template.name}
                  </h3>
                </div>
                <div className="text-gray-400 group-hover:text-blue-500">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium">템플릿 정보</p>
              <p className="text-amber-700 mt-1">
                • 템플릿을 선택하면 현재 디자인이 모두 교체됩니다<br/>
                • 템플릿 요소는 글 이외 수정할 수 없습니다<br/>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-mx-4 mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  템플릿 적용 확인
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                "<strong>{selectedTemplate?.name}</strong>" 템플릿을 적용하시겠습니까?<br/>
                현재 디자인된 모든 요소가 교체됩니다.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelApply}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <X size={16} />
                  <span>취소</span>
                </button>
                <button
                  onClick={handleConfirmApply}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Check size={16} />
                  <span>적용</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}