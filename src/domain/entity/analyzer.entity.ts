import { AddOn } from "./add-on.entity";

export interface Analyzer extends AddOn{
  analyze(): Promise<void>;
}