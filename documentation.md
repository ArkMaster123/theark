# The Ark: Character World Documentation

## Overview

The Character World is an interactive environment where animated characters can move around, interact with each other, and engage with the surrounding world. This document provides details about the implementation, features, and assets used in creating this virtual world.

## Current Implementation

### Character System

- **Characters**: Currently featuring two main characters:
  - **Gary**: A human character in business attire with a red tie
  - **Orb**: A robot character that holds a glowing orb

- **Animation System**:
  - Full sprite sheet animation (4 rows × 4 columns)
  - Four directional movement (front, left, right, back)
  - Animation states: idle, walking, greeting
  - Smooth transitions between states

- **Movement**:
  - Keyboard-controlled movement with arrow keys
  - Variable speed and direction
  - Collision detection between characters

- **Interaction**:
  - Characters can approach each other
  - When close, they can trigger greeting animations using the space bar
  - Custom greeting animations appear above characters

## World Environment

The world is currently a simple canvas with a gradient background. In our next update, we'll be implementing a rich environment using the available assets:

### Available Assets

#### Outdoor Decorations
- **Trees**: Oak trees in various sizes for creating forest areas
- **House**: Building structure that can serve as a landmark or shelter
- **Fences**: For creating boundaries and enclosed areas
- **Chest**: Interactive element for potential item storage
- **Bridge**: For crossing water elements
- **Miscellaneous Decor**: Various decoration elements to enhance the environment

#### Terrain Tiles
- **Grass**: Base terrain for most of the world
- **Water**: For creating lakes, rivers, and ponds
- **Paths**: For creating walkways and roads
- **Beach**: For transition between water and land
- **Farmland**: For agricultural areas
- **Cliffs**: For creating elevation and terrain variety

#### Animals
- **Sheep**: Wandering passive entities
- **Pig**: Wandering passive entities
- **Cow**: Wandering passive entities
- **Chicken**: Wandering passive entities

## Planned Enhancements

### Environment Integration
- Implement a tile-based world using the terrain assets
- Add decorative elements like trees, houses, and fences
- Create water features with bridges for crossing
- Add interactive elements like chests

### Animal Integration
- Add wandering animals with simple AI behavior
- Allow characters to interact with animals

### Enhanced Interaction
- Character dialogue system
- Item collection and inventory
- Simple quests or objectives

### Technical Improvements
- Minimap for navigation
- Day/night cycle
- Weather effects
- Sound effects and background music

## How to Use

1. **Navigation**: Use the arrow keys to move the Gary character around the world
2. **Interaction**: Press the Space bar when near Orb to trigger greeting animations
3. **Controls Panel**: Provides instructions and can be minimized when not needed

## Technical Details

The Character World is built using:
- Next.js for page routing
- React for component-based UI
- HTML Canvas API for rendering
- TypeScript for type safety
- Custom game loop for animation and physics

## Directory Structure

```
/app/home          - Home page route
/components/       - React components
  character-world.tsx  - Main game canvas component
  instructions-panel.tsx - UI for game controls
/hooks/            - Custom React hooks
  use-character-controls.ts - Keyboard input handler
/lib/              - Core game logic
  character.ts     - Character class for animation and movement
/public/images/    - Image assets
  garysprite.png   - Gary character sprite sheet
  orbsprite.png    - Orb character sprite sheet
  left.png         - Left greeting animation
  right.png        - Right greeting animation
  assets/          - World assets (tiles, decorations, animals)
```

## Future Roadmap

1. **Phase 1**: Implement tile-based environment with decorative elements
2. **Phase 2**: Add animal NPCs with basic AI behavior
3. **Phase 3**: Implement interactive objects and simple quests
4. **Phase 4**: Add weather, day/night cycle, and sound effects
5. **Phase 5**: Create multiplayer capabilities 