/**
 * Solid pass tests — the happy path for cart operations.
 * These should NEVER fail; flagging them as flaky in dashboards is a
 * sign of real regression.
 */

const { addItem, applyDiscount, emptyCart, removeItem } = require("../src/cart.js");

describe("cart · basic operations", () => {
  test("emptyCart returns zero state", () => {
    expect(emptyCart()).toEqual({ items: [], total: 0 });
  });

  test("addItem appends + recomputes total", () => {
    let c = emptyCart();
    c = addItem(c, { sku: "A", price: 10 });
    c = addItem(c, { sku: "B", price: 25 });
    expect(c.items).toHaveLength(2);
    expect(c.total).toBe(35);
  });

  test("addItem respects qty", () => {
    let c = emptyCart();
    c = addItem(c, { sku: "A", price: 10, qty: 3 });
    expect(c.total).toBe(30);
  });

  test("removeItem drops by SKU", () => {
    let c = addItem(addItem(emptyCart(), { sku: "A", price: 10 }), {
      sku: "B",
      price: 20,
    });
    c = removeItem(c, "A");
    expect(c.items).toHaveLength(1);
    expect(c.items[0].sku).toBe("B");
    expect(c.total).toBe(20);
  });

  test("applyDiscount(20) drops total by 20%", () => {
    let c = addItem(emptyCart(), { sku: "A", price: 100 });
    c = applyDiscount(c, 20);
    expect(c.total).toBe(80);
  });
});
