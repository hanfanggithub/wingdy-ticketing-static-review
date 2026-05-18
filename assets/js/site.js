import { siteData } from "./site-data.js";

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

function setState(next) {
  Object.assign(state, next);
  localStorage.setItem("wingdy_locale", state.locale);
  localStorage.setItem("wingdy_currency", state.currency);
  renderGlobalCopy();
  renderCatalogs();
  renderPolicies();
  renderDetail();
}

function createCard(item) {
  const href = item.type === "ticket"
    ? `./pages/ticket-${item.id}.html`
    : `./pages/package-${item.id}.html`;

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
          <a class="button button--secondary" href="./pages/policy.html#checkout">${translate("checkout")}</a>
        </div>
      </div>
    </article>
  `;
}

function renderCatalogs() {
  const featured = document.querySelector("[data-featured-grid]");
  const packages = document.querySelector("[data-package-grid]");
  const allProducts = document.querySelector("[data-all-products]");

  if (featured) {
    featured.innerHTML = siteData.tickets.map(createCard).join("");
  }
  if (packages) {
    packages.innerHTML = siteData.packages.map(createCard).join("");
  }
  if (allProducts) {
    const merged = [...siteData.tickets, ...siteData.packages];
    allProducts.innerHTML = merged.map(createCard).join("");
  }
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

  const placeholders = [
    ["[data-placeholder='search_label']", "search_label"],
    ["[data-placeholder='faq']", "support_title"],
  ];

  placeholders.forEach(([selector, key]) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute("placeholder", translate(key));
    });
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
  const item = [...siteData.tickets, ...siteData.packages].find((entry) => entry.id === id);
  if (!item) return;

  const title = detail.querySelector("[data-detail-title]");
  const image = detail.querySelector("[data-detail-image]");
  const excerpt = detail.querySelector("[data-detail-excerpt]");
  const price = detail.querySelector("[data-detail-price]");
  const tags = detail.querySelector("[data-detail-tags]");
  const region = detail.querySelector("[data-detail-region]");

  if (title) title.textContent = item.title;
  if (image) {
    image.src = item.image;
    image.alt = item.title;
  }
  if (excerpt) excerpt.textContent = item.excerpt;
  if (price) price.textContent = formatCurrency(item.price, state.currency);
  if (tags) tags.innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join("");
  if (region) region.textContent = item.region;
}

function init() {
  renderGlobalCopy();
  renderCatalogs();
  renderPolicies();
  renderDetail();
  bindSwitchers();
  bindConsent();
  bindChat();
}

window.addEventListener("DOMContentLoaded", init);
