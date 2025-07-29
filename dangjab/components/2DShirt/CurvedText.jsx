// @/components/2DShirt/CurvedText.jsx
'use client'

import React from 'react'

export default function CurvedText({ element, isSelected, className }) {
  const {
    text,
    x,
    y,
    fontSize,
    fontFamily,
    color,
    fontWeight,
    fontStyle,
    letterSpacing,
    rotation,
    isCurved,
    curveRadius = 100,
    curveDirection = 'up', // 'up' or 'down'
  } = element

  // If not curved, return regular text
  if (!isCurved) {
    const textStyle = {
      position: 'absolute',
      left: x,
      top: y,
      fontSize: `${fontSize}px`,
      fontFamily: fontFamily,
      color: color,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      letterSpacing: `${letterSpacing}px`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      userSelect: 'none',
      whiteSpace: 'nowrap',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    }

    return (
      <div style={textStyle} className={className}>
        {text}
      </div>
    )
  }

  // Calculate SVG dimensions and path for curved text
  // Calculate actual text width for precise curve sizing
  let measuredTextWidth = text.length * fontSize * 0.6 // Rough estimate
  
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
    const metrics = ctx.measureText(text)
    measuredTextWidth = metrics.width
  }
  
  // Make SVG dimensions tight to the actual text
  const arcHeight = curveRadius * 0.5
  const svgWidth = measuredTextWidth // Small padding
  const svgHeight = fontSize// Just enough for curve
  
  // Create the curve path based on actual text width, not curveRadius
  const centerX = svgWidth / 2
  const centerY = curveDirection === 'up' ? svgHeight - 10 : 10
  
  // Use text width to determine curve span, curveRadius only for arc height
  const halfTextWidth = measuredTextWidth / 2
  
  // Calculate the curve based on direction
  let pathD
  if (curveDirection === 'up') {
    // Upward arc (like a smile) - only as wide as text
    const startX = centerX - halfTextWidth
    const endX = centerX + halfTextWidth
    const controlY = centerY - arcHeight
    pathD = `M ${startX} ${centerY} Q ${centerX} ${controlY} ${endX} ${centerY}`
  } else {
    // Downward arc (like a frown) - only as wide as text
    const startX = centerX - halfTextWidth
    const endX = centerX + halfTextWidth
    const controlY = centerY + arcHeight
    pathD = `M ${startX} ${centerY} Q ${centerX} ${controlY} ${endX} ${centerY}`
  }

  const svgStyle = {
    position: 'absolute',
    left: x,
    top: y,
    width: svgWidth,
    height: svgHeight,
    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    overflow: 'visible',
    pointerEvents: 'auto'
  }

  const textStyle = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    fill: color,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    letterSpacing: `${letterSpacing}px`,
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    dominantBaseline: 'middle',
    textAnchor: 'middle'
  }

  return (
    <svg style={svgStyle} className={className}>
      <defs>
        <path 
          id={`curve-${element.id}`} 
          d={pathD} 
          fill="none" 
          stroke="none"
        />
      </defs>
      <text style={textStyle}>
        <textPath 
          href={`#curve-${element.id}`} 
          startOffset="50%"
        >
          {text}
        </textPath>
      </text>
      
      {/* Debug path - remove in production */}
      {process.env.NODE_ENV === 'development' && isSelected && (
        <path 
          d={pathD} 
          fill="none" 
          stroke="rgba(255,0,0,0.3)" 
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      )}
    </svg>
  )
}