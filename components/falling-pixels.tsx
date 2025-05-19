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
}

export function FallingPixels() {
  const [pixels, setPixels] = useState<Pixel[]>([])
  const nextPixelId = useRef(0)

  useEffect(() => {
    // Create initial pixels
    const initialPixels: Pixel[] = Array.from({ length: 15 }, () => createPixel(nextPixelId.current++))
    setPixels(initialPixels)

    // Animation frame for falling pixels
    let animationId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (time - lastTime > 100) {
        // Update every 100ms for a pixelated effect
        lastTime = time

        setPixels((prevPixels) => {
          // Move existing pixels down
          const updatedPixels = prevPixels.map((pixel) => ({
            ...pixel,
            y: pixel.y + pixel.speed,
          }))

          // Remove pixels that have fallen off screen and add new ones
          const filteredPixels = updatedPixels.filter((pixel) => pixel.y < window.innerHeight)
          const newPixelsNeeded = 15 - filteredPixels.length

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
    const colors = ["#F8E8BE", "#FFD86E", "#3DB9FC", "#2A623D", "#5D4777"]

    return {
      id,
      x: Math.random() * window.innerWidth,
      y: -10 - Math.random() * 100, // Start above the viewport
      size: Math.floor(Math.random() * 3) + 1, // 1-3px
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 1.5 + 0.5, // 0.5-2px per frame
      opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8 opacity
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
          }}
        />
      ))}
    </>
  )
}
