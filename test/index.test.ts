import { add } from "../src/utils/index";

describe("Application Tests", () => {
  test("should return expected result from someFunction", () => {
    const result = add(1, 2);
    expect(result).toBe(3);
  });

  // Add more tests as needed
});
