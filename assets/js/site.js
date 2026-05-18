import { siteData } from "./site-data.js";
import {
  createCartState,
  createLocalOrder,
  filterCatalog,
  validateCheckout,
} from "./modules/local-commerce.js";

const state = {
  locale: localStorage.getItem("wingdy_locale") || "zh",
  currency: localStorage.getItem("wingdy_currency") || "USD",
};

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function formatCurrency(amount, currency = "USD") {
  return `${currencySymbols[currency] || currency}${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

function translate(key) {
  return siteData.dictionary[state.locale]?.[key] || siteData.dictionary.en[key] || key;
}

function getCatalog() {
  return [...siteData.tickets, ...siteData.packages];
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("wingdy_cart") || "[]");
  } catch {
    return [];
  }
}

const cart = createCartState(loadCart());

function persistCart() {
  localStorage.setItem("wingdy_cart", JSON.stringify(cart.items()));
}

function setState(next) {
  Object.assign(state, next);
  localStorage.setItem("wingdy_locale", state.locale);
  localStorage.setItem("wingdy_currency", state.currency);
  renderGlobalCopy();
  renderCatalogs();
  renderPolicies();
  renderDetail();
  renderCartPage();
  renderCheckoutPage();
}

function createCard(item, hrefBase = "./pages") {
  const href = item.type === "ticket"
    ? `${hrefBase}/ticket-${item.id}.html`
    : `${hrefBase}/package-${item.id}.html`;

  return `
    <article class="product-card">
      <a class="product-card__image" href="${href}">
        <img src="${item.image}" alt="${item.title}">
      </a>
      <div class="product-card__body">
        <div class="product-card__tags">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <h3><a href="${href}">${item.title}</a></h3>
        <p>${item.excerpt}</p>
        <div class="product-card__meta">
          <strong>${formatCurrency(item.price, state.currency)}</strong>
          <span class="muted">${item.region}</span>
        </div>
        <div class="product-card__actions">
          <a class="button button--primary" href="${href}">${translate("view_ticket")}</a>
          <button class="button button--secondary" type="button" data-add-to-cart="${item.id}">${translate("add_to_cart")}</button>
        </div>
      </div>
    </article>
  `;
}

function renderCatalogs() {
  const featured = document.querySelector("[data-featured-grid]");
  const packages = document.querySelector("[data-package-grid]");
  const allProducts = document.querySelector("[data-all-products]");
  const searchInput = document.querySelector("[data-catalog-search]");
  const activeTag = document.querySelector("[data-active-tag]")?.value || "all";
  const query = searchInput?.value || "";

  const featuredItems = filterCatalog(siteData.tickets, { query, tag: activeTag });
  const packageItems = filterCatalog(siteData.packages, { query, tag: activeTag });
  const allItems = filterCatalog(getCatalog(), { query, tag: activeTag });

  if (featured) {
    featured.innerHTML = featuredItems.map((item) => createCard(item, "./pages")).join("");
  }
  if (packages) {
    packages.innerHTML = packageItems.map((item) => createCard(item, "./pages")).join("");
  }
  if (allProducts) {
    allProducts.innerHTML = allItems.map((item) => createCard(item, ".")).join("");
  }

  bindAddToCartButtons();
}

function renderPolicies() {
  const grid = document.querySelector("[data-policy-grid]");
  if (!grid) {
    return;
  }
  grid.innerHTML = siteData.policies.map((policy) => `
    <article>
      <p class="eyebrow" data-copy="policy">${translate("policy")}</p>
      <h3>${policy.title}</h3>
      <p>${policy.content}</p>
    </article>
  `).join("");
}

function renderGlobalCopy() {
  document.querySelectorAll("[data-copy]").forEach((node) => {
    const key = node.getAttribute("data-copy");
    if (key) {
      node.textContent = translate(key);
    }
  });

  const cookieCopy = document.querySelector("[data-cookie-copy]");
  if (cookieCopy) cookieCopy.textContent = translate("consent_title");
  const cookieAccept = document.querySelector("[data-cookie-accept]");
  if (cookieAccept) cookieAccept.textContent = translate("consent_accept");
  const cookieDismiss = document.querySelector("[data-cookie-dismiss]");
  if (cookieDismiss) cookieDismiss.textContent = translate("consent_decline");
}

function bindSwitchers() {
  document.querySelectorAll("[data-locale-toggle]").forEach((button) => {
    button.addEventListener("click", () => setState({ locale: button.dataset.localeToggle || "en" }));
  });
  document.querySelectorAll("[data-currency-toggle]").forEach((button) => {
    button.addEventListener("click", () => setState({ currency: button.dataset.currencyToggle || "USD" }));
  });
}

function bindCatalogSearch() {
  const search = document.querySelector("[data-catalog-search]");
  search?.addEventListener("input", () => renderCatalogs());
}

function bindTagFilters() {
  document.querySelectorAll("[data-filter-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      const hidden = document.querySelector("[data-active-tag]");
      if (hidden) {
        hidden.value = button.dataset.filterTag || "all";
      }
      renderCatalogs();
    });
  });
}

function bindAddToCartButtons() {
  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-add-to-cart");
      const item = getCatalog().find((entry) => entry.id === id);
      if (!item) {
        return;
      }
      cart.addItem({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: 1,
      });
      persistCart();
      renderCartPage();
    });
  });
}

function bindConsent() {
  const banner = document.querySelector("[data-cookie-banner]");
  if (!banner) return;
  const accepted = localStorage.getItem("wingdy_cookie_ok") === "1";
  banner.hidden = accepted;
  document.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    localStorage.setItem("wingdy_cookie_ok", "1");
    banner.hidden = true;
  });
  document.querySelector("[data-cookie-dismiss]")?.addEventListener("click", () => {
    banner.hidden = true;
  });
}

function appendMessage(text, type) {
  const messages = document.querySelector("[data-chat-messages]");
  if (!messages) return;
  const item = document.createElement("p");
  item.className = `chat-widget__message chat-widget__message--${type}`;
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function bindChat() {
  const panel = document.querySelector("[data-chat-panel]");
  const toggle = document.querySelector("[data-chat-toggle]");
  const form = document.querySelector("[data-chat-form]");
  const input = form?.querySelector("input[name='message']");

  toggle?.addEventListener("click", () => {
    if (panel) panel.hidden = !panel.hidden;
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!input?.value) return;
    appendMessage(input.value, "user");
    const normalized = input.value.toLowerCase();
    const match = siteData.faq.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
    appendMessage(match ? match.answer : translate("support_fallback"), "bot");
    input.value = "";
  });
}

function renderDetail() {
  const detail = document.querySelector("[data-detail-id]");
  if (!detail) return;
  const id = detail.dataset.detailId;
  const item = getCatalog().find((entry) => entry.id === id);
  if (!item) return;

  const title = detail.querySelector("[data-detail-title]");
  const image = detail.querySelector("[data-detail-image]");
  const excerpt = detail.querySelector("[data-detail-excerpt]");
  const price = detail.querySelector("[data-detail-price]");
  const tags = detail.querySelector("[data-detail-tags]");
  const region = detail.querySelector("[data-detail-region]");
  const addToCart = detail.querySelector("[data-detail-add-to-cart]");

  if (title) title.textContent = item.title;
  if (image) {
    image.src = item.image;
    image.alt = item.title;
  }
  if (excerpt) excerpt.textContent = item.excerpt;
  if (price) price.textContent = formatCurrency(item.price, state.currency);
  if (tags) tags.innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join("");
  if (region) region.textContent = item.region;
  if (addToCart) {
    addToCart.setAttribute("data-add-to-cart", item.id);
    addToCart.textContent = translate("add_to_cart");
  }

  bindAddToCartButtons();
}

function renderCartPage() {
  const cartItemsHost = document.querySelector("[data-cart-items]");
  const emptyState = document.querySelector("[data-cart-empty]");
  const contentState = document.querySelector("[data-cart-content]");
  if (!cartItemsHost || !emptyState || !contentState) {
    return;
  }

  const items = cart.items();
  if (!items.length) {
    emptyState.hidden = false;
    contentState.hidden = true;
    return;
  }

  emptyState.hidden = true;
  contentState.hidden = false;

  cartItemsHost.innerHTML = items.map((item) => `
    <article class="product-card">
      <div class="product-card__body">
        <h3>${item.title}</h3>
        <p>${formatCurrency(item.price, state.currency)} x ${item.quantity}</p>
        <div class="product-card__actions">
          <button class="button button--secondary" type="button" data-cart-decrease="${item.id}">-</button>
          <button class="button button--secondary" type="button" data-cart-increase="${item.id}">+</button>
          <button class="button button--secondary" type="button" data-cart-remove="${item.id}">Remove</button>
        </div>
      </div>
    </article>
  `).join("");

  const totals = cart.totals(siteData.feeRate);
  document.querySelector("[data-cart-subtotal]").textContent = formatCurrency(totals.subtotal, state.currency);
  document.querySelector("[data-cart-fee]").textContent = formatCurrency(totals.fee, state.currency);
  document.querySelector("[data-cart-total]").textContent = formatCurrency(totals.total, state.currency);

  document.querySelectorAll("[data-cart-increase]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-cart-increase");
      const entry = cart.items().find((item) => item.id === id);
      if (!entry) return;
      cart.updateQuantity(id, entry.quantity + 1);
      persistCart();
      renderCartPage();
    });
  });

  document.querySelectorAll("[data-cart-decrease]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-cart-decrease");
      const entry = cart.items().find((item) => item.id === id);
      if (!entry) return;
      cart.updateQuantity(id, entry.quantity - 1);
      persistCart();
      renderCartPage();
    });
  });

  document.querySelectorAll("[data-cart-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      cart.removeItem(button.getAttribute("data-cart-remove"));
      persistCart();
      renderCartPage();
    });
  });
}

function renderCheckoutPage() {
  const summaryHost = document.querySelector("[data-checkout-summary]");
  if (!summaryHost) {
    return;
  }

  const totals = cart.totals(siteData.feeRate);
  summaryHost.innerHTML = `
    <p>${translate("subtotal_label")}: ${formatCurrency(totals.subtotal, state.currency)}</p>
    <p>${translate("service_fee_label")}: ${formatCurrency(totals.fee, state.currency)}</p>
    <p><strong>${translate("total_label")}: ${formatCurrency(totals.total, state.currency)}</strong></p>
  `;
}

function bindCheckoutForm() {
  const form = document.querySelector("[data-checkout-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      nationality: String(formData.get("nationality") || ""),
    };

    const validation = validateCheckout(payload);
    ["email", "phone", "nationality"].forEach((field) => {
      const target = document.querySelector(`[data-error-${field}]`);
      if (!target) return;
      const message = validation.errors[field] || "";
      target.hidden = !message;
      target.textContent = message;
    });

    if (!validation.valid) {
      return;
    }

    const order = createLocalOrder({
      customer: payload,
      cartItems: cart.items(),
      feeRate: siteData.feeRate,
    });

    const confirmation = document.querySelector("[data-order-confirmation]");
    const result = document.querySelector("[data-order-result]");
    if (confirmation && result) {
      confirmation.hidden = false;
      result.innerHTML = `
        <p><strong>ID</strong>: ${order.id}</p>
        <p><strong>Email</strong>: ${order.customer.email}</p>
        <p><strong>${translate("total_label")}</strong>: ${formatCurrency(order.summary.total, state.currency)}</p>
      `;
    }

    cart.clear();
    persistCart();
    form.reset();
    renderCartPage();
    renderCheckoutPage();
  });
}

function init() {
  renderGlobalCopy();
  renderCatalogs();
  renderPolicies();
  renderDetail();
  renderCartPage();
  renderCheckoutPage();
  bindSwitchers();
  bindCatalogSearch();
  bindTagFilters();
  bindConsent();
  bindChat();
  bindCheckoutForm();
}

window.addEventListener("DOMContentLoaded", init);
