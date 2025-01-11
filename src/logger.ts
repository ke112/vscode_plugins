
const LOG_PREFIX = '[MyPlugin]';

export function log(...args: any[]) {
    console.log(LOG_PREFIX, ...args);
}