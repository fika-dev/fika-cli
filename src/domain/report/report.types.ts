import { DomainError, DomainSuccess, Unit } from "../general/general.types";

export interface ReportSuccess {
  description: "Report success to users";
  (success: DomainSuccess): Unit;
}

export interface ReportError {
  description: "Report success to users";
  (success: DomainError): Unit;
}
