// Markup lookups that fail fast with the missing selector instead of returning nothing.
export function findAll(parent, selector) {
  const elements = [...parent.querySelectorAll(selector)];
  if (elements.length === 0) {
    throw new Error(`Gut Run: ${selector} is missing from index.html`);
  }
  return elements;
}

export function find(parent, selector) {
  return findAll(parent, selector)[0];
}
