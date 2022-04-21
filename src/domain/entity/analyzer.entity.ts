import { AddOn } from "./add_on.entity";

export interface Analyzer extends AddOn{
  analyze(): Promise<void>;
}