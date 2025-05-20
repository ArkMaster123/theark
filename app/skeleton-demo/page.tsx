'use client'

import SkeletonCharacterWorld from '@/components/skeleton-character-world'

export default function SkeletonDemoPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Skeleton-Based Animation System</h1>
        <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
          This demo showcases a skeleton-based animation system for pixel art characters.
          Characters are animated using bones and keyframes rather than traditional sprite sheets.
        </p>
        
        <SkeletonCharacterWorld />
        
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <p className="mb-4">
            The skeleton animation system uses a hierarchical bone structure to control character movement.
            Each bone affects a portion of the character sprite, allowing for natural, fluid animations 
            created by interpolating between keyframes.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Key Features:</h3>
          <ul className="list-disc pl-8 space-y-2">
            <li>Hierarchical bone system (parent-child relationships)</li>
            <li>Keyframe animation with smooth interpolation</li>
            <li>Support for multiple animation states (idle, walk, greeting)</li>
            <li>Direction-based movement (8-way movement)</li>
            <li>Debug mode to visualize bone structure</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Controls:</h3>
          <ul className="list-disc pl-8 space-y-1">
            <li>Arrow keys: Move the character</li>
            <li>Spacebar: Greet when close to another character</li>
            <li>D key: Toggle debug mode</li>
          </ul>
        </div>
      </div>
    </main>
  )
} 