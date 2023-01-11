import { IExecutor } from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    const results = [];
    const taskQueue = [];
    for await (const task of queue) {
        taskQueue.push(task);
    }
    while (taskQueue.length > 0) {
        const currentTasks = taskQueue.splice(0, maxThreads);
        const promises = currentTasks.map(task => executor.executeTask(task));
        const taskResults = await Promise.all(promises);
        results.push(...taskResults);
    }
    return results;
}