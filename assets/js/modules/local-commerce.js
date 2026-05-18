export function filterCatalog(items, { query = "", tag = "all" } = {}) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  const normalizedTag = String(tag || "all").trim().toLowerCase();

  return items.filter((item) => {
    const matchesQuery = !normalizedQuery || [item.title, item.excerpt, item.region]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedQuery));

    const matchesTag = normalizedTag === "all" || (item.tags || [])
      .some((value) => String(value).toLowerCase() === normalizedTag);

    return matchesQuery && matchesTag;
  });
}

export function createCartState(initialItems = []) {
  const state = new Map();

  initialItems.forEach((item) => {
    state.set(item.id, {
      id: item.id,
      title: item.title,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 0),
    });
  });

  return {
    addItem(item) {
      const existing = state.get(item.id);
      if (existing) {
        existing.quantity += Number(item.quantity || 1);
        return;
      }
      state.set(item.id, {
        id: item.id,
        title: item.title,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
      });
    },
    updateQuantity(id, quantity) {
      if (!state.has(id)) {
        return;
      }
      const nextQuantity = Number(quantity || 0);
      if (nextQuantity <= 0) {
        state.delete(id);
        return;
      }
      state.get(id).quantity = nextQuantity;
    },
    removeItem(id) {
      state.delete(id);
    },
    items() {
      return Array.from(state.values()).map((item) => ({ ...item }));
    },
    totals(feeRate = 0) {
      const items = Array.from(state.values());
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const fee = Number((subtotal * feeRate).toFixed(2));
      const total = Number((subtotal + fee).toFixed(2));
      return { itemCount, subtotal, fee, total };
    },
    clear() {
      state.clear();
    },
  };
}

export function validateCheckout({ email = "", phone = "", nationality = "" } = {}) {
  const errors = {};

  if (!String(email).trim()) {
    errors.email = "Email is required.";
  }
  if (!String(phone).trim()) {
    errors.phone = "Phone is required.";
  }
  if (!String(nationality).trim()) {
    errors.nationality = "Nationality is required.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function createLocalOrder({ customer, cartItems, feeRate = 0 }) {
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const fee = Number((subtotal * feeRate).toFixed(2));
  const total = Number((subtotal + fee).toFixed(2));

  return {
    id: `LOCAL-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer: {
      email: customer.email,
      phone: customer.phone,
      nationality: customer.nationality,
    },
    items: cartItems.map((item) => ({ ...item })),
    summary: {
      itemCount,
      subtotal,
      fee,
      total,
    },
  };
}
