import { mainMenu } from './screens';
import { TaskStorage } from './task-storage';

const storage = new TaskStorage();

async function main() {
  try {
    await mainMenu(storage);
  } catch (ex) {
    if (ex instanceof Error) {
      console.log(ex.message);
    }
    await main();
  }
}

main();
