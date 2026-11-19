// Keep this file for genuinely generic class-name or formatting helpers as the app needs them.
// Do not add a utility merely to avoid a small, readable inline expression.
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}
