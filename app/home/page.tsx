'use client'

import { useEffect, useState } from 'react'
import CharacterWorld from '@/components/character-world'
import InstructionsPanel from '@/components/instructions-panel'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoaded ? (
          <CharacterWorld />
        ) : (
          <div className="text-white text-2xl">Loading World...</div>
        )}
      </div>
      
      <InstructionsPanel />
    </main>
  )
} 