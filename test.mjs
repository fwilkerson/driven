import { it, expect, run } from "./driven.mjs";

it("should execute the tests", async () => {
  let obj = { test: "reference equality" };
  expect("one").toBe("one");
  expect(obj).toBe(obj);
  expect({ a: "a", b: "b" }).toEqual({ a: "a", b: "b" });
});

run();
