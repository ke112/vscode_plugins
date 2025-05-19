
const LOG_PREFIX = '[FNPlugin]';
// 是否启用日志输出，开发时设为 true，发布时可设为 false 来禁用所有日志
const ENABLE_LOGGING = true;

export function log(...args: any[]) {
    if (ENABLE_LOGGING) {
        console.log(LOG_PREFIX, ...args);
    }
}