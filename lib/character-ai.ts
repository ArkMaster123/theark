import { Character } from './character'
import { WorldEnvironment } from './world-environment'

// Define different tasks characters can perform
export enum TaskType {
  IDLE = 'idle',
  EXPLORE = 'explore',
  GATHER = 'gather',
  REST = 'rest',
  SOCIALIZE = 'socialize'
}

// Define AI states for characters
export enum AIState {
  IDLE = 'idle',
  MOVING_TO_LOCATION = 'moving',
  PERFORMING_TASK = 'performing',
  WAITING = 'waiting',
  FOLLOWING = 'following'
}

// Define a task interface
export interface Task {
  id: string
  type: TaskType
  name: string
  description: string
  progress: number // 0-100
  targetLocation?: { x: number, y: number } // Where the task should be performed
  completionTime: number // How long the task takes to complete (in ms)
  completionCallback?: () => void
}

// Define important locations in the world
export const worldLocations = {
  HOUSE: { x: 700, y: 300 },
  CHEST: { x: 650, y: 400 },
  BRIDGE: { x: 350, y: 350 },
  TREE_LARGE: { x: 300, y: 150 },
  TREE_SMALL: { x: 500, y: 200 },
  FENCE_START: { x: 400, y: 500 },
  POND: { x: 350, y: 300 },
  FARM: { x: 950, y: 350 }
}

// Define available tasks
export const availableTasks: Task[] = [
  {
    id: 'explore_house',
    type: TaskType.EXPLORE,
    name: 'Explore House',
    description: 'Explore the house and its surroundings',
    progress: 0,
    targetLocation: worldLocations.HOUSE,
    completionTime: 5000
  },
  {
    id: 'rest_by_tree',
    type: TaskType.REST,
    name: 'Rest by Tree',
    description: 'Take a break under the shade of the tree',
    progress: 0,
    targetLocation: worldLocations.TREE_LARGE,
    completionTime: 8000
  },
  {
    id: 'check_chest',
    type: TaskType.GATHER,
    name: 'Check Chest',
    description: 'Look inside the chest for valuable items',
    progress: 0,
    targetLocation: worldLocations.CHEST,
    completionTime: 3000
  },
  {
    id: 'cross_bridge',
    type: TaskType.EXPLORE,
    name: 'Cross Bridge',
    description: 'Cross the bridge to the other side',
    progress: 0,
    targetLocation: worldLocations.BRIDGE,
    completionTime: 2000
  },
  {
    id: 'farm_work',
    type: TaskType.GATHER,
    name: 'Farm Work',
    description: 'Work on the farm to grow crops',
    progress: 0,
    targetLocation: worldLocations.FARM,
    completionTime: 10000
  }
]

// Character AI class that manages NPC behavior
export class CharacterAI {
  private character: Character
  private world: WorldEnvironment
  private currentState: AIState
  private currentTask: Task | null
  private taskTimer: number
  private targetLocation: { x: number, y: number } | null
  private path: { x: number, y: number }[] | null
  private completedTasks: Set<string>
  private stateUpdateCallback: (() => void) | null
  
  constructor(character: Character, world: WorldEnvironment) {
    this.character = character
    this.world = world
    this.currentState = AIState.IDLE
    this.currentTask = null
    this.taskTimer = 0
    this.targetLocation = null
    this.path = null
    this.completedTasks = new Set()
    this.stateUpdateCallback = null
  }
  
  // Set a callback to be notified when state changes
  public setStateUpdateCallback(callback: () => void): void {
    this.stateUpdateCallback = callback
  }
  
  // Choose a random task from available tasks
  private chooseRandomTask(): Task | null {
    const availableTasksForCharacter = availableTasks.filter(
      task => !this.completedTasks.has(task.id)
    )
    
    if (availableTasksForCharacter.length === 0) {
      // All tasks completed, reset completion status to allow repeating tasks
      this.completedTasks.clear()
      return availableTasks[Math.floor(Math.random() * availableTasks.length)]
    }
    
    return availableTasksForCharacter[Math.floor(Math.random() * availableTasksForCharacter.length)]
  }
  
  // Set a specific task for this character
  public setTask(taskId: string): boolean {
    const task = availableTasks.find(t => t.id === taskId)
    if (task) {
      this.currentTask = { ...task, progress: 0 }
      this.targetLocation = task.targetLocation || null
      this.currentState = AIState.IDLE // Will transition to MOVING on next update
      if (this.stateUpdateCallback) this.stateUpdateCallback()
      return true
    }
    return false
  }
  
  // Simulate basic pathfinding by creating a direct path (to be replaced with A*)
  private calculatePath(start: { x: number, y: number }, end: { x: number, y: number }): { x: number, y: number }[] {
    // Very simple direct path - this should be replaced with A* or similar
    const path: { x: number, y: number }[] = []
    
    // Calculate a straight line between points (Bresenham's line algorithm)
    const dx = Math.abs(end.x - start.x)
    const dy = Math.abs(end.y - start.y)
    const sx = start.x < end.x ? 1 : -1
    const sy = start.y < end.y ? 1 : -1
    let err = dx - dy
    
    let x = start.x
    let y = start.y
    
    const maxSteps = 1000 // Safety limit
    let steps = 0
    
    while ((x !== end.x || y !== end.y) && steps < maxSteps) {
      path.push({ x, y })
      
      const e2 = 2 * err
      if (e2 > -dy) {
        err -= dy
        x += sx
      }
      if (e2 < dx) {
        err += dx
        y += sy
      }
      
      steps++
    }
    
    path.push({ x: end.x, y: end.y }) // Add destination
    return path
  }
  
  // Update the AI state
  public update(deltaTime: number): void {
    // Decision making logic
    if (this.currentState === AIState.IDLE) {
      if (!this.currentTask) {
        this.currentTask = this.chooseRandomTask()
        
        if (this.currentTask && this.currentTask.targetLocation) {
          this.targetLocation = this.currentTask.targetLocation
          this.path = this.calculatePath(
            this.character.position,
            this.targetLocation
          )
          this.currentState = AIState.MOVING_TO_LOCATION
          if (this.stateUpdateCallback) this.stateUpdateCallback()
        }
      } else if (this.currentTask.targetLocation) {
        this.targetLocation = this.currentTask.targetLocation
        this.path = this.calculatePath(
          this.character.position,
          this.targetLocation
        )
        this.currentState = AIState.MOVING_TO_LOCATION
        if (this.stateUpdateCallback) this.stateUpdateCallback()
      } else {
        // Task with no target location, perform immediately
        this.currentState = AIState.PERFORMING_TASK
        this.taskTimer = 0
        if (this.stateUpdateCallback) this.stateUpdateCallback()
      }
    }
    
    // State execution logic
    if (this.currentState === AIState.MOVING_TO_LOCATION && this.path && this.path.length > 0) {
      // If we're close enough to the next point in the path, move to it
      const nextPoint = this.path[0]
      const dx = nextPoint.x - this.character.position.x
      const dy = nextPoint.y - this.character.position.y
      const distanceToNext = Math.sqrt(dx * dx + dy * dy)
      
      if (distanceToNext < this.character.speed) {
        // Reached next point, remove it from path
        this.path.shift()
        
        // If path is now empty, we've reached the destination
        if (this.path.length === 0) {
          this.currentState = AIState.PERFORMING_TASK
          this.taskTimer = 0
          if (this.stateUpdateCallback) this.stateUpdateCallback()
        }
      } else {
        // Move toward next point
        const direction = {
          x: dx / distanceToNext,
          y: dy / distanceToNext
        }
        
        // Update character position and animation without actually moving
        // (the actual movement will be handled by the character's update method)
        this.character.update(
          direction,
          deltaTime,
          { width: 9999, height: 9999 }, // Dummy canvas size, we're just using this to update animation
          [],
          this.world,
          { x: 0, y: 0 } // No viewport offset for AI calculation
        )
      }
    } else if (this.currentState === AIState.PERFORMING_TASK && this.currentTask) {
      // Perform the task
      this.taskTimer += deltaTime
      
      // Update task progress based on time
      const progressIncrement = (deltaTime / this.currentTask.completionTime) * 100
      this.currentTask.progress = Math.min(100, this.currentTask.progress + progressIncrement)
      
      // Task completed
      if (this.currentTask.progress >= 100) {
        this.completedTasks.add(this.currentTask.id)
        
        // Call completion callback if provided
        if (this.currentTask.completionCallback) {
          this.currentTask.completionCallback()
        }
        
        // Reset for next task
        this.currentTask = null
        this.currentState = AIState.WAITING
        this.taskTimer = 0
        
        // Wait a bit before choosing next task
        setTimeout(() => {
          this.currentState = AIState.IDLE
          if (this.stateUpdateCallback) this.stateUpdateCallback()
        }, 2000)
        
        if (this.stateUpdateCallback) this.stateUpdateCallback()
      }
    } else if (this.currentState === AIState.WAITING) {
      // Just waiting, do nothing
      // Character will be in idle animation state
    }
  }
  
  // Get current AI state
  public getState(): AIState {
    return this.currentState
  }
  
  // Get current task
  public getTask(): Task | null {
    return this.currentTask
  }
  
  // Get a list of completed task IDs
  public getCompletedTasks(): string[] {
    return Array.from(this.completedTasks)
  }
} 