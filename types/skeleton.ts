export interface Vector2 {
  x: number;
  y: number;
}

export interface SkeletonBone {
  id: string;              // Unique identifier (e.g., "head", "leftHand")
  position: Vector2;       // Current position relative to parent
  worldPosition: Vector2;  // Calculated world position
  parent: string | null;   // Parent bone ID (null for root)
  children: string[];      // IDs of child bones
  rotation: number;        // Current rotation in radians
  scale: Vector2;          // Scale of the bone
  length: number;          // Length of the bone
  pivotX: number;          // Pivot point X (0-1)
  pivotY: number;          // Pivot point Y (0-1)
}

export interface BoneKeyframe {
  boneId: string;          // ID of the bone this keyframe affects
  time: number;            // Time in ms when this keyframe occurs
  position: Vector2;       // Position at this keyframe
  rotation: number;        // Rotation at this keyframe
  scale: Vector2;          // Scale at this keyframe
  easing?: string;         // Easing function (linear, easeIn, easeOut, etc.)
}

export interface Animation {
  id: string;              // Unique animation identifier
  keyframes: BoneKeyframe[]; // List of keyframes for this animation
  duration: number;        // Total duration in ms
  loop: boolean;           // Whether the animation should loop
}

export interface SpriteSlice {
  id: string;              // Unique identifier for this slice
  boneId: string;          // ID of the bone this slice is attached to
  position: Vector2;       // Position offset from bone
  rotation: number;        // Rotation offset from bone
  pivotX: number;          // Pivot point X (0-1)
  pivotY: number;          // Pivot point Y (0-1)
  width: number;           // Width of the slice
  height: number;          // Height of the slice
  imageX: number;          // X position in the source image
  imageY: number;          // Y position in the source image
  imageWidth: number;      // Width in the source image
  imageHeight: number;     // Height in the source image
}

// Animation state represents current animation playback
export interface AnimationState {
  animationId: string;     // ID of the current animation
  time: number;            // Current time in the animation
  speed: number;           // Playback speed multiplier
  isPlaying: boolean;      // Whether the animation is currently playing
}

// Direction types for 4-way or 8-way character movement
export enum SkeletonDirection {
  NORTH = 'north',
  NORTHEAST = 'northeast',
  EAST = 'east',
  SOUTHEAST = 'southeast',
  SOUTH = 'south',
  SOUTHWEST = 'southwest',
  WEST = 'west',
  NORTHWEST = 'northwest'
} 