'use client'

import { useEffect, useRef, useState } from 'react'
import { useCharacterControls } from '@/hooks/use-character-controls'
import { Character } from '@/lib/character'
import { WorldEnvironment } from '@/lib/world-environment'
import { CharacterAI } from '@/lib/character-ai'
import TaskDisplay from './task-display'

export default function CharacterWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [garyCharacter, setGaryCharacter] = useState<Character | null>(null)
  const [orbCharacter, setOrbCharacter] = useState<Character | null>(null)
  const [worldEnvironment, setWorldEnvironment] = useState<WorldEnvironment | null>(null)
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 })
  const [orbAI, setOrbAI] = useState<CharacterAI | null>(null)
  const [, setRenderTrigger] = useState<number>(0) // Used to force re-renders on AI state changes
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionAlpha, setTransitionAlpha] = useState(0)
  const [transitionTarget, setTransitionTarget] = useState<{ roomIndex: number, entryPointKey: string } | null>(null)

  const TRANSITION_SPEED = 0.05 // Speed of the fade effect
  
  // Load world environment
  useEffect(() => {
    const loadWorld = async () => {
      // Create a 30x30 world grid with 64px tiles (larger than the viewport)
      const world = new WorldEnvironment(30, 30, 64)
      
      // Load tile images
      await world.loadTileImages()
      
      // Set up a sample world with various tile types and decorations
      world.createSampleWorld()
      
      setWorldEnvironment(world)
    }
    
    loadWorld()
  }, [])
  
  // Load character sprites
  useEffect(() => {
    const loadCharacters = async () => {
      const gary = new Character({
        spriteSheet: '/images/garysprite.png',
        name: 'Gary',
        scale: 0.075,  // 50% smaller than 0.15
        position: { x: 200, y: 300 },
        speed: 3,
        rows: 2,  // 2 rows
        cols: 5,  // 5 columns
      })
      
      const orb = new Character({
        spriteSheet: '/images/orbsprite.png',
        name: 'Orb',
        scale: 0.075,  // 50% smaller than 0.15
        position: { x: 600, y: 300 },
        speed: 3,
        rows: 2,  // 2 rows
        cols: 5,  // 5 columns
      })
      
      await Promise.all([gary.load(), orb.load()])
      
      setGaryCharacter(gary)
      setOrbCharacter(orb)
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
  
  // Initialize Orb AI when character and world are loaded
  useEffect(() => {
    if (orbCharacter && worldEnvironment) {
      const ai = new CharacterAI(orbCharacter, worldEnvironment)
      
      // Set up callback to trigger re-renders when AI state changes
      ai.setStateUpdateCallback(() => {
        setRenderTrigger(prev => prev + 1)
      })
      
      setOrbAI(ai)
    }
  }, [orbCharacter, worldEnvironment])
  
  // Setup keyboard controls
  const { keys } = useCharacterControls()
  
  // Main game loop
  useEffect(() => {
    if (!canvasRef.current || !garyCharacter || !orbCharacter || !worldEnvironment) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp
      
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Handle transition effects
      if (isTransitioning || transitionAlpha > 0) {
        if (transitionTarget) { // Fading out
          setTransitionAlpha(alpha => {
            const newAlpha = Math.min(1, alpha + TRANSITION_SPEED)
            if (newAlpha >= 1) {
              // Perform room change
              worldEnvironment.loadRoom(transitionTarget.roomIndex)
              const newRoom = worldEnvironment.rooms[worldEnvironment.currentRoomIndex]
              const entryPoint = newRoom.entryPoints[transitionTarget.entryPointKey]
              
              if (entryPoint) {
                garyCharacter.position = { x: entryPoint.x, y: entryPoint.y }
              } else {
                // Default to a fallback position if entry point is not found
                garyCharacter.position = { x: worldEnvironment.tileSize * 2, y: worldEnvironment.tileSize * 2 }
                console.warn(`Entry point ${transitionTarget.entryPointKey} not found in room ${worldEnvironment.currentRoomIndex}. Defaulting position.`)
              }
              
              // Immediately update viewport to the new room and character position
              const newViewportX = garyCharacter.position.x - dimensions.width / 2 + garyCharacter.frameWidth * garyCharacter.scale / 2
              const newViewportY = garyCharacter.position.y - dimensions.height / 2 + garyCharacter.frameHeight * garyCharacter.scale / 2
              
              const worldWidthImmediate = worldEnvironment.mapWidth * worldEnvironment.tileSize
              const worldHeightImmediate = worldEnvironment.mapHeight * worldEnvironment.tileSize
              
              const clampedNewViewportX = Math.max(0, Math.min(worldWidthImmediate - dimensions.width, newViewportX))
              const clampedNewViewportY = Math.max(0, Math.min(worldHeightImmediate - dimensions.height, newViewportY))
              setViewportOffset({ x: clampedNewViewportX, y: clampedNewViewportY })

              setTransitionTarget(null) // Clear target, start fade-in
            }
            return newAlpha
          })
        } else { // Fading in
          setTransitionAlpha(alpha => {
            const newAlpha = Math.max(0, alpha - TRANSITION_SPEED)
            if (newAlpha <= 0) {
              setIsTransitioning(false)
            }
            return newAlpha
          })
        }
      }
      
      // Update gary character based on keyboard input
      const direction = { x: 0, y: 0 }
      
      if (keys.ArrowUp) direction.y = -1
      if (keys.ArrowDown) direction.y = 1
      if (keys.ArrowLeft) direction.x = -1
      if (keys.ArrowRight) direction.x = 1
      
      // Calculate world dimensions in pixels
      const worldWidth = worldEnvironment.mapWidth * worldEnvironment.tileSize
      const worldHeight = worldEnvironment.mapHeight * worldEnvironment.tileSize
      
      // Door interaction logic
      if (!isTransitioning && keys.KeyE) {
        for (const decoration of worldEnvironment.decorations) {
          if (decoration.isDoor && decoration.targetRoomIndex !== undefined && decoration.targetEntryPointKey) {
            const doorBounds = decoration.getBounds() // World coordinates
            const garyBounds = {
              x: garyCharacter.position.x,
              y: garyCharacter.position.y,
              width: garyCharacter.frameWidth * garyCharacter.scale,
              height: garyCharacter.frameHeight * garyCharacter.scale
            }

            // Simple AABB collision check for proximity
            if (
              garyBounds.x < doorBounds.x + doorBounds.width &&
              garyBounds.x + garyBounds.width > doorBounds.x &&
              garyBounds.y < doorBounds.y + doorBounds.height &&
              garyBounds.y + garyBounds.height > doorBounds.y
            ) {
              setIsTransitioning(true)
              setTransitionTarget({ roomIndex: decoration.targetRoomIndex, entryPointKey: decoration.targetEntryPointKey })
              // Consume the key press
              keys.KeyE = false 
              break // Interact with one door at a time
            }
          }
        }
      }
      
      // Update Orb's AI (only if not transitioning)
      if (orbAI && !isTransitioning) {
        orbAI.update(deltaTime)
      }
      
      // Update characters with world environment (only if not transitioning)
      if (!isTransitioning) {
        garyCharacter.update(
          direction, 
          deltaTime, 
          { width: worldWidth, height: worldHeight }, 
          [orbCharacter],
          worldEnvironment,
          viewportOffset
        )
      }
      
      // Update Orb only if AI isn't handling it and not transitioning
      if (!orbAI && !isTransitioning) {
        orbCharacter.update(
          { x: 0, y: 0 }, 
          deltaTime, 
          { width: worldWidth, height: worldHeight }, 
          [garyCharacter],
          worldEnvironment,
          viewportOffset
        )
      }
      
      // Update viewport to follow Gary character (only if not transitioning)
      if (!isTransitioning) {
        const targetViewportX = garyCharacter.position.x - dimensions.width / 2 + garyCharacter.frameWidth * garyCharacter.scale / 2
        const targetViewportY = garyCharacter.position.y - dimensions.height / 2 + garyCharacter.frameHeight * garyCharacter.scale / 2
        
        // Clamp viewport to world boundaries
        const clampedViewportX = Math.max(0, Math.min(worldWidth - dimensions.width, targetViewportX))
        const clampedViewportY = Math.max(0, Math.min(worldHeight - dimensions.height, targetViewportY))
        
        // Smooth camera movement
        setViewportOffset(prev => ({
          x: prev.x + (clampedViewportX - prev.x) * 0.1,
          y: prev.y + (clampedViewportY - prev.y) * 0.1
        }))
      }
      
      // Render world environment with viewport offset
      worldEnvironment.render(ctx, viewportOffset.x, viewportOffset.y, dimensions.width, dimensions.height)
      
      // Calculate character screen positions based on world positions and viewport
      const garyScreenX = garyCharacter.position.x - viewportOffset.x
      const garyScreenY = garyCharacter.position.y - viewportOffset.y
      const orbScreenX = orbCharacter.position.x - viewportOffset.x
      const orbScreenY = orbCharacter.position.y - viewportOffset.y
      
      // Update character positions for rendering
      garyCharacter.position = { x: garyScreenX, y: garyScreenY }
      orbCharacter.position = { x: orbScreenX, y: orbScreenY }
      
      // Check for greeting between characters
      if (garyCharacter.isCloseTo(orbCharacter) && keys.Space && !garyCharacter.isGreeting && !orbCharacter.isGreeting) {
        // Determine which side each character is on
        const isGaryOnLeft = garyCharacter.position.x < orbCharacter.position.x
        
        // Start greeting animations
        garyCharacter.startGreeting(isGaryOnLeft)
        orbCharacter.startGreeting(!isGaryOnLeft)
      }
      
      // Render characters
      garyCharacter.render(ctx)
      orbCharacter.render(ctx)
      
      // Reset character positions to world positions
      garyCharacter.position = { x: garyScreenX + viewportOffset.x, y: garyScreenY + viewportOffset.y }
      orbCharacter.position = { x: orbScreenX + viewportOffset.x, y: orbScreenY + viewportOffset.y }
      
      // Draw instructions on canvas
      if (!isTransitioning) {
        let instructionText = ''
        // Check for door proximity
        let nearDoor = false
        for (const decoration of worldEnvironment.decorations) {
          if (decoration.isDoor) {
            const doorBounds = decoration.getBounds()
            const garyBounds = {
              x: garyCharacter.position.x,
              y: garyCharacter.position.y,
              width: garyCharacter.frameWidth * garyCharacter.scale,
              height: garyCharacter.frameHeight * garyCharacter.scale
            }
            if (
              garyBounds.x < doorBounds.x + doorBounds.width &&
              garyBounds.x + garyBounds.width > doorBounds.x &&
              garyBounds.y < doorBounds.y + doorBounds.height &&
              garyBounds.y + garyBounds.height > doorBounds.y
            ) {
              nearDoor = true
              instructionText = 'Press E to enter'
              break
            }
          }
        }

        if (!nearDoor) {
          if (!garyCharacter.isCloseTo(orbCharacter)) {
            instructionText = 'Use arrow keys to move Gary. Explore!'
          } else if (!garyCharacter.isGreeting && !orbCharacter.isGreeting) {
            instructionText = 'Press SPACE to greet Orb!'
          }
        }
        
        if (instructionText) {
          ctx.font = '18px Arial'
          ctx.fillStyle = nearDoor ? 'cyan' : (garyCharacter.isCloseTo(orbCharacter) ? 'yellow' : 'white')
          ctx.textAlign = 'center'
          ctx.fillText(instructionText, dimensions.width / 2, dimensions.height - 30)
        }
      }
      
      // Draw minimap
      drawMinimap(ctx, worldWidth, worldHeight, dimensions)

      // Draw transition overlay
      if (transitionAlpha > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${transitionAlpha})`
        ctx.fillRect(0, 0, dimensions.width, dimensions.height)
      }
      
      animationRef.current = requestAnimationFrame(gameLoop)
    }
    
    animationRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, garyCharacter, orbCharacter, worldEnvironment, viewportOffset, keys, orbAI])
  
  // Draw a minimap in the corner
  const drawMinimap = (ctx: CanvasRenderingContext2D, worldWidth: number, worldHeight: number, dimensions: { width: number, height: number }) => {
    const minimapWidth = 150
    const minimapHeight = 150
    const minimapX = dimensions.width - minimapWidth - 10
    const minimapY = 10
    const minimapScale = Math.min(minimapWidth / worldWidth, minimapHeight / worldHeight)
    
    // Draw minimap background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(minimapX, minimapY, minimapWidth, minimapHeight)
    ctx.strokeStyle = 'white'
    ctx.strokeRect(minimapX, minimapY, minimapWidth, minimapHeight)
    
    // Draw viewport area on minimap
    const vpX = minimapX + viewportOffset.x * minimapScale
    const vpY = minimapY + viewportOffset.y * minimapScale
    const vpWidth = dimensions.width * minimapScale
    const vpHeight = dimensions.height * minimapScale
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.strokeRect(vpX, vpY, vpWidth, vpHeight)
    
    // Draw character positions on minimap
    if (garyCharacter) {
      const garyX = minimapX + (garyCharacter.position.x) * minimapScale
      const garyY = minimapY + (garyCharacter.position.y) * minimapScale
      
      ctx.fillStyle = 'blue'
      ctx.beginPath()
      ctx.arc(garyX, garyY, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    
    if (orbCharacter) {
      const orbX = minimapX + (orbCharacter.position.x) * minimapScale
      const orbY = minimapY + (orbCharacter.position.y) * minimapScale
      
      ctx.fillStyle = 'purple'
      ctx.beginPath()
      ctx.arc(orbX, orbY, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  return (
    <>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-2xl"
      />
      
      {/* Display Orb's task information */}
      {orbAI && (
        <TaskDisplay
          characterName="Orb"
          task={orbAI.getTask()}
          completedTasks={orbAI.getCompletedTasks()}
        />
      )}
    </>
  )
} 