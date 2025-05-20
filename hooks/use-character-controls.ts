'use client'

import { useEffect, useState } from 'react'

type Keys = {
  ArrowUp: boolean
  ArrowDown: boolean
  ArrowLeft: boolean
  ArrowRight: boolean
  Space: boolean
  KeyE: boolean
}

export function useCharacterControls() {
  const [keys, setKeys] = useState<Keys>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    KeyE: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: keyof Keys } = {
        'ArrowUp': 'ArrowUp',
        'ArrowDown': 'ArrowDown',
        'ArrowLeft': 'ArrowLeft',
        'ArrowRight': 'ArrowRight',
        ' ': 'Space',
        'e': 'KeyE',
        'E': 'KeyE'
      }
      const mappedKey = keyMap[e.key]

      if (mappedKey) {
        // Prevent default for arrow keys and space (scrolling/page jump)
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault()
        }
        
        setKeys(prev => ({
          ...prev,
          [mappedKey]: true
        }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: keyof Keys } = {
        'ArrowUp': 'ArrowUp',
        'ArrowDown': 'ArrowDown',
        'ArrowLeft': 'ArrowLeft',
        'ArrowRight': 'ArrowRight',
        ' ': 'Space',
        'e': 'KeyE',
        'E': 'KeyE'
      }
      const mappedKey = keyMap[e.key]

      if (mappedKey) {
        setKeys(prev => ({
          ...prev,
          [mappedKey]: false
        }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return { keys }
} 