export interface PistonRunStage {
  stdout: string;
  stderr: string;
  output: string;
  code: number | null;
  signal: string | null;
}

export interface PistonRunResult {
  language: string;
  version: string;
  run: PistonRunStage;
}
