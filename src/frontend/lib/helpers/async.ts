/**
 * Async utilities for 10x development productivity
 */
export namespace AsyncUtils {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    options: { leading?: boolean; trailing?: boolean } = {}
  ): (...args: Parameters<T>) => void {
    const { leading = false, trailing = true } = options;
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      const callNow = leading && !timeoutId;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (trailing) func(...args);
        timeoutId = null;
      }, delay);
      if (callNow) func(...args);
    };
  }

  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  export function debouncePromise<T extends (...args: any[]) => Promise<any>>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
    let timeoutId: NodeJS.Timeout | null = null;
    let currentPromise: Promise<any> | null = null;

    return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        currentPromise = func(...args);
        const result = await currentPromise;
        currentPromise = null;
      }, delay);
      return currentPromise || Promise.resolve();
    };
  }

  export function retry<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts?: number;
      delay?: number;
      backoff?: number;
      onError?: (error: Error, attempt: number) => void;
    } = {}
  ): Promise<T> {
    const { maxAttempts = 3, delay = 1000, backoff = 2, onError } = options;
    let attempt = 1;

    const run = async (): Promise<T> => {
      try {
        return await fn();
      } catch (error) {
        if (onError) onError(error as Error, attempt);
        if (attempt >= maxAttempts) throw error;
        await new Promise((r) => setTimeout(r, delay * backoff ** (attempt - 1)));
        attempt++;
        return run();
      }
    };

    return run();
  }

  export function retryWithCondition<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts?: number;
      delay?: number;
      shouldRetry?: (error: Error) => boolean;
      onError?: (error: Error, attempt: number) => void;
    } = {}
  ): Promise<T> {
    const { maxAttempts = 5, delay = 1000, shouldRetry = () => true, onError } = options;
    let attempt = 1;

    const run = async (): Promise<T> => {
      try {
        return await fn();
      } catch (error) {
        if (onError) onError(error as Error, attempt);
        if (attempt >= maxAttempts || !shouldRetry(error as Error)) throw error;
        await new Promise((r) => setTimeout(r, delay));
        attempt++;
        return run();
      }
    };

    return run();
  }

  export function timeout<T>(
    promise: Promise<T>,
    ms: number,
    errorMessage: string = 'Operation timed out'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(errorMessage)), ms);
      promise.then(
        (result) => {
          clearTimeout(timer);
          resolve(result);
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }

  export function memoize<T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>,
    options: { maxCache?: number; ttl?: number } = {}
  ): (...args: Args) => Promise<T> {
    const { maxCache = 100, ttl = 5 * 60 * 1000 } = options;
    const cache = new Map<string, { value: T; timestamp: number }>();

    return async (...args: Args): Promise<T> => {
      const key = JSON.stringify(args);
      const now = Date.now();
      const cached = cache.get(key);

      if (cached && now - cached.timestamp < ttl) {
        return cached.value;
      }

      const result = await fn(...args);
      if (cache.size >= maxCache) {
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) {
          cache.delete(firstKey);
        }
      }
      cache.set(key, { value: result, timestamp: now });
      return result;
    };
  }

  export function queue<T>(concurrency: number = 1): {
    add: (task: () => Promise<T>) => Promise<T>;
    size: number;
    clear: () => void;
  } {
    const queue: Array<() => Promise<T>> = [];
    const results: Array<Promise<T>> = [];
    let processing = 0;

    const processNext = async () => {
      if (processing >= concurrency || queue.length === 0) return;
      processing++;
      const task = queue.shift()!;
      const result = task().finally(() => processing--);
      results.push(result);
      result.then(() => results.splice(results.indexOf(result), 1));
      processNext();
    };

    const add = async (task: () => Promise<T>): Promise<T> => {
      queue.push(task);
      processNext();
      return results[results.length - 1];
    };

    return {
      add,
      get size() {
        return queue.length + processing;
      },
      clear: () => queue.splice(0, queue.length),
    };
  }

  export async function parallel<T, R>(
    items: T[],
    processor: (item: T, index: number) => Promise<R>,
    options: { concurrency?: number } = {}
  ): Promise<R[]> {
    const { concurrency = Infinity } = options;
    const taskQueue = queue<R>(concurrency);
    items.forEach((item, index) => taskQueue.add(() => processor(item, index)));
    while (taskQueue.size > 0) await new Promise((r) => setTimeout(r, 10));
    return [];
  }

  export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  export async function delay<T>(ms: number, value: T): Promise<T> {
    await sleep(ms);
    return value;
  }

  export function withResolvers<T>(): {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
  } {
    let resolve!: (value: T) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }

  export async function gather<T>(
    promises: Array<Promise<T>>,
    options: { silent?: boolean } = {}
  ): Promise<Array<{ status: 'fulfilled' | 'rejected'; value?: T; reason?: Error }>> {
    return Promise.allSettled(promises).then((results) =>
      results.map((r) =>
        r.status === 'fulfilled'
          ? { status: 'fulfilled' as const, value: r.value }
          : { status: 'rejected' as const, reason: r.reason as Error }
      )
    );
  }

  export function pLimit<T>(concurrency: number): (fn: () => Promise<T>) => Promise<T> {
    const queue: Array<{
      fn: () => Promise<T>;
      resolve: (v: T) => void;
      reject: (e: any) => void;
    }> = [];
    let processing = 0;

    const next = () => {
      if (queue.length === 0 || processing >= concurrency) return;
      processing++;
      const { fn, resolve, reject } = queue.shift()!;
      fn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          processing--;
          next();
        });
    };

    return (fn: () => Promise<T>): Promise<T> => {
      return new Promise((resolve, reject) => {
        queue.push({ fn, resolve, reject });
        next();
      });
    };
  }
}

export default AsyncUtils;
