import SERVICE_IDENTIFIER from "@/config/constants/identifiers";
import container from "@/config/ioc_config";
import { DomainError } from "@/domain/general/general.types";
import { IErrorHandlingService } from "@/domain/service/i_error_handling.service";
import BaseException from "@/domain/value_object/exceptions/base_exception";
import { UnknownError } from "@/domain/value_object/exceptions/unknown_error";

export function errorHandler(e: any) {
  const errorHandlingService = container.get<IErrorHandlingService>(
    SERVICE_IDENTIFIER.ErrorHandlingService
  );
  if (!(e instanceof BaseException)) {
    errorHandlingService.handleError(e as DomainError);
  } else {
    errorHandlingService.handle(e);
  }
}
