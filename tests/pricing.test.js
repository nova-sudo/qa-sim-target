/**
 * Pricing module tests. Deterministic passes.
 */

const { shippingFor, vatExclusive, vatInclusive } = require("../src/pricing.js");

describe("pricing · VAT helpers", () => {
  test("vatInclusive(100, 14) = 114", () => {
    expect(vatInclusive(100, 14)).toBe(114);
  });

  test("vatExclusive(114, 14) = 100", () => {
    expect(vatExclusive(114, 14)).toBe(100);
  });

  test("vatInclusive default vat is 14%", () => {
    expect(vatInclusive(100)).toBe(114);
  });
});

describe("pricing · shipping", () => {
  test("free over 250", () => {
    expect(shippingFor(300)).toBe(0);
  });

  test("flat 15 under threshold", () => {
    expect(shippingFor(50)).toBe(15);
  });

  test("threshold is inclusive", () => {
    expect(shippingFor(250)).toBe(0);
  });
});
