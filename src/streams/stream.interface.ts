export interface AIStreamParser {
  (data: string): string | void;
}
