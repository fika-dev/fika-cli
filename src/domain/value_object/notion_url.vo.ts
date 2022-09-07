import { isUri } from "valid-url";
import { WrongUri } from "./exceptions/wrong_uri";

export class NotionUrl {
  private _url: string;
  constructor(uriString: string) {
    const isValid = this.isValid(uriString);
    if (!isValid) {
      throw new WrongUri("WRONG_URI");
    }
    this._url = uriString;
  }

  public asString(): string {
    return this._url;
  }

  private isValid(uriString: string) {
    return isUri(uriString);
  }
}
