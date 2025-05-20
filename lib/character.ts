import { WorldEnvironment } from './world-environment'

export interface CharacterProps {
  spriteSheet: string
  name: string
  cols?: number        // Number of columns in the sprite sheet (default 4)
  rows?: number        // Number of rows in the sprite sheet (default 4)
  frameWidth?: number  // Width of each frame (will be auto-calculated if not provided)
  frameHeight?: number // Height of each frame (will be auto-calculated if not provided)
  scale: number
  position: { x: number, y: number }
  speed: number
}

export enum Direction {
  FRONT = 0, // Top row (front-facing)
  LEFT = 1,  // Bottom row (side-facing)
  RIGHT = 1, // Bottom row (side-facing) - will flip horizontally
  BACK = 1   // Bottom row (side-facing) - will use appropriate frames
}

export enum AnimationState {
  IDLE = 0,
  WALKING = 1,
  GREETING = 2
}

export class Character {
  public image: HTMLImageElement
  public name: string
  public frameWidth: number
  public frameHeight: number
  public scale: number
  public position: { x: number, y: number }
  public speed: number
  public direction: Direction
  public state: AnimationState
  public frameIndex: number
  public animationSpeed: number
  public lastFrameTime: number
  public loaded: boolean
  public isGreeting: boolean
  public greetingImage: HTMLImageElement | null
  public greetingAnimationFrame: number
  public greetingDuration: number
  public greetingTimer: number
  public cols: number   // Number of columns in the sprite sheet
  public rows: number   // Number of rows in the sprite sheet
  
  constructor(props: CharacterProps) {
    this.image = new Image()
    this.image.src = props.spriteSheet
    this.name = props.name
    this.frameWidth = props.frameWidth || 0
    this.frameHeight = props.frameHeight || 0
    this.scale = props.scale
    this.position = { ...props.position }
    this.speed = props.speed
    this.cols = props.cols ?? 4  // Default to 4 columns if not specified
    this.rows = props.rows ?? 4  // Default to 4 rows if not specified
    
    // Default values
    this.direction = Direction.FRONT
    this.state = AnimationState.IDLE
    this.frameIndex = 0
    this.animationSpeed = 150 // ms per frame
    this.lastFrameTime = 0
    this.loaded = false
    
    // Greeting properties
    this.isGreeting = false
    this.greetingImage = null
    this.greetingAnimationFrame = 0
    this.greetingDuration = 2000 // 2 seconds
    this.greetingTimer = 0
  }
  
  async load(): Promise<void> {
    return new Promise((resolve) => {
      this.image.onload = () => {
        // Auto-calculate frame dimensions if not provided
        if (!this.frameWidth || !this.frameHeight) {
          this.frameWidth = Math.floor(this.image.width / this.cols)
          this.frameHeight = Math.floor(this.image.height / this.rows)
          console.log(`Auto-detected frame size for ${this.name} sprite sheet: ${this.frameWidth}x${this.frameHeight}, from image ${this.image.width}x${this.image.height}`)
        }
        
        this.loaded = true
        resolve()
      }
    })
  }
  
  async loadGreetingAnimation(isLeftSide: boolean): Promise<void> {
    if (this.greetingImage) return Promise.resolve()
    
    this.greetingImage = new Image()
    this.greetingImage.src = isLeftSide ? '/images/left.png' : '/images/right.png'
    
    return new Promise((resolve) => {
      this.greetingImage!.onload = () => {
        resolve()
      }
    })
  }
  
  startGreeting(isLeftSide: boolean): void {
    if (this.isGreeting) return
    
    this.loadGreetingAnimation(isLeftSide).then(() => {
      this.isGreeting = true
      this.state = AnimationState.GREETING
      this.greetingAnimationFrame = 0
      this.greetingTimer = 0
    })
  }
  
  updateGreeting(deltaTime: number): void {
    if (!this.isGreeting) return
    
    this.greetingTimer += deltaTime
    
    // Update greeting animation frame
    if (this.greetingTimer >= this.animationSpeed) {
      this.greetingAnimationFrame = (this.greetingAnimationFrame + 1) % 5 // assuming 5 frames in greeting
      this.greetingTimer = 0
    }
    
    // End greeting after duration
    if (this.greetingTimer >= this.greetingDuration) {
      this.isGreeting = false
      this.state = AnimationState.IDLE
    }
  }
  
  update(
    direction: { x: number, y: number },
    deltaTime: number,
    canvasDimensions: { width: number, height: number },
    otherCharacters: Character[],
    worldEnvironment?: WorldEnvironment,
    viewportOffset?: { x: number, y: number }
  ): void {
    // Handle greeting animation
    if (this.isGreeting) {
      this.updateGreeting(deltaTime)
      return // Skip movement when greeting
    }
    
    // Update animation state
    if (direction.x === 0 && direction.y === 0) {
      this.state = AnimationState.IDLE
    } else {
      this.state = AnimationState.WALKING
    }
    
    // Update direction
    if (direction.x < 0) this.direction = Direction.LEFT
    else if (direction.x > 0) this.direction = Direction.RIGHT
    else if (direction.y < 0) this.direction = Direction.BACK
    else if (direction.y > 0) this.direction = Direction.FRONT
    
    // Update animation frame
    this.lastFrameTime += deltaTime
    if (this.lastFrameTime >= this.animationSpeed) {
      this.lastFrameTime = 0
      
      // If walking, cycle through walk frames
      if (this.state === AnimationState.WALKING) {
        // Walking frames are 1-4 (columns 1-4)
        this.frameIndex = (this.frameIndex + 1) % 4 + 1
      } else {
        this.frameIndex = 0 // Idle frame is 0
      }
    }
    
    // Calculate new position
    const newPosition = { 
      x: this.position.x + direction.x * this.speed, 
      y: this.position.y + direction.y * this.speed 
    }
    
    // Check canvas boundaries
    const scaledWidth = this.frameWidth * this.scale
    const scaledHeight = this.frameHeight * this.scale
    
    if (newPosition.x < 0) newPosition.x = 0
    if (newPosition.y < 0) newPosition.y = 0
    if (newPosition.x + scaledWidth > canvasDimensions.width) {
      newPosition.x = canvasDimensions.width - scaledWidth
    }
    if (newPosition.y + scaledHeight > canvasDimensions.height) {
      newPosition.y = canvasDimensions.height - scaledHeight
    }
    
    // Character collision bounds, slightly smaller than the full sprite
    const collisionBounds = {
      x: newPosition.x + scaledWidth * 0.2,
      y: newPosition.y + scaledHeight * 0.6, // Focus on feet area
      width: scaledWidth * 0.6,
      height: scaledHeight * 0.3
    }
    
    // Check collision with other characters
    const hasCharacterCollision = this.checkCollisions(collisionBounds, otherCharacters)
    
    // Check collisions with world decorations and tiles
    let hasEnvironmentCollision = false
    if (worldEnvironment) {
      // Convert character position to world coordinates if viewport is provided
      const worldX = viewportOffset ? newPosition.x + viewportOffset.x : newPosition.x
      const worldY = viewportOffset ? newPosition.y + viewportOffset.y : newPosition.y
      
      // Check if all corners of the collision box are on walkable tiles
      const bottomLeftWalkable = worldEnvironment.isWalkable(worldX + collisionBounds.x, worldY + collisionBounds.y + collisionBounds.height)
      const bottomRightWalkable = worldEnvironment.isWalkable(worldX + collisionBounds.x + collisionBounds.width, worldY + collisionBounds.y + collisionBounds.height)
      const isOnWalkableTile = bottomLeftWalkable && bottomRightWalkable
      
      // Adjust world coordinates for decoration collision
      const worldCollisionBounds = {
        x: worldX + collisionBounds.x - (viewportOffset?.x || 0),
        y: worldY + collisionBounds.y - (viewportOffset?.y || 0),
        width: collisionBounds.width,
        height: collisionBounds.height
      }
      
      const hasDecorationCollision = worldEnvironment.checkDecorationCollision(worldCollisionBounds)
      
      hasEnvironmentCollision = !isOnWalkableTile || hasDecorationCollision
    }
    
    if (!hasCharacterCollision && !hasEnvironmentCollision) {
      // Update position if no collision
      this.position = newPosition
    }
  }
  
  checkCollisions(collisionBounds: { x: number, y: number, width: number, height: number }, otherCharacters: Character[]): boolean {
    for (const other of otherCharacters) {
      const otherCollisionBounds = {
        x: other.position.x + other.frameWidth * other.scale * 0.2,
        y: other.position.y + other.frameHeight * other.scale * 0.6,
        width: other.frameWidth * other.scale * 0.6,
        height: other.frameHeight * other.scale * 0.3
      }
      
      // Simple AABB collision detection
      if (
        collisionBounds.x < otherCollisionBounds.x + otherCollisionBounds.width &&
        collisionBounds.x + collisionBounds.width > otherCollisionBounds.x &&
        collisionBounds.y < otherCollisionBounds.y + otherCollisionBounds.height &&
        collisionBounds.y + collisionBounds.height > otherCollisionBounds.y
      ) {
        return true
      }
    }
    
    return false
  }
  
  isCloseTo(other: Character): boolean {
    const myCenter = {
      x: this.position.x + (this.frameWidth * this.scale) / 2,
      y: this.position.y + (this.frameHeight * this.scale) / 2,
    }
    
    const otherCenter = {
      x: other.position.x + (other.frameWidth * other.scale) / 2,
      y: other.position.y + (other.frameHeight * other.scale) / 2,
    }
    
    const distance = Math.sqrt(
      Math.pow(myCenter.x - otherCenter.x, 2) +
      Math.pow(myCenter.y - otherCenter.y, 2)
    )
    
    return distance < 150
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.loaded) return
    
    // Render greeting animation if active
    if (this.isGreeting && this.greetingImage) {
      const greetingFrameWidth = this.greetingImage.width / 5 // Assuming 5 frames
      const greetingFrameHeight = this.greetingImage.height
      
      const srcX = this.greetingAnimationFrame * greetingFrameWidth
      const srcY = 0
      
      const destX = this.position.x
      const destY = this.position.y - 50 // Above the character
      const destWidth = greetingFrameWidth * this.scale
      const destHeight = greetingFrameHeight * this.scale
      
      ctx.drawImage(
        this.greetingImage,
        srcX, srcY, greetingFrameWidth, greetingFrameHeight,
        destX, destY, destWidth, destHeight
      )
    }
    
    // Calculate source rectangle based on the sprite sheet layout
    // - Top row (0): Front-facing animations (5 frames)
    // - Bottom row (1): Side/back-facing animations (5 frames)
    
    // Determine the row based on direction
    let srcY = this.direction * this.frameHeight
    
    // Determine the column based on animation state and direction
    let srcX = 0
    let frameOffset = 0
    
    if (this.state === AnimationState.IDLE) {
      // Use the first frame in each row for idle
      srcX = 0
    } else {
      // For walking animations, adjust based on direction and animation frame
      if (this.direction === Direction.FRONT) {
        // Front-facing walking uses frames 1-4 in the top row
        frameOffset = this.frameIndex
      } else if (this.direction === Direction.BACK) {
        // Back-facing (in this sprite sheet, we use back-most side frames)
        frameOffset = this.frameIndex + 1 // Use frames 2-4 from bottom row 
      } else {
        // Side-facing (LEFT direction)
        frameOffset = this.frameIndex
      }
      
      srcX = frameOffset * this.frameWidth
    }
    
    // Ensure source coordinates are within the image bounds
    srcX = Math.min(srcX, this.image.width - this.frameWidth)
    srcY = Math.min(srcY, this.image.height - this.frameHeight)
    
    // Calculate destination rectangle
    const destX = this.position.x
    const destY = this.position.y
    const destWidth = this.frameWidth * this.scale
    const destHeight = this.frameHeight * this.scale
    
    // Special handling for RIGHT and BACK directions
    let flipHorizontal = false
    
    // For RIGHT direction, use LEFT frames but flip horizontally
    if (this.direction === Direction.RIGHT) {
      flipHorizontal = true
    }
    
    // Draw character
    if (flipHorizontal) {
      // For right-facing, use left frames but flip horizontally
      ctx.save()
      ctx.scale(-1, 1) // Flip horizontally
      ctx.drawImage(
        this.image,
        srcX, srcY, this.frameWidth, this.frameHeight,
        -destX - destWidth, destY, destWidth, destHeight // Adjust x-position for flipping
      )
      ctx.restore()
    } else {
      // Normal drawing for other directions
      ctx.drawImage(
        this.image,
        srcX, srcY, this.frameWidth, this.frameHeight,
        destX, destY, destWidth, destHeight
      )
    }
    
    // Debug outline to see exact rendering bounds
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)' // Make the outline more transparent
    ctx.strokeRect(destX, destY, destWidth, destHeight)
    
    // Draw character name
    ctx.font = '12px Arial'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText(
      this.name,
      destX + destWidth / 2,
      destY - 5
    )
  }
} 