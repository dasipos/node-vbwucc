import { Task } from './model';

export class TaskStorage {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  createTask(taskName: string) {
    const newTask: Task = {
      id: this.generateNewTaskId(),
      name: taskName,
      complete: false,
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

  setTaskCompletionStatus(taskId: number, completed: boolean) {
    this.getTaskById(taskId).complete = completed;
  }

  private generateNewTaskId(): number {
    const allTaskIds = this.tasks.map((t) => t.id);

    return Math.max(0, ...allTaskIds) + 1;
  }
}
