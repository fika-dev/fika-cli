import {
  WrongTagFormat,
  WRONG_TAG_FORMAT,
} from "./exceptions/wrong_tag_format";

export class VersionTag {
  static versionPattern: RegExp = /(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))*/g;
  verionString: string;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  static parseVersion(version: string): VersionTag {
    const versionPattern: RegExp = /(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))*/g;
    const matched = versionPattern.exec(version);
    if (matched) {
      return {
        verionString: matched[0],
        majorVersion: parseInt(matched[1]),
        minorVersion: parseInt(matched[2]),
        patchVersion: matched[3] !== undefined ? parseInt(matched[3]) : 0,
      };
    } else {
      throw new WrongTagFormat(WRONG_TAG_FORMAT);
    }
  }
  static isFirstMoreRecent(first: VersionTag, second: VersionTag): boolean {
    // if equal return true
    if (first.majorVersion > second.majorVersion) {
      return true;
    } else if (first.majorVersion < second.majorVersion) {
      return false;
    } else if (first.minorVersion > second.minorVersion) {
      return true;
    } else if (first.minorVersion < second.minorVersion) {
      return false;
    } else if (first.patchVersion > second.patchVersion) {
      return true;
    } else if (first.patchVersion < second.patchVersion) {
      return false;
    } else {
      return true;
    }
  }
}
