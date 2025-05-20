'use client'

import { useState } from 'react'

export default function InstructionsPanel() {
  const [isMinimized, setIsMinimized] = useState(false)
  
  return (
    <div 
      className={`absolute bottom-4 right-4 bg-black/80 text-white rounded-lg p-4 transition-all duration-300 ${
        isMinimized ? 'w-12 h-12 overflow-hidden' : 'w-80'
      }`}
    >
      <button 
        className="absolute top-2 right-2 z-10 opacity-70 hover:opacity-100"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        {isMinimized ? '?' : '×'}
      </button>
      
      <div className={`${isMinimized ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        <h3 className="text-xl font-bold mb-4">The Ark World</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Controls</h4>
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="w-24">Movement</div>
                <div className="ml-2">Arrow Keys</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24">Greet</div>
                <div className="ml-2">Space (when close)</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Environment</h4>
            <div className="space-y-1 text-sm">
              <p>• Explore the tiled world with various terrains</p>
              <p>• Avoid water tiles and solid decorations</p>
              <p>• Cross water using bridges</p>
              <p>• Find the house and chest</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Characters</h4>
            <div className="space-y-1 text-sm">
              <p>• Gary: Player-controlled human character</p>
              <p>• Orb: Robot character with a glowing orb</p>
              <p>• Move close to Orb and press Space to greet</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Navigation</h4>
            <div className="space-y-1 text-sm">
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