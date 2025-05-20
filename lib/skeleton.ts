import { Animation, AnimationState, BoneKeyframe, SkeletonBone, SpriteSlice, Vector2 } from "@/types/skeleton";

export class SkeletonSystem {
  private bones: Map<string, SkeletonBone> = new Map();
  private animations: Map<string, Animation> = new Map();
  private slices: Map<string, SpriteSlice> = new Map();
  
  private currentState: AnimationState;
  private spriteSheet: HTMLImageElement;
  private rootBoneId: string | null = null;
  
  constructor(spriteSheetPath: string) {
    // Initialize sprite sheet
    this.spriteSheet = new Image();
    this.spriteSheet.src = spriteSheetPath;
    
    // Initialize with default animation state
    this.currentState = {
      animationId: '',
      time: 0,
      speed: 1,
      isPlaying: false
    };
  }
  
  /**
   * Creates a new bone in the skeleton
   */
  public createBone(
    id: string, 
    position: Vector2,
    parentId: string | null = null,
    length: number = 10,
    rotation: number = 0
  ): string {
    // Initialize the bone
    const bone: SkeletonBone = {
      id,
      position,
      worldPosition: { ...position },
      parent: parentId,
      children: [],
      rotation,
      scale: { x: 1, y: 1 },
      length,
      pivotX: 0,
      pivotY: 0
    };
    
    // Add to bones map
    this.bones.set(id, bone);
    
    // If this is the first bone, set it as root
    if (this.rootBoneId === null) {
      this.rootBoneId = id;
    }
    
    // If it has a parent, add this bone as a child of the parent
    if (parentId && this.bones.has(parentId)) {
      const parentBone = this.bones.get(parentId)!;
      parentBone.children.push(id);
    }
    
    return id;
  }
  
  /**
   * Adds a sprite slice that will be rendered with the skeleton
   */
  public addSlice(slice: SpriteSlice): void {
    this.slices.set(slice.id, slice);
  }
  
  /**
   * Adds or updates an animation
   */
  public setAnimation(animation: Animation): void {
    this.animations.set(animation.id, animation);
  }
  
  /**
   * Plays an animation by ID
   */
  public playAnimation(animationId: string, speed: number = 1): void {
    if (!this.animations.has(animationId)) {
      console.warn(`Animation ${animationId} not found`);
      return;
    }
    
    this.currentState = {
      animationId,
      time: 0,
      speed,
      isPlaying: true
    };
  }
  
  /**
   * Stops the current animation
   */
  public stopAnimation(): void {
    this.currentState.isPlaying = false;
  }
  
  /**
   * Updates the skeleton animation based on elapsed time
   */
  public update(deltaTime: number): void {
    if (!this.currentState.isPlaying) return;
    
    // Update animation time
    this.currentState.time += deltaTime * this.currentState.speed;
    
    // Get current animation
    const animation = this.animations.get(this.currentState.animationId);
    if (!animation) return;
    
    // Handle looping
    if (animation.loop && this.currentState.time > animation.duration) {
      this.currentState.time = this.currentState.time % animation.duration;
    } else if (!animation.loop && this.currentState.time > animation.duration) {
      this.currentState.time = animation.duration;
      this.currentState.isPlaying = false;
    }
    
    // Apply animation to bones
    this.applyAnimation(animation, this.currentState.time);
    
    // Update world positions and rotations for all bones
    if (this.rootBoneId) {
      this.updateBoneTransforms(this.rootBoneId, { x: 0, y: 0 }, 0);
    }
  }
  
  /**
   * Apply animation keyframes to bones at the specified time
   */
  private applyAnimation(animation: Animation, time: number): void {
    // For each bone, find relevant keyframes
    this.bones.forEach((bone) => {
      // Find keyframes for this bone
      const keyframes = animation.keyframes.filter(kf => kf.boneId === bone.id);
      
      if (keyframes.length === 0) return;
      
      // Sort keyframes by time
      keyframes.sort((a, b) => a.time - b.time);
      
      // Find the keyframes before and after current time
      let prevKeyframe: BoneKeyframe | null = null;
      let nextKeyframe: BoneKeyframe | null = null;
      
      for (let i = 0; i < keyframes.length; i++) {
        if (keyframes[i].time > time) {
          nextKeyframe = keyframes[i];
          prevKeyframe = i > 0 ? keyframes[i - 1] : keyframes[keyframes.length - 1];
          break;
        }
      }
      
      // If we didn't find keyframes, use first/last
      if (!prevKeyframe && !nextKeyframe && keyframes.length > 0) {
        prevKeyframe = keyframes[keyframes.length - 1];
        nextKeyframe = keyframes[0];
      }
      
      // Apply interpolation if we have both keyframes
      if (prevKeyframe && nextKeyframe) {
        const t = calculateInterpolationFactor(time, prevKeyframe.time, nextKeyframe.time, animation.duration);
        
        // Apply interpolated values to bone
        bone.position.x = lerp(prevKeyframe.position.x, nextKeyframe.position.x, t);
        bone.position.y = lerp(prevKeyframe.position.y, nextKeyframe.position.y, t);
        bone.rotation = lerpAngle(prevKeyframe.rotation, nextKeyframe.rotation, t);
        bone.scale.x = lerp(prevKeyframe.scale.x, nextKeyframe.scale.x, t);
        bone.scale.y = lerp(prevKeyframe.scale.y, nextKeyframe.scale.y, t);
      }
    });
  }
  
  /**
   * Updates world positions of bones based on parent-child relationships
   */
  private updateBoneTransforms(boneId: string, parentWorldPos: Vector2, parentRotation: number): void {
    const bone = this.bones.get(boneId);
    if (!bone) return;
    
    // Calculate world rotation
    const worldRotation = parentRotation + bone.rotation;
    
    // Calculate world position based on parent's position and rotation
    const rotatedPos = rotatePoint(bone.position, { x: 0, y: 0 }, parentRotation);
    
    // Set world position
    bone.worldPosition = {
      x: parentWorldPos.x + rotatedPos.x,
      y: parentWorldPos.y + rotatedPos.y
    };
    
    // Update all children recursively
    bone.children.forEach(childId => {
      this.updateBoneTransforms(childId, bone.worldPosition, worldRotation);
    });
  }
  
  /**
   * Renders the skeleton with sprite slices
   */
  public render(ctx: CanvasRenderingContext2D, x: number, y: number, debug: boolean = false): void {
    // Ensure image is loaded
    if (!this.spriteSheet.complete) return;
    
    // Render all sprite slices
    this.slices.forEach(slice => {
      const bone = this.bones.get(slice.boneId);
      if (!bone) return;
      
      // Save context
      ctx.save();
      
      // Move to bone position
      ctx.translate(x + bone.worldPosition.x, y + bone.worldPosition.y);
      
      // Rotate by bone rotation
      ctx.rotate(bone.rotation + slice.rotation);
      
      // Apply bone scale
      ctx.scale(bone.scale.x, bone.scale.y);
      
      // Draw the slice
      ctx.drawImage(
        this.spriteSheet,
        slice.imageX, slice.imageY, slice.imageWidth, slice.imageHeight,
        -slice.pivotX * slice.width, -slice.pivotY * slice.height, slice.width, slice.height
      );
      
      // Restore context
      ctx.restore();
    });
    
    // Render debug visualization if enabled
    if (debug) {
      this.renderDebug(ctx, x, y);
    }
  }
  
  /**
   * Renders debug visualization of the skeleton
   */
  private renderDebug(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // Render bones
    this.bones.forEach(bone => {
      ctx.save();
      
      // Draw bone as a line
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(x + bone.worldPosition.x, y + bone.worldPosition.y);
      
      // Calculate endpoint based on bone length and rotation
      const endX = x + bone.worldPosition.x + Math.cos(bone.rotation) * bone.length;
      const endY = y + bone.worldPosition.y + Math.sin(bone.rotation) * bone.length;
      
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Draw joint circle
      ctx.fillStyle = '#0000FF';
      ctx.beginPath();
      ctx.arc(x + bone.worldPosition.x, y + bone.worldPosition.y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }
  
  /**
   * Gets a copy of all bones for external use
   */
  public getBones(): Map<string, SkeletonBone> {
    return new Map(this.bones);
  }
  
  /**
   * Manually set bone properties
   */
  public setBoneProperties(
    boneId: string,
    properties: Partial<SkeletonBone>
  ): void {
    const bone = this.bones.get(boneId);
    if (!bone) return;
    
    // Update bone properties
    Object.assign(bone, properties);
    
    // Update world positions after manual change
    if (this.rootBoneId) {
      this.updateBoneTransforms(this.rootBoneId, { x: 0, y: 0 }, 0);
    }
  }
}

// Helper functions for interpolation and rotation

/**
 * Linear interpolation between two values
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Interpolation for angles (handles wrapping around)
 */
function lerpAngle(a: number, b: number, t: number): number {
  // Ensure shortest path around circle
  const diff = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  return a + diff * t;
}

/**
 * Calculate interpolation factor, handling looping animations
 */
function calculateInterpolationFactor(
  currentTime: number,
  startTime: number,
  endTime: number,
  duration: number
): number {
  // Handle looping case where endTime < startTime
  if (endTime < startTime) {
    if (currentTime >= startTime) {
      return (currentTime - startTime) / (duration - startTime + endTime);
    } else {
      return (currentTime + duration - startTime) / (duration - startTime + endTime);
    }
  }
  
  // Normal case
  return (currentTime - startTime) / (endTime - startTime);
}

/**
 * Rotate a point around a center point
 */
function rotatePoint(point: Vector2, center: Vector2, angle: number): Vector2 {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  
  // Translate point to origin
  const px = point.x - center.x;
  const py = point.y - center.y;
  
  // Rotate point
  const xnew = px * c - py * s;
  const ynew = px * s + py * c;
  
  // Translate point back
  return {
    x: xnew + center.x,
    y: ynew + center.y
  };
} 