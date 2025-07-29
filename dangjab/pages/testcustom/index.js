// Modified textcustom/index.js - Starts editing interface immediately
import React, { useState } from 'react'
import DirectEditTshirtCustomizer from '@/components/2DShirt/DirectEditTshirtCustomizer'

export default function TshirtDesignPage() {
  const [savedDesigns, setSavedDesigns] = useState([])

  // Sample initial data with a starter text element
  const initialDesignData = {
    tshirtColor: '#ffffff',
    textElements: [
      {
        id: 'toptext',
        text: 'BBOSIK',
        x: 250,
        y: 175,
        fontSize: 32,
        fontFamily: 'Arial',
        color: '#c09031ff',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        letterSpacing: 0,
        lineHeight: 1,
        rotation: 0
      },
      {
        id: 'leftdate',
        text: '2025.05.31',
        x: 150,
        y: 250,
        fontSize: 8,
        fontFamily: 'Arial',
        color: '#c09031ff',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        letterSpacing: 0,
        lineHeight: 1,
        rotation: 0
      },
            {
        id: 'rightdate',
        text: '2021.04.31',
        x: 350,
        y: 250,
        fontSize: 8,
        fontFamily: 'Arial',
        color: '#c09031ff',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        letterSpacing: 0,
        lineHeight: 1,
        rotation: 0
      },
                  {
        id: 'bottomtext',
        text: 'The reasons why I live',
        x: 250,
        y: 325,
        fontSize: 8,
        fontFamily: 'Arial',
        color: '#c09031ff',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        letterSpacing: 0,
        lineHeight: 1,
        rotation: 0
      },
      
    ],
    imageElements: [ // Add this array
    {
      id: 'defaultdog',
      src: '/dogs/golden_retriever.png', // Path to your image
      x: 250, // Position
      y: 250,
      width: 150, // Size
      height: 150,
      rotation: 0
    }
  ],
    backgroundImage: null
  }

  const handleBack = () => {
    // You can customize this - maybe go back to a product page or dashboard
    // For now, we'll just reload the page or you could navigate somewhere else
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/' // or wherever you want to go back to
    }
  }

  const handleSave = (designData) => {
    console.log('Saving design:', designData)
    setSavedDesigns(prev => [...prev, { 
      id: Date.now(), 
      ...designData, 
      timestamp: new Date().toISOString() 
    }])
    
    // Here you could also:
    // - Send to your backend API
    // - Save to localStorage
    // - Navigate to checkout
    // - Show success message
    
    alert('디자인이 저장되었습니다!')
  }

  // Direct render - no conditional logic, starts immediately
  return (
    <DirectEditTshirtCustomizer
      onBack={handleBack}
      initialData={initialDesignData}
      onSave={handleSave}
    />
  )
}

// Alternative version: Start completely blank (no initial text)
export function BlankTshirtDesignPage() {
  const [savedDesigns, setSavedDesigns] = useState([])

  // Completely blank initial data
  const initialDesignData = {
    tshirtColor: '#ffffff',
    textElements: [], // Start with no text elements
    backgroundImage: null
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  const handleSave = (designData) => {
    console.log('Saving design:', designData)
    setSavedDesigns(prev => [...prev, { 
      id: Date.now(), 
      ...designData, 
      timestamp: new Date().toISOString() 
    }])
    alert('디자인이 저장되었습니다!')
  }

  return (
    <DirectEditTshirtCustomizer
      onBack={handleBack}
      initialData={initialDesignData}
      onSave={handleSave}
    />
  )
}

// If you want to keep the option to toggle between interfaces:
export function TshirtDesignPageWithOption() {
  const [useDirectEdit, setUseDirectEdit] = useState(true) // Changed to true for immediate start
  const [savedDesigns, setSavedDesigns] = useState([])

  const initialDesignData = {
    tshirtColor: '#ffffff',
    textElements: [
      {
        id: `text-${Date.now()}`,
        text: 'BBOSIK',
        x: 250,
        y: 200,
        fontSize: 32,
        fontFamily: '나눔 명조',
        color: '#ffeb3b',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        letterSpacing: 0,
        lineHeight: 1,
        rotation: 0
      }
    ],
    backgroundImage: null
  }

  const handleBack = () => {
    // Option 1: Go back to landing page
    setUseDirectEdit(false)
    
    // Option 2: Go back in browser history
    // if (window.history.length > 1) {
    //   window.history.back()
    // } else {
    //   window.location.href = '/'
    // }
  }

  const handleSave = (designData) => {
    console.log('Saving design:', designData)
    setSavedDesigns(prev => [...prev, { 
      id: Date.now(), 
      ...designData, 
      timestamp: new Date().toISOString() 
    }])
    alert('디자인이 저장되었습니다!')
  }

  // Start with direct edit by default
  if (useDirectEdit) {
    return (
      <DirectEditTshirtCustomizer
        onBack={handleBack}
        initialData={initialDesignData}
        onSave={handleSave}
      />
    )
  }

  // Fallback landing page (only shows if user clicks back)
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">T-shirt 디자인 스튜디오</h1>
        
        <button
          onClick={() => setUseDirectEdit(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          디자인 편집하기
        </button>

        {savedDesigns.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">저장된 디자인</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {savedDesigns.map((design) => (
                <div key={design.id} className="border rounded-lg p-4">
                  <div className="w-full h-32 rounded mb-2 flex items-center justify-center text-sm bg-gray-50">
                    {design.textElements.map((text, index) => (
                      <span key={index} style={{ color: text.color }}>
                        {text.text}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(design.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}