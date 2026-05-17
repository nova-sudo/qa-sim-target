/**
 * Edge cases + input-validation tests. All deterministic passes.
 */

const { addItem, applyDiscount, emptyCart } = require("../src/cart.js");

describe("cart · input validation", () => {
  test("addItem rejects missing price", () => {
    expect(() => addItem(emptyCart(), { sku: "A" })).toThrow(/price/);
  });

  test("addItem rejects negative price", () => {
    expect(() => addItem(emptyCart(), { sku: "A", price: -1 })).toThrow();
  });

  test("applyDiscount rejects 101 percent", () => {
    expect(() => applyDiscount(emptyCart(), 101)).toThrow(/0\.\.100/);
  });

  test("applyDiscount rejects negative percent", () => {
    expect(() => applyDiscount(emptyCart(), -1)).toThrow();
  });
});
