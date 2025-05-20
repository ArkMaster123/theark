'use client'

import { useState, useEffect } from 'react'
import { Task, TaskType } from '@/lib/character-ai'

interface TaskDisplayProps {
  characterName: string
  task: Task | null
  completedTasks: string[]
}

// Map task types to colors
const taskColors: Record<TaskType, string> = {
  [TaskType.IDLE]: 'bg-gray-500',
  [TaskType.EXPLORE]: 'bg-blue-500',
  [TaskType.GATHER]: 'bg-green-500',
  [TaskType.REST]: 'bg-purple-500',
  [TaskType.SOCIALIZE]: 'bg-yellow-500'
}

export default function TaskDisplay({ characterName, task, completedTasks }: TaskDisplayProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  
  return (
    <div className={`absolute left-4 top-4 bg-black/80 text-white rounded-lg p-4 transition-all duration-300 ${
      isMinimized ? 'w-12 h-12 overflow-hidden' : 'w-80'
    }`}>
      <button 
        className="absolute top-2 right-2 z-10 opacity-70 hover:opacity-100"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        {isMinimized ? '?' : '×'}
      </button>
      
      <div className={`${isMinimized ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        <h3 className="text-xl font-bold mb-4">{characterName}'s Tasks</h3>
        
        {task ? (
          <div className="space-y-2">
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{task.name}</span>
                <span className="text-sm">{Math.round(task.progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`${task.type in taskColors ? taskColors[task.type] : 'bg-blue-500'} h-2.5 rounded-full`} 
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-gray-300">{task.description}</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 italic">No active task</div>
        )}
        
        {completedTasks.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">Completed Tasks ({completedTasks.length})</h4>
            <div className="text-xs text-gray-300 space-y-1">
              {completedTasks.map(taskId => {
                const taskInfo = taskId.replace(/_/g, ' ').split(' ').map(
                  word => word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
                
                return (
                  <div key={taskId} className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>{taskInfo}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 