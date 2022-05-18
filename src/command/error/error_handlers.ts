import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { IErrorHandlingService } from "@/domain/service/i_error_handling.service";
import BaseException from "@/domain/value_object/exceptions/base_exception";
import { UnknownError } from "@/domain/value_object/exceptions/unknown_error";


export function syncErrorHandler<T extends any[], K>(
  func: (...args: T) => K,
  ...params: T
): [K | null, any] {
  try {
    return [func(...params), null];
  } catch (e) {
    const errorHandlingService = container.get<IErrorHandlingService>(SERVICE_IDENTIFIER.ErrorHandlingService);
    if (!(e instanceof BaseException)){
      const unknownError = new UnknownError("UNKNOWN_ERROR", e.message);
      errorHandlingService.handle(unknownError);  
    }
    errorHandlingService.handle(e);
  }
}

export async function asyncErrorHandler<T>(
  prom: Promise<T>
): Promise<[T | null, any]> {
  try {
    return [await prom, null];
  } catch (e) {
    const errorHandlingService = container.get<IErrorHandlingService>(SERVICE_IDENTIFIER.ErrorHandlingService);
    if (!(e instanceof BaseException)){
      const unknownError = new UnknownError("UNKNOWN_ERROR", e.message);
      errorHandlingService.handle(unknownError);  
    }
    errorHandlingService.handle(e);
  }
}