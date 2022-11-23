import { isTaskWithList, isTaskWithText, Task } from './model';
import { TaskStorage } from './task-storage';
import { TaskState } from './taskstate';
import { consolePrompt } from './util';

export function taskCompletionStatusToString(task: Task): string {
  if (task.state == TaskState.DONE) return 'x';
  else if (task.state == TaskState.TODO) return '_';
  else if (task.state == TaskState.INPROGRESS) return '~';
  else throw Error('Neznamy stav');
}

function formatBoolean(b: boolean) {
  return b === true ? 'Ano' : 'Ne';
}

function writeAllTasks(storage: TaskStorage) {
  const allTasks = storage.getAllTasks();

  if (allTasks.length === 0) {
    console.log('Nemate zadne ukoly.');
  } else {
    for (const task of allTasks) {
      console.log(
        `${task.id} ... [${taskCompletionStatusToString(task)}] ${task.name}`
      );
    }
  }
}

async function createTaskMenu(storage: TaskStorage) {
  console.clear();
  console.log('ZALOZIT NOVY UKOL');
  console.log('Nazev ukolu:');

  const taskName = await consolePrompt();

  console.log('T ... Chci ukol s textem');
  console.log('S ... Chci ukol se seznamem');

  const input = (await consolePrompt()).toLowerCase();

  if (input === 'T') {
    await createTaskWithTextMenu(storage, taskName);
  } else if (input === 'S') {
    await createTaskWithListMenu(storage, taskName);
  }

  await mainMenu(storage);
}

async function manageTaskMenu(storage: TaskStorage, taskId: number) {
  const task = storage.getTaskById(taskId);

  console.clear();
  console.log('DETAIL UKOLU');
  console.log(`Nazev: ${task.name}`);
  console.log(`Stav: ${task.state}`);
  console.log('---');
  console.log('');

  if (isTaskWithText(task)) {
    console.log('Text: ' + task.text);
  } else if (isTaskWithList(task)) {
    for (const item of task.list) console.log('* ' + item);
  }

  console.log('P ... Oznacit ukol jako rozpracovany');
  console.log('H ... Oznacit ukol jako hotovy');
  console.log('T ... Oznacit ukol jako k rozpracovani');

  console.log('S ... Smazat ukol');
  console.log('Z ... Zavrit ukol');

  const action = (await consolePrompt()).toLowerCase();

  if (action === 'p') {
    storage.setTaskCompletionStatus(taskId, TaskState.INPROGRESS);
    await manageTaskMenu(storage, taskId);
  } else if (action === 'h') {
    storage.setTaskCompletionStatus(taskId, TaskState.DONE);
    await manageTaskMenu(storage, taskId);
  } else if (action === 't') {
    storage.setTaskCompletionStatus(taskId, TaskState.TODO);
    await manageTaskMenu(storage, taskId);
  } else if (action === 's') {
    storage.deleteTaskById(taskId);
    await mainMenu(storage);
  } else if (action === 'z') {
    await mainMenu(storage);
  } else {
    console.log('Neplatna volba.');
    await manageTaskMenu(storage, taskId);
  }
}

export async function mainMenu(storage: TaskStorage) {
  console.clear();
  console.log('UKOLNICEK');
  console.log('0 ... Zalozit novy ukol');
  console.log('---');
  writeAllTasks(storage);

  const selection = await consolePrompt();
  const selectedNumber = parseInt(selection, 10);

  if (!isNaN(selectedNumber)) {
    if (selectedNumber === 0) {
      await createTaskMenu(storage);
    } else {
      await manageTaskMenu(storage, selectedNumber);
    }
  } else {
    console.log('Neplatna volba.');
    await mainMenu(storage);
  }
}

async function createTaskWithTextMenu(storage: TaskStorage, taskName: string) {
  console.clear();
  console.log('ZALOZIT NOVY UKOL S TEXTEM');
  console.log('Text ukolu ' + taskName + ':');
  const text = await consolePrompt();

  storage.createTaskWithText(taskName, text);
}

async function createTaskWithListMenu(storage: TaskStorage, taskName: string) {
  console.clear();
  console.log('ZALOZIT NOVY UKOL SE SEZNAMEM');
  console.log('Seznam u ukolu ' + taskName + ':');

  let array: string[] = [];
  let finished = false;
  while (!finished) {
    console.log('Polozka seznamu (. pro konec seznamu):');
    const text = await consolePrompt();

    if (text === '.') finished = true;
    else array.push(text);
  }

  storage.createTaskWithList(taskName, array);
}
