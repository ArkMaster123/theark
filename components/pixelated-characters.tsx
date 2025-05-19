"use client"

import { useState } from "react"

export function PixelatedCharacters() {
  const [hoveredCharacter, setHoveredCharacter] = useState<number | null>(null)

  const characters = [
    { bottom: "15%", left: "20%", width: "8%", height: "12%", delay: "0.2s", id: 1 },
    { bottom: "15%", left: "45%", width: "8%", height: "12%", delay: "0.7s", id: 2 },
    { bottom: "15%", right: "20%", width: "8%", height: "12%", delay: "1.2s", id: 3 },
  ]

  return (
    <>
      {characters.map((character) => (
        <div
          key={character.id}
          className={`absolute pixelated cursor-pointer ${
            hoveredCharacter === character.id ? "animate-bounce" : "animate-bob"
          }`}
          style={{
            bottom: character.bottom,
            left: character.left,
            right: character.right,
            width: character.width,
            height: character.height,
            animationDelay: character.delay,
          }}
          onMouseEnter={() => setHoveredCharacter(character.id)}
          onMouseLeave={() => setHoveredCharacter(null)}
        />
      ))}
    </>
  )
}
