/**
 * Tiny domain module under test. Shopping-cart-style API — concrete
 * enough that tests look like real tests, simple enough to read in
 * one screen.
 */

function emptyCart() {
  return { items: [], total: 0 };
}

function addItem(cart, item) {
  if (!item || typeof item.price !== "number" || item.price < 0) {
    throw new Error("addItem: item.price must be a non-negative number");
  }
  const items = [...cart.items, { ...item, qty: item.qty ?? 1 }];
  return { items, total: subtotal(items) };
}

function removeItem(cart, sku) {
  const items = cart.items.filter((i) => i.sku !== sku);
  return { items, total: subtotal(items) };
}

function subtotal(items) {
  return items.reduce((sum, i) => sum + i.price * (i.qty ?? 1), 0);
}

/**
 * Apply a percentage discount (0-100). Rounds the final total to two
 * decimal places to avoid floating-point junk in the displayed price.
 */
function applyDiscount(cart, percent) {
  if (typeof percent !== "number" || percent < 0 || percent > 100) {
    throw new Error("applyDiscount: percent must be 0..100");
  }
  const discounted = cart.total * (1 - percent / 100);
  return { ...cart, total: Math.round(discounted * 100) / 100 };
}

module.exports = { emptyCart, addItem, removeItem, subtotal, applyDiscount };
