export interface ArgsParsered {
  [x: string]: unknown;
  'project-name': string | undefined;
  verbose: boolean | undefined;
  'template ': string | undefined;
  'use-npm': boolean | undefined;
  _: string[];
  $0: string;
}
