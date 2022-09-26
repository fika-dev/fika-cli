import { VersionTag } from "@/domain/value_object/version_tag.vo";

type Path = string;
type Windows = "Windows";
type NotWindows = "NotWindows";
type OS = Windows | NotWindows;
type NotInstalled = "NotInstalled";
export interface CmdContext {
  currentPath?: Path;
  os?: OS;
  gitVersion?: VersionTag | NotInstalled;
  ghCliVersion?: VersionTag | NotInstalled;
}
