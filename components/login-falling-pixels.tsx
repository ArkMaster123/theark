"use client"

import { useEffect, useState, useRef } from "react"

interface Pixel {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
  opacity: number
  rotation?: number
  rotationSpeed?: number
}

export function LoginFallingPixels() {
  const [pixels, setPixels] = useState<Pixel[]>([])
  const nextPixelId = useRef(0)

  useEffect(() => {
    // Create initial pixels - more of them for the login page
    const initialPixels: Pixel[] = Array.from({ length: 25 }, () => createPixel(nextPixelId.current++))
    setPixels(initialPixels)

    // Animation frame for falling pixels
    let animationId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (time - lastTime > 100) {
        // Update every 100ms for a pixelated effect
        lastTime = time

        setPixels((prevPixels) => {
          // Move existing pixels down and apply rotation
          const updatedPixels = prevPixels.map((pixel) => ({
            ...pixel,
            y: pixel.y + pixel.speed,
            rotation: pixel.rotation ? pixel.rotation + pixel.rotationSpeed! : undefined,
          }))

          // Remove pixels that have fallen off screen and add new ones
          const filteredPixels = updatedPixels.filter((pixel) => pixel.y < window.innerHeight)
          const newPixelsNeeded = 25 - filteredPixels.length

          if (newPixelsNeeded > 0) {
            const newPixels = Array.from({ length: newPixelsNeeded }, () => createPixel(nextPixelId.current++))
            return [...filteredPixels, ...newPixels]
          }

          return filteredPixels
        })
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  const createPixel = (id: number): Pixel => {
    // More colors including some brighter options for the login page
    const colors = [
      "#F8E8BE", "#FFD86E", "#3DB9FC", "#2A623D", "#5D4777", 
      "#FF9D6E", "#64FFDA", "#FF5E78", "#A076F9", "#FFDF6B"
    ]
    
    // Some pixels will rotate
    const shouldRotate = Math.random() > 0.6
    const rotation = shouldRotate ? Math.random() * 360 : undefined
    const rotationSpeed = shouldRotate ? (Math.random() - 0.5) * 2 : undefined // -1 to 1
    
    // Slightly larger size range
    const size = Math.floor(Math.random() * 4) + 1 // 1-4px

    return {
      id,
      x: Math.random() * window.innerWidth,
      y: -10 - Math.random() * 100, // Start above the viewport
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2 + 0.5, // 0.5-2.5px per frame (slightly faster)
      opacity: Math.random() * 0.6 + 0.4, // 0.4-1.0 opacity (more visible)
      rotation,
      rotationSpeed,
    }
  }

  return (
    <>
      {pixels.map((pixel) => (
        <div
          key={pixel.id}
          className="absolute pixelated"
          style={{
            left: `${pixel.x}px`,
            top: `${pixel.y}px`,
            width: `${pixel.size}px`,
            height: `${pixel.size}px`,
            backgroundColor: pixel.color,
            opacity: pixel.opacity,
            transform: pixel.rotation !== undefined ? `rotate(${pixel.rotation}deg)` : undefined,
            boxShadow: pixel.size > 2 ? `0 0 ${pixel.size}px ${pixel.color}` : undefined,
          }}
        />
      ))}
    </>
  )
} 