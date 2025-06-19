// lib/type-check.ts
export type AwaitedFirstArg<T> =
  T extends (arg: infer A) => Promise<any> ? A :
  T extends (arg: infer A) => any ? A :
  never;

export type Diff<A, B> = {
  [K in keyof A & keyof B as A[K] extends B[K]
    ? B[K] extends A[K]
      ? never
      : K
    : K]: [A[K], B[K]];
} & {
  [K in Exclude<keyof A, keyof B>]: [A[K], undefined];
} & {
  [K in Exclude<keyof B, keyof A>]: [undefined, B[K]];
};

// ✅ Use this stripped version in your file
export function checkFields<_ extends { [K in keyof any]: never }>(): void {}
