# The Ark: Home Page Plan

## Overview
Create an interactive home page ("/home") where characters can move around and interact with each other through cute animations.

## Key Features

### 1. Character System
- Two characters initially: Gary and Orb-of-Chaos robot
- Full sprite animation support (idle, walking in 4 directions)
- Smooth character movement using keyboard controls
- Character collision detection

### 2. Animation System
- Sprite sheet rendering (4 rows × 4 columns)
- Direction-based animation (front, left, right, back)
- Animation states (idle, walking)
- Custom greeting animations between characters

### 3. World Environment
- Open area for characters to explore
- Boundaries to keep characters in the viewable area
- Simple UI for user instructions
- Potential for adding environment objects later

### 4. Interaction Mechanics
- Characters can approach each other
- When characters are close, they can trigger greeting animations
- Simple chat or emote system between characters

## Technical Implementation

### Sprite Sheet Specifications
- **Gary & Orb Robot**: 16×9 aspect ratio (1920×1080px)
- Each cell: 480×270px
- Layout:
  - Row 1: Front-facing (idle, walk-1, walk-2, walk-3)
  - Row 2: Left-facing (idle, walk-1, walk-2, walk-3)
  - Row 3: Right-facing (idle, walk-1, walk-2, walk-3)
  - Row 4: Back-facing (idle, walk-1, walk-2, walk-3)

### Animation Assets
- Character sprites: 
  - `public/images/garysprite.png`
  - `public/images/orbsprite.png`
- Greeting animations:
  - `public/images/left.png`
  - `public/images/right.png`

### Tech Stack
- Next.js for page routing and structure
- React for component-based UI
- Canvas API for rendering sprites and animations
- State management for character positions and animations

## Development Phases
1. Set up basic Next.js project structure
2. Create character sprite rendering system
3. Implement character movement controls
4. Add collision detection
5. Develop greeting animation system
6. Polish UI and instructions 