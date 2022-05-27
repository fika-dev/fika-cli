import { errorHandler } from "../error/error_handlers";

export function syncWrapper<T extends any[], K>(
  func: (...args: T) => K,
  ...params: T
): [K | null, any] {
  try {
    return [func(...params), null];
  } catch (e) {
    
  }
}

export async function asyncWrapper<T>(
  prom: Promise<T>
): Promise<[T | null, any]> {
  try {
    return [await prom, null];
  } catch (e) {
    errorHandler(e);
  }
}