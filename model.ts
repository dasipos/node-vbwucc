import { type } from 'os';
import { TaskState } from './taskstate';

export interface TaskWithText extends AbstractTask {
  text: string;
}

export interface TaskWithList extends AbstractTask {
  list: string[];
}

interface AbstractTask {
  id: number;
  name: string;
  state: TaskState;
}

export type Task = TaskWithText | TaskWithList;

export function isTaskWithText(t: Task): t is TaskWithText {
  return t.hasOwnProperty('text');
}

export function isTaskWithList(t: Task): t is TaskWithList {
  return t.hasOwnProperty('list');
}
