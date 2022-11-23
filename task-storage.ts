import { stringify } from 'querystring';
import { Task } from './model';
import { TaskState } from './taskstate';

export class TaskStorage {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  createTaskWithText(taskName: string, text: string) {
    const newTask: Task = {
      id: this.generateNewTaskId(),
      name: taskName,
      state: TaskState.TODO,
      text: text,
    };

    this.tasks.push(newTask);
  }

  createTaskWithList(taskName: string, list: string[]) {
    const newTask: Task = {
      id: this.generateNewTaskId(),
      name: taskName,
      state: TaskState.TODO,
      list: list,
    };

    this.tasks.push(newTask);
  }

  getTaskById(taskId: number) {
    const task = this.tasks.find((t) => t.id === taskId);

    if (task !== undefined) {
      return task;
    } else {
      throw new Error(`Ukol s cislem ${taskId} nenalezen!`);
    }
  }

  deleteTaskById(taskId: number) {
    const taskIndex = this.tasks.indexOf(this.getTaskById(taskId));
    this.tasks.splice(taskIndex, 1);
  }

  setTaskCompletionStatus(taskId: number, state: TaskState) {
    this.getTaskById(taskId).state = state;
  }

  private generateNewTaskId(): number {
    const allTaskIds = this.tasks.map((t) => t.id);

    return Math.max(0, ...allTaskIds) + 1;
  }
}
