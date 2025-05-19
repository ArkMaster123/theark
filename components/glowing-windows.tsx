export function GlowingWindows() {
  // Window positions are relative to the main image
  const windows = [
    { top: "32%", left: "42%", width: "5%", height: "5%" }, // Top window
    { top: "48%", left: "42%", width: "5%", height: "5%" }, // Middle window
    { top: "48%", left: "65%", width: "7%", height: "7%" }, // Right window
  ]

  return (
    <>
      {windows.map((window, index) => (
        <div
          key={index}
          className="absolute pixelated animate-pulse-glow"
          style={{
            top: window.top,
            left: window.left,
            width: window.width,
            height: window.height,
            backgroundColor: "rgba(255, 216, 110, 0.2)",
            boxShadow: "0 0 10px rgba(255, 216, 110, 0.5)",
            animationDelay: `${index * 0.5}s`,
          }}
        />
      ))}
    </>
  )
}
