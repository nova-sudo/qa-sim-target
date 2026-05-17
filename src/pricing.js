/**
 * Pricing helpers. Separated from cart.js so tests can target each
 * module independently and the test count is meaningfully > 1.
 */

function vatInclusive(amount, vatPercent = 14) {
  return Math.round(amount * (1 + vatPercent / 100) * 100) / 100;
}

function vatExclusive(grossAmount, vatPercent = 14) {
  return Math.round((grossAmount / (1 + vatPercent / 100)) * 100) / 100;
}

/**
 * Free shipping over a threshold. Returns the shipping price in the
 * cart's currency — 0 when the threshold is met.
 */
function shippingFor(subtotal, { freeOver = 250, flat = 15 } = {}) {
  if (subtotal >= freeOver) return 0;
  return flat;
}

module.exports = { vatInclusive, vatExclusive, shippingFor };
