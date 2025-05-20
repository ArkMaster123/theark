import { SkeletonSystem } from "./skeleton";
import { SkeletonDirection } from "@/types/skeleton";
import { WorldEnvironment } from "./world-environment";

export interface SkeletonCharacterProps {
  spriteSheet: string;
  name: string;
  position: { x: number, y: number };
  scale: number;
  speed: number;
  sliceDefinitions?: SpriteSliceDefinition[];
  boneDefinitions?: BoneDefinition[];
}

interface SpriteSliceDefinition {
  id: string;
  boneId: string;
  position: { x: number, y: number };
  rotation: number;
  pivotX: number;
  pivotY: number;
  width: number;
  height: number;
  imageX: number;
  imageY: number;
  imageWidth: number;
  imageHeight: number;
}

interface BoneDefinition {
  id: string;
  position: { x: number, y: number };
  parentId: string | null;
  length: number;
  rotation: number;
}

export class SkeletonCharacter {
  public name: string;
  public position: { x: number, y: number };
  public scale: number;
  public speed: number;
  public isGreeting: boolean = false;
  public skeleton: SkeletonSystem;
  public direction: SkeletonDirection = SkeletonDirection.SOUTH;
  public loaded: boolean = false;
  
  private lastFrameTime: number = 0;
  private greetingTimer: number = 0;
  private greetingDuration: number = 2000; // 2 seconds
  
  constructor(props: SkeletonCharacterProps) {
    this.name = props.name;
    this.position = { ...props.position };
    this.scale = props.scale;
    this.speed = props.speed;
    
    // Initialize skeleton
    this.skeleton = new SkeletonSystem(props.spriteSheet);
    
    // Set up default bones and slices if not provided
    if (!props.boneDefinitions || props.boneDefinitions.length === 0) {
      this.setupDefaultSkeleton();
    } else {
      // Set up custom bones
      props.boneDefinitions.forEach(def => {
        this.skeleton.createBone(
          def.id,
          def.position,
          def.parentId,
          def.length,
          def.rotation
        );
      });
    }
    
    // Set up default or custom slices
    if (props.sliceDefinitions && props.sliceDefinitions.length > 0) {
      props.sliceDefinitions.forEach(def => {
        this.skeleton.addSlice({
          id: def.id,
          boneId: def.boneId,
          position: def.position,
          rotation: def.rotation,
          pivotX: def.pivotX,
          pivotY: def.pivotY,
          width: def.width,
          height: def.height,
          imageX: def.imageX,
          imageY: def.imageY,
          imageWidth: def.imageWidth,
          imageHeight: def.imageHeight
        });
      });
    }
    
    // Set up default animations
    this.setupDefaultAnimations();
  }
  
  /**
   * Set up a basic skeleton structure if none is provided
   */
  private setupDefaultSkeleton(): void {
    // Create root (torso)
    this.skeleton.createBone('torso', { x: 0, y: 0 }, null, 20, 0);
    
    // Create head
    this.skeleton.createBone('head', { x: 0, y: -15 }, 'torso', 10, 0);
    
    // Create arms
    this.skeleton.createBone('leftArm', { x: -10, y: -5 }, 'torso', 15, Math.PI / 4);
    this.skeleton.createBone('rightArm', { x: 10, y: -5 }, 'torso', 15, -Math.PI / 4);
    
    // Create legs
    this.skeleton.createBone('leftLeg', { x: -5, y: 15 }, 'torso', 15, Math.PI / 8);
    this.skeleton.createBone('rightLeg', { x: 5, y: 15 }, 'torso', 15, -Math.PI / 8);
  }
  
  /**
   * Set up default animations for the character
   */
  private setupDefaultAnimations(): void {
    // Idle animation
    this.skeleton.setAnimation({
      id: 'idle',
      duration: 2000,
      loop: true,
      keyframes: [
        // Torso slight movement
        { boneId: 'torso', time: 0, position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'torso', time: 1000, position: { x: 0, y: -1 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'torso', time: 2000, position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
        
        // Head slight movement
        { boneId: 'head', time: 0, position: { x: 0, y: -15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'head', time: 1000, position: { x: 0, y: -16 }, rotation: 0.05, scale: { x: 1, y: 1 } },
        { boneId: 'head', time: 2000, position: { x: 0, y: -15 }, rotation: 0, scale: { x: 1, y: 1 } },
        
        // Arms slight movement
        { boneId: 'leftArm', time: 0, position: { x: -10, y: -5 }, rotation: Math.PI / 4, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 1000, position: { x: -10, y: -5 }, rotation: Math.PI / 4 - 0.1, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 2000, position: { x: -10, y: -5 }, rotation: Math.PI / 4, scale: { x: 1, y: 1 } },
        
        { boneId: 'rightArm', time: 0, position: { x: 10, y: -5 }, rotation: -Math.PI / 4, scale: { x: 1, y: 1 } },
        { boneId: 'rightArm', time: 1000, position: { x: 10, y: -5 }, rotation: -Math.PI / 4 + 0.1, scale: { x: 1, y: 1 } },
        { boneId: 'rightArm', time: 2000, position: { x: 10, y: -5 }, rotation: -Math.PI / 4, scale: { x: 1, y: 1 } },
        
        // Legs slight movement
        { boneId: 'leftLeg', time: 0, position: { x: -5, y: 15 }, rotation: Math.PI / 8, scale: { x: 1, y: 1 } },
        { boneId: 'leftLeg', time: 1000, position: { x: -5, y: 15 }, rotation: Math.PI / 8, scale: { x: 1, y: 1 } },
        { boneId: 'leftLeg', time: 2000, position: { x: -5, y: 15 }, rotation: Math.PI / 8, scale: { x: 1, y: 1 } },
        
        { boneId: 'rightLeg', time: 0, position: { x: 5, y: 15 }, rotation: -Math.PI / 8, scale: { x: 1, y: 1 } },
        { boneId: 'rightLeg', time: 1000, position: { x: 5, y: 15 }, rotation: -Math.PI / 8, scale: { x: 1, y: 1 } },
        { boneId: 'rightLeg', time: 2000, position: { x: 5, y: 15 }, rotation: -Math.PI / 8, scale: { x: 1, y: 1 } }
      ]
    });
    
    // Walking animation
    this.skeleton.setAnimation({
      id: 'walk',
      duration: 1000, // 1 second for a full walk cycle
      loop: true,
      keyframes: [
        // Torso
        { boneId: 'torso', time: 0, position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'torso', time: 250, position: { x: 0, y: -1 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'torso', time: 500, position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'torso', time: 750, position: { x: 0, y: -1 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'torso', time: 1000, position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
        
        // Head
        { boneId: 'head', time: 0, position: { x: 0, y: -15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'head', time: 250, position: { x: 0, y: -16 }, rotation: 0.05, scale: { x: 1, y: 1 } },
        { boneId: 'head', time: 500, position: { x: 0, y: -15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'head', time: 750, position: { x: 0, y: -16 }, rotation: -0.05, scale: { x: 1, y: 1 } },
        { boneId: 'head', time: 1000, position: { x: 0, y: -15 }, rotation: 0, scale: { x: 1, y: 1 } },
        
        // Left arm
        { boneId: 'leftArm', time: 0, position: { x: -10, y: -5 }, rotation: Math.PI / 4, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 250, position: { x: -10, y: -5 }, rotation: Math.PI / 6, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 500, position: { x: -10, y: -5 }, rotation: Math.PI / 3, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 750, position: { x: -10, y: -5 }, rotation: Math.PI / 2, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 1000, position: { x: -10, y: -5 }, rotation: Math.PI / 4, scale: { x: 1, y: 1 } },
        
        // Right arm
        { boneId: 'rightArm', time: 0, position: { x: 10, y: -5 }, rotation: -Math.PI / 4, scale: { x: 1, y: 1 } },
        { boneId: 'rightArm', time: 250, position: { x: 10, y: -5 }, rotation: -Math.PI / 2, scale: { x: 1, y: 1 } },
        { boneId: 'rightArm', time: 500, position: { x: 10, y: -5 }, rotation: -Math.PI / 3, scale: { x: 1, y: 1 } },
        { boneId: 'rightArm', time: 750, position: { x: 10, y: -5 }, rotation: -Math.PI / 6, scale: { x: 1, y: 1 } },
        { boneId: 'rightArm', time: 1000, position: { x: 10, y: -5 }, rotation: -Math.PI / 4, scale: { x: 1, y: 1 } },
        
        // Left leg
        { boneId: 'leftLeg', time: 0, position: { x: -5, y: 15 }, rotation: -Math.PI / 6, scale: { x: 1, y: 1 } },
        { boneId: 'leftLeg', time: 250, position: { x: -5, y: 15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'leftLeg', time: 500, position: { x: -5, y: 15 }, rotation: Math.PI / 6, scale: { x: 1, y: 1 } },
        { boneId: 'leftLeg', time: 750, position: { x: -5, y: 15 }, rotation: Math.PI / 4, scale: { x: 1, y: 1 } },
        { boneId: 'leftLeg', time: 1000, position: { x: -5, y: 15 }, rotation: -Math.PI / 6, scale: { x: 1, y: 1 } },
        
        // Right leg
        { boneId: 'rightLeg', time: 0, position: { x: 5, y: 15 }, rotation: Math.PI / 6, scale: { x: 1, y: 1 } },
        { boneId: 'rightLeg', time: 250, position: { x: 5, y: 15 }, rotation: Math.PI / 4, scale: { x: 1, y: 1 } },
        { boneId: 'rightLeg', time: 500, position: { x: 5, y: 15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'rightLeg', time: 750, position: { x: 5, y: 15 }, rotation: -Math.PI / 6, scale: { x: 1, y: 1 } },
        { boneId: 'rightLeg', time: 1000, position: { x: 5, y: 15 }, rotation: Math.PI / 6, scale: { x: 1, y: 1 } }
      ]
    });
    
    // Greeting animation
    this.skeleton.setAnimation({
      id: 'greeting',
      duration: 1500,
      loop: false,
      keyframes: [
        // Torso
        { boneId: 'torso', time: 0, position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'torso', time: 750, position: { x: 0, y: -2 }, rotation: 0.1, scale: { x: 1, y: 1 } },
        { boneId: 'torso', time: 1500, position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
        
        // Head
        { boneId: 'head', time: 0, position: { x: 0, y: -15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'head', time: 750, position: { x: 0, y: -15 }, rotation: 0.2, scale: { x: 1, y: 1 } },
        { boneId: 'head', time: 1500, position: { x: 0, y: -15 }, rotation: 0, scale: { x: 1, y: 1 } },
        
        // Left arm - wave
        { boneId: 'leftArm', time: 0, position: { x: -10, y: -5 }, rotation: Math.PI / 4, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 375, position: { x: -10, y: -8 }, rotation: -Math.PI / 2, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 750, position: { x: -10, y: -8 }, rotation: -Math.PI / 3, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 1125, position: { x: -10, y: -8 }, rotation: -Math.PI / 2, scale: { x: 1, y: 1 } },
        { boneId: 'leftArm', time: 1500, position: { x: -10, y: -5 }, rotation: Math.PI / 4, scale: { x: 1, y: 1 } },
        
        // Right arm
        { boneId: 'rightArm', time: 0, position: { x: 10, y: -5 }, rotation: -Math.PI / 4, scale: { x: 1, y: 1 } },
        { boneId: 'rightArm', time: 750, position: { x: 12, y: -5 }, rotation: -Math.PI / 6, scale: { x: 1, y: 1 } },
        { boneId: 'rightArm', time: 1500, position: { x: 10, y: -5 }, rotation: -Math.PI / 4, scale: { x: 1, y: 1 } },
        
        // Legs - stable
        { boneId: 'leftLeg', time: 0, position: { x: -5, y: 15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'leftLeg', time: 750, position: { x: -5, y: 15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'leftLeg', time: 1500, position: { x: -5, y: 15 }, rotation: 0, scale: { x: 1, y: 1 } },
        
        { boneId: 'rightLeg', time: 0, position: { x: 5, y: 15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'rightLeg', time: 750, position: { x: 5, y: 15 }, rotation: 0, scale: { x: 1, y: 1 } },
        { boneId: 'rightLeg', time: 1500, position: { x: 5, y: 15 }, rotation: 0, scale: { x: 1, y: 1 } }
      ]
    });
    
    // Start with idle animation
    this.skeleton.playAnimation('idle');
  }
  
  /**
   * Load the skeleton character
   */
  async load(): Promise<void> {
    // In a real implementation, you would await image loading
    // and any other async operations
    this.loaded = true;
    return Promise.resolve();
  }
  
  /**
   * Start a greeting animation
   */
  startGreeting(isLeftSide: boolean): void {
    if (this.isGreeting) return;
    
    this.isGreeting = true;
    this.greetingTimer = 0;
    
    // Play greeting animation
    this.skeleton.playAnimation('greeting');
  }
  
  /**
   * Update character state based on direction, deltaTime, etc.
   */
  update(
    direction: { x: number, y: number },
    deltaTime: number,
    canvasDimensions: { width: number, height: number },
    otherCharacters: SkeletonCharacter[],
    worldEnvironment?: WorldEnvironment,
    viewportOffset?: { x: number, y: number }
  ): void {
    // Handle greeting animation
    if (this.isGreeting) {
      this.greetingTimer += deltaTime;
      
      // End greeting after duration
      if (this.greetingTimer >= this.greetingDuration) {
        this.isGreeting = false;
        this.skeleton.playAnimation('idle');
      }
      
      // Continue updating skeleton during greeting
      this.skeleton.update(deltaTime);
      return;
    }
    
    // Update animation state based on movement
    if (direction.x === 0 && direction.y === 0) {
      // If not moving and not already playing idle, switch to idle
      if (this.skeleton.currentState.animationId !== 'idle') {
        this.skeleton.playAnimation('idle');
      }
    } else {
      // If moving and not already walking, switch to walk animation
      if (this.skeleton.currentState.animationId !== 'walk') {
        this.skeleton.playAnimation('walk');
      }
      
      // Update direction based on movement
      this.updateDirection(direction);
      
      // Calculate new position
      const newPosition = {
        x: this.position.x + direction.x * this.speed,
        y: this.position.y + direction.y * this.speed
      };
      
      // Apply collision detection and other constraints as in the original Character class
      // For now, a simplified implementation:
      
      // Check canvas boundaries
      if (newPosition.x < 0) newPosition.x = 0;
      if (newPosition.y < 0) newPosition.y = 0;
      if (newPosition.x > canvasDimensions.width) {
        newPosition.x = canvasDimensions.width;
      }
      if (newPosition.y > canvasDimensions.height) {
        newPosition.y = canvasDimensions.height;
      }
      
      // TODO: Add collision with other characters and environment
      
      // Update position
      this.position = newPosition;
    }
    
    // Update skeleton animation
    this.skeleton.update(deltaTime);
  }
  
  /**
   * Update character direction based on movement
   */
  private updateDirection(direction: { x: number, y: number }): void {
    // Update direction based on movement
    if (direction.x === 0 && direction.y < 0) {
      this.direction = SkeletonDirection.NORTH;
    } else if (direction.x > 0 && direction.y < 0) {
      this.direction = SkeletonDirection.NORTHEAST;
    } else if (direction.x > 0 && direction.y === 0) {
      this.direction = SkeletonDirection.EAST;
    } else if (direction.x > 0 && direction.y > 0) {
      this.direction = SkeletonDirection.SOUTHEAST;
    } else if (direction.x === 0 && direction.y > 0) {
      this.direction = SkeletonDirection.SOUTH;
    } else if (direction.x < 0 && direction.y > 0) {
      this.direction = SkeletonDirection.SOUTHWEST;
    } else if (direction.x < 0 && direction.y === 0) {
      this.direction = SkeletonDirection.WEST;
    } else if (direction.x < 0 && direction.y < 0) {
      this.direction = SkeletonDirection.NORTHWEST;
    }
    
    // TODO: Apply direction-specific bone transformations
  }
  
  /**
   * Check if this character is close to another character
   */
  isCloseTo(other: SkeletonCharacter): boolean {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Consider them "close" if within 50 pixels
    return distance < 50;
  }
  
  /**
   * Render the character
   */
  render(ctx: CanvasRenderingContext2D, debug: boolean = false): void {
    if (!this.loaded) return;
    
    // Render the skeleton at the character's position
    this.skeleton.render(ctx, this.position.x, this.position.y, debug);
    
    // Render name above character
    if (debug) {
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, this.position.x, this.position.y - 30);
      
      // Draw direction indicator
      ctx.font = '10px Arial';
      ctx.fillText(this.direction, this.position.x, this.position.y - 15);
    }
  }
} 