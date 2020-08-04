import { CarData } from "../types/types";

export abstract class Parser {
  abstract getData(html: string): CarData
  abstract async parse(): Promise<void>
}