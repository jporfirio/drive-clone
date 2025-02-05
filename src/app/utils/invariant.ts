const isProduction = process.env.NODE_ENV === "production";
const prefix = "Invariant failed";

export default function invariant(
  condition: boolean,
  message?: string | (() => string),
): asserts condition {
  if (condition) return;

  if (isProduction) throw new Error(prefix);

  const provided: string | undefined =
    typeof message === "function" ? message() : message;

  const value: string = provided ? `${prefix}: ${provided}` : prefix;
  throw new Error(value);
}
