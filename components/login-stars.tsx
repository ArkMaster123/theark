"use client"

import { useEffect, useState } from "react"

export function LoginStars() {
  const [shootingStars, setShootingStars] = useState<any[]>([])

  // Generate regular stars with bigger sizes
  const stars = Array.from({ length: 45 }, (_, i) => {
    const top = Math.floor(Math.random() * 100)
    const left = Math.floor(Math.random() * 100)
    const size = Math.floor(Math.random() * 4) + 2 // 2-5px (bigger than original)
    const delay = Math.floor(Math.random() * 4) // 0-3s
    const duration = Math.floor(Math.random() * 3) + 2 // 2-4s
    const color = Math.random() > 0.7 ? "#FFD86E" : "#3DB9FC" // 70% blue, 30% yellow
    
    // Add subtle pulsing for some stars
    const isPulsing = Math.random() > 0.6
    const pulseScale = isPulsing ? `transform-origin: center; animation: pulse ${Math.random() * 2 + 3}s infinite alternate;` : ''

    return { top, left, size, delay, duration, color, id: i, isPulsing, pulseScale }
  })

  // Create shooting stars periodically
  useEffect(() => {
    // Create a new shooting star
    const createShootingStar = () => {
      const id = Date.now()
      const startTop = Math.floor(Math.random() * 50) // Start in top half
      const startLeft = Math.floor(Math.random() * 100)
      const length = Math.floor(Math.random() * 100) + 50 // Length of trail 50-150px
      const angle = Math.floor(Math.random() * 45) + 15 // 15-60 degrees
      const duration = Math.floor(Math.random() * 2) + 1 // 1-3s
      const size = Math.floor(Math.random() * 2) + 1 // 1-2px
      
      return { id, startTop, startLeft, angle, duration, size, length }
    }

    // Add a new shooting star every 3-8 seconds
    const addShootingStar = () => {
      setShootingStars(prev => [...prev, createShootingStar()])
      
      // Remove old shooting stars to prevent memory issues
      if (shootingStars.length > 5) {
        setShootingStars(prev => prev.slice(1))
      }
      
      // Schedule next shooting star
      const nextDelay = Math.random() * 5000 + 3000 // 3-8 seconds
      setTimeout(addShootingStar, nextDelay)
    }

    // Start the shooting star sequence
    const timer = setTimeout(addShootingStar, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Regular stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute pixelated"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: star.size > 3 ? `0 0 ${star.size}px ${star.color}` : 'none',
            animationName: 'twinkle',
            animationDuration: `${star.duration}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            top: `${star.startTop}%`,
            left: `${star.startLeft}%`,
            width: `${star.length}px`,
            height: `${star.size}px`,
            background: `linear-gradient(90deg, transparent, #FFD86E 25%, #FFD86E)`,
            transform: `rotate(${star.angle}deg)`,
            opacity: 0,
            animation: `shooting-star ${star.duration}s ease-in forwards`,
            zIndex: 1,
          }}
        />
      ))}

      {/* Add keyframes for shooting stars */}
      <style jsx global>{`
        @keyframes shooting-star {
          0% {
            transform: translateX(0) rotate(${Math.floor(Math.random() * 45) + 15}deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(${Math.floor(Math.random() * 100) + 150}px) rotate(${Math.floor(Math.random() * 45) + 15}deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
} 