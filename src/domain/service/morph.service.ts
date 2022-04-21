import { Morpher } from "../entity/morpher.entity";
import { IMorphService } from "./i_morph.service";

export class MorphService implements IMorphService{
  private _morpher: Morpher | undefined;
  public addFikaUri(uri: string): void {
    throw new Error("Method not implemented.");
  }
}