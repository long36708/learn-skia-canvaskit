export type Task = () => Promise<void>;

export class TaskQueue {
  _queue = [] as Task[];
  _running = false;

  async run(task: Task) {
    this._queue.push(task);
    if (!this._running) {
      this._running = true;
      while (this._queue.length > 0) {
        const task = this._queue.shift()!;
        try {
          await task();
        }
        catch (e) {
          console.error(e);
        }
      }
      this._running = false;
    }
  }
}

/**
 * 任务串行化，与一般的任务队列不同，后进任务先运行，姑且成为任务栈。
 *
 * 任务栈的作用一方面是避免过多的并发加载影响到 UI 线程，另一方面也使得 tile 加载更合理，
 * 后进先出使得当前要显示的 tile 总是可以以最高优先级加载，设置一个有限的栈大小（这里是 16）
 * 可以更好地避免不必要的加载。
 */
export class TaskStack {
  _length = 16;
  _queue = [] as Task[];
  _running = false;
  _count = 0;

  async run(task: Task) {
    this._push(task);
    if (!this._running) {
      this._running = true;
      while (this._queue.length > 0) {
        const task = this._queue.pop();
        if (task) {
          await task();
        }
        else {
          this._queue = [];
        }
      }
      this._running = false;
    }
  }

  _push(task: Task) {
    this._queue[this._count % this._length] = task;
    this._count += 1;
  }

  _pop(): Task | undefined {
    const index = this._count % this._length;
    const task = this._queue[index];
    delete this._queue[index];
    this._count -= 1;
    return task;
  }
}
