'use client'

import { useState } from 'react'

export default function InstructionsPanel() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  
  if (!isVisible) {
    return (
      <button 
        className="absolute bottom-4 right-4 bg-black/80 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/90 transition-all duration-300"
        onClick={() => setIsVisible(true)}
      >
        ?
      </button>
    )
  }
  
  return (
    <div 
      className={`absolute bottom-4 right-4 bg-black/80 text-white rounded-lg transition-all duration-300 ${
        isMinimized ? 'w-12 h-12 overflow-hidden' : 'w-64 max-h-[400px]'
      } shadow-lg border border-gray-700`}
    >
      <div className="sticky top-0 right-0 z-20 bg-black/90 p-2 flex justify-between items-center border-b border-gray-700">
        <h3 className={`text-base font-bold ${isMinimized ? 'opacity-0' : 'opacity-100'}`}>The Ark World</h3>
        <div className="flex space-x-2">
          <button 
            className="opacity-70 hover:opacity-100 transition-opacity px-2"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '?' : '_'}
          </button>
          <button 
            className="opacity-70 hover:opacity-100 transition-opacity px-2"
            onClick={() => setIsVisible(false)}
          >
            ×
          </button>
        </div>
      </div>
      
      <div className={`${isMinimized ? 'opacity-0 h-0' : 'opacity-100 overflow-y-auto max-h-[352px]'} transition-opacity p-3`}>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold mb-1 text-sm">Controls</h4>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <div className="w-20">Movement</div>
                <div className="ml-2">Arrow Keys</div>
              </div>
              
              <div className="flex items-center text-xs">
                <div className="w-20">Greet</div>
                <div className="ml-2">Space (when close)</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1 text-sm">Environment</h4>
            <div className="space-y-1 text-xs">
              <p>• Explore the tiled world with various terrains</p>
              <p>• Avoid water tiles and solid decorations</p>
              <p>• Cross water using bridges</p>
              <p>• Find the house and chest</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1 text-sm">Characters</h4>
            <div className="space-y-1 text-xs">
              <p>• Gary: Player-controlled human character</p>
              <p>• Orb: Robot character with a glowing orb</p>
              <p>• Move close to Orb and press Space to greet</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1 text-sm">Navigation</h4>
            <div className="space-y-1 text-xs">
              <p>• Check the minimap in the top-right corner</p>
              <p>• Blue dot: Gary's position</p>
              <p>• Purple dot: Orb's position</p>
              <p>• White rectangle: Current viewport</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 