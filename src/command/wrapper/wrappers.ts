import { NotAuthenticated } from "@/domain/value_object/exceptions/not_authenticated";
import { authHandler } from "../auth/auth-handler";
import { errorHandler } from "../error/error_handlers";
import { updateHandler } from "../update/update-handler";

export async function syncWrapper<T extends any[], K>(
  func: (...args: T) => K,
  ...params: T
): Promise<[K | null, any]> {
  try {
    await authHandler();
    return [func(...params), null];
  } catch (e) {
    errorHandler(e);
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

export async function commandWrapper(
  func: Function,
  ...argument: any
): Promise<any> {
  const [needForceUpdate] =  await asyncWrapper(updateHandler());
  if (!needForceUpdate){
    const [isAuthenticated] = await asyncWrapper(authHandler());
    if (isAuthenticated){
      return asyncWrapper(func(...argument));
    }else{
      throw new NotAuthenticated('NOT_AUTHENTICATED');
    }
  }else{
    return;
  } 
}