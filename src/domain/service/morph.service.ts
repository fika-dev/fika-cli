import { Morpher } from "../entity/morpher.entity";
import { IMorphService } from "./i-morph.service";

export class MorphService implements IMorphService{
  private _morpher: Morpher | undefined;
  public addFikaUri(): void {}
}