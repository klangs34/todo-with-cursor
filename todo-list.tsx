import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash } from "lucide-react"

interface Task {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const addTask = () => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditText(task.text)
  }

  const saveEdit = () => {
    if (editText.trim() !== "" && editingTaskId !== null) {
      setTasks(tasks.map((task) => (task.id === editingTaskId ? { ...task, text: editText } : task)))
      setEditingTaskId(null)
    }
  }

  const cancelEdit = () => {
    setEditingTaskId(null)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">Todo List</h1>

      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask()
            }
          }}
          className="flex-1"
        />
        <Button onClick={addTask}>Add</Button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-center text-muted-foreground">No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-md border ${
                task.completed ? "bg-muted/50" : "bg-background"
              }`}
            >
              {editingTaskId === task.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit()
                      if (e.key === "Escape") cancelEdit()
                    }}
                    className="flex-1"
                    autoFocus
                  />
                  <Button size="sm" onClick={saveEdit}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.text}
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(task)}
                      aria-label={`Edit task: ${task.text}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-pencil"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTask(task.id)}
                      aria-label={`Delete task: ${task.text}`}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-6 text-sm text-muted-foreground">
          <p>
            {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
          </p>
        </div>
      )}
    </div>
  )
}

