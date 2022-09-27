type Path = string;
type Windows = "Windows";
type NotWindows = "NotWindows";
type OS = Windows | NotWindows;
type NotInstalled = "NotInstalled";
type Version = string;
export interface CmdContext {
  gitVersion?: Version | NotInstalled;
  ghCliVersion?: Version | NotInstalled;
}
