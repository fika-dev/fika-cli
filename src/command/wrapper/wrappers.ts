import { authHandler } from "../auth/auth-handler";
import { errorHandler } from "../error/error_handlers";

export async function syncWrapper<T extends any[], K>(
  func: (...args: T) => K,
  ...params: T
): Promise<[K | null, any]> {
  try {
    await authHandler();
    return [func(...params), null];
  } catch (e) {
    
  }
}

export async function asyncWrapper<T>(
  prom: Promise<T>
): Promise<[T | null, any]> {
  try {
    await authHandler();
    return [await prom, null];
  } catch (e) {
    errorHandler(e);
  }
}