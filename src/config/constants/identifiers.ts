const SERVICE_IDENTIFIER = {
  AnalyzeService: Symbol.for("AnalyzeService"),
  ConfigService: Symbol.for("ConfigService"),
  ConnectService: Symbol.for("ConnectService"),
  MorphService: Symbol.for("MorphService"),
  MessageService: Symbol.for("MessageService"),
  SnapshotService: Symbol.for("SnapshotService"),
  GitPlatformService: Symbol.for("GitPlatformService"),
  ErrorHandlingService: Symbol.for("ErrorHandlingService"),
  PromptService: Symbol.for("PromptService"),
};

export const PARAMETER_IDENTIFIER = {
  Domain: Symbol.for("DomainParameter")
}

export default SERVICE_IDENTIFIER;
