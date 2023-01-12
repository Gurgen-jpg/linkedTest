import {IExecutor} from './Executor';
import ITask from './Task';

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads: number = 0) {
    const runningTasks: { [targetId: number]: ITask } = {};
    let activeThreads = 0;
    const promises: Promise<any>[] = []
    const execute = async (task: ITask) => {
        try {
            //отметить что задача запущена
            runningTasks[task.targetId] = task;
            activeThreads++;
            await executor.executeTask(task);
            delete runningTasks[task.targetId];
            activeThreads--;
        } catch (err) {
            console.error(err);
        }
    };
    // обход очереди
    for await (const task of queue) {
        // Дожидаюсь когда поток будет доступен для загрузки задачи
        while (maxThreads !== 0 && activeThreads >= maxThreads) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        // Жду пока предыдущая таска с таким же id завершиться
        while (runningTasks[task.targetId]) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        promises.push(execute(task));
    }
    //дождаться выполнения всех задач
    await Promise.all(promises)
}
