import React from 'react'
import NdajeLogo from '../../assets/Ndaje_Logo.svg'

function Logo({ className = '', variant = 'blue' }) {
  return (
    <div className={`inline-flex items-center justify-center gap-2 ${className}`} aria-label="NDAJE logo">
      <img 
        src={NdajeLogo} 
        alt="NDAJE Logo" 
        className="h-32 w-auto shrink-0"
        style={{ 
          filter: variant === 'white' 
            ? 'brightness(0) saturate(100%) invert(100%)' // White version
            : 'brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(2000%) hue-rotate(220deg) brightness(0.7) contrast(1.2)' // Blue version
        }}
      />
    </div>
  )
}

export default Logo
