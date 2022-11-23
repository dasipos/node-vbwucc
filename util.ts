import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export async function consolePrompt(): Promise<string> {
    return new Promise(resolve => {
        rl.question('>>> ', resolve);
    });
}
