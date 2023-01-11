import { IExecutor } from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
    maxThreads = Math.max(0, maxThreads);
    const results = [];
    const taskQueue = [];
    for await (const task of queue) {
        taskQueue.push(task);
    }
    const runningTasks = new Map();

    while (taskQueue.length > 0 || runningTasks.size > 0) {
        if (runningTasks.size < maxThreads || maxThreads === 0) {
            const task = taskQueue.shift();
            if (!runningTasks.has(task?.targetId)) {
                runningTasks.set(task?.targetId, task);
                try {
                    if (task) {
                        const result =  await executor.executeTask(task);
                        results.push(result);
                    }
                } catch (error) {
                    console.log('Error from queue');
                } finally {
                    runningTasks.delete(task?.targetId);
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    return results;
}