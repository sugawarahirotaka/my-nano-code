
export function add(a: number, b: number): number {
  return a + b;
}

export type DivideResult = { success: true; value: number } | { success: false; error: string };

export function divide(a: number, b: number): DivideResult {
  if (b === 0) {
    return { success: false, error: "Cannot divide by zero" };
  }
  return { success: true, value: a / b };
}
