export function PixelatedStars() {
  // Generate an array of stars with random positions
  const stars = Array.from({ length: 30 }, (_, i) => {
    const top = Math.floor(Math.random() * 100)
    const left = Math.floor(Math.random() * 100)
    const size = Math.floor(Math.random() * 3) + 1 // 1-3px
    const delay = Math.floor(Math.random() * 4) // 0-3s
    const duration = Math.floor(Math.random() * 3) + 2 // 2-4s
    const color = Math.random() > 0.7 ? "#FFD86E" : "#3DB9FC" // 70% blue, 30% yellow

    return { top, left, size, delay, duration, color, id: i }
  })

  return (
    <>
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
            animationName: 'twinkle',
            animationDuration: `${star.duration}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </>
  )
}
