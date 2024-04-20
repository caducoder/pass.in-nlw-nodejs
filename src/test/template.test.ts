import { it } from "@jest/globals"

function sum (a: number, b: number) {
  return a + b;
}

it("sums two values", () => {
  expect(sum(2, 3)).toBe(5)
})