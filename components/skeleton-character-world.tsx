'use client'

import React, { useEffect, useRef, useState } from 'react'
import { SkeletonCharacter } from '@/lib/skeleton-character'
import { useCharacterControls } from '@/hooks/use-character-controls'

export default function SkeletonCharacterWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [mainCharacter, setMainCharacter] = useState<SkeletonCharacter | null>(null)
  const [idleCharacter, setIdleCharacter] = useState<SkeletonCharacter | null>(null)
  const [isDebugMode, setIsDebugMode] = useState<boolean>(false)
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  
  // Set up keyboard controls
  const { keys } = useCharacterControls()
  
  // Load characters
  useEffect(() => {
    const loadCharacters = async () => {
      // Create main character (Gary)
      const gary = new SkeletonCharacter({
        spriteSheet: '/images/wizard-agent-large.png', // Using wizard image for the skeleton character
        name: 'Gary',
        scale: 1,
        position: { x: 200, y: 300 },
        speed: 3
      })
      
      // Create second character (Orb)
      const orb = new SkeletonCharacter({
        spriteSheet: '/images/wizard-agent-large.png', // Using wizard image for the skeleton character
        name: 'Orb',
        scale: 1,
        position: { x: 600, y: 300 },
        speed: 3
      })
      
      // Load both characters
      await Promise.all([gary.load(), orb.load()])
      
      setMainCharacter(gary)
      setIdleCharacter(orb)
    }
    
    loadCharacters()
    
    // Set canvas dimensions based on window size
    const updateDimensions = () => {
      setDimensions({
        width: Math.min(window.innerWidth, 1200),
        height: Math.min(window.innerHeight - 100, 800)
      })
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    return () => {
      window.removeEventListener('resize', updateDimensions)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])
  
  // Set up game loop
  useEffect(() => {
    if (!canvasRef.current || !mainCharacter || !idleCharacter) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp
      
      // Clear canvas
      ctx.fillStyle = '#222233'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)
      
      // Update main character based on keyboard input
      const direction = { x: 0, y: 0 }
      
      if (keys.ArrowUp) direction.y = -1
      if (keys.ArrowDown) direction.y = 1
      if (keys.ArrowLeft) direction.x = -1
      if (keys.ArrowRight) direction.x = 1
      
      // Toggle debug mode
      if (keys.d && !keys.lastD) {
        setIsDebugMode(!isDebugMode)
      }
      keys.lastD = keys.d
      
      // Update characters
      mainCharacter.update(
        direction,
        deltaTime,
        dimensions,
        [idleCharacter],
        undefined,
        undefined
      )
      
      idleCharacter.update(
        { x: 0, y: 0 },
        deltaTime,
        dimensions,
        [mainCharacter],
        undefined,
        undefined
      )
      
      // Check for greeting between characters
      if (mainCharacter.isCloseTo(idleCharacter) && keys.Space && !mainCharacter.isGreeting && !idleCharacter.isGreeting) {
        // Determine which side each character is on
        const isMainOnLeft = mainCharacter.position.x < idleCharacter.position.x
        
        // Start greeting animations
        mainCharacter.startGreeting(isMainOnLeft)
        idleCharacter.startGreeting(!isMainOnLeft)
      }
      
      // Draw grid for reference
      if (isDebugMode) {
        drawGrid(ctx, dimensions)
      }
      
      // Render characters
      mainCharacter.render(ctx, isDebugMode)
      idleCharacter.render(ctx, isDebugMode)
      
      // Draw instructions
      if (!mainCharacter.isCloseTo(idleCharacter)) {
        ctx.font = '18px Arial'
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.fillText(
          'Use arrow keys to move Gary close to Orb',
          dimensions.width / 2,
          dimensions.height - 30
        )
      } else if (!mainCharacter.isGreeting && !idleCharacter.isGreeting) {
        ctx.font = '18px Arial'
        ctx.fillStyle = 'yellow'
        ctx.textAlign = 'center'
        ctx.fillText(
          'Press SPACE to greet!',
          dimensions.width / 2,
          dimensions.height - 30
        )
      }
      
      // Draw debug info
      if (isDebugMode) {
        ctx.font = '14px Arial'
        ctx.fillStyle = 'white'
        ctx.textAlign = 'left'
        ctx.fillText('Debug Mode (Press D to toggle)', 10, 20)
      }
      
      animationRef.current = requestAnimationFrame(gameLoop)
    }
    
    animationRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, mainCharacter, idleCharacter, keys, isDebugMode])
  
  // Draw a grid for debugging
  const drawGrid = (ctx: CanvasRenderingContext2D, dimensions: { width: number, height: number }) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    
    // Draw vertical lines
    for (let x = 0; x < dimensions.width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, dimensions.height)
      ctx.stroke()
    }
    
    // Draw horizontal lines
    for (let y = 0; y < dimensions.height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(dimensions.width, y)
      ctx.stroke()
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-bold mb-4">Skeleton Animation Demo</h2>
      <div className="relative border border-gray-700 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="bg-gray-900"
        />
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <p>Controls: Arrow keys to move, Space to greet when close, D to toggle debug view</p>
      </div>
    </div>
  )
} 