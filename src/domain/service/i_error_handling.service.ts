import BaseException from "../value_object/exceptions/base_exception";

export interface IErrorHandlingService {
  handle(exception: BaseException): void;
}
