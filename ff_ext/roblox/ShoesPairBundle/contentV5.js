
(() => {
  if (window.top !== window) return;

  const LABEL = "Shoe Pairs";
  const TYPE = "Shoes";

  let data = null;
  let loading = null;

  let gridEl = null;
  let pairsMenuItem = null;
  let pairsSelected = false;

  let currentItems = null;
  let viewToken = 0;
  let timer = null;
	let breadcrumbNode = null;
	let breadcrumbOriginalText = null;

  const style = document.createElement("style");

  style.textContent = `
    .rfb-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0 0 16px 0;
    }

    .rfb-msg {
      font-size: 14px;
      opacity: .8;
      padding: 8px 0;
    }

    .rfb-warning {
      color: #e5b85c;
    }

    .rfb-card {
      display: block;
      width: 113px;
      color: inherit;
      text-decoration: none;
    }

    .rfb-thumb {
      width: 113px;
      height: 113px;
      border-radius: 6px;
      background: rgba(128,128,128,.28);
      overflow: hidden;
    }

    .rfb-thumb img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }

    .rfb-name {
      font-size: 14px;
      line-height: 18px;
      margin-top: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .rfb-by {
      font-size: 11px;
      opacity: .8;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rfb-price {
      font-size: 14px;
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .rfb-price svg {
      width: 14px;
      height: 14px;
    }

    .rfb-retry {
      margin-top: 8px;
      cursor: pointer;
    }

    .current-items.rfb-pairs-active > .item-cards,
    .current-items.rfb-pairs-active > #assetsItems,
    .current-items.rfb-pairs-active > .pager-holder {
      display: none !important;
    }
  `;

  document.documentElement.appendChild(style);

  function getPageMode() {
    if (/\/users\/\d+\/favorites/i.test(location.pathname)) return "favorites";
    if (/\/users\/\d+\/inventory/i.test(location.pathname)) return "inventory";
    return null;
  }

  function isSupportedPage() {
    return getPageMode() !== null;
  }

  function getInventoryUserId() {
    const fromMeta = document.querySelector('meta[name="user-data"]')?.dataset.userid;
    const fromPath = location.pathname.match(/\/users\/(\d+)\/inventory/i)?.[1];
    return fromMeta || fromPath || null;
  }

  // Find the actual Roblox Shoes submenu.
  function findShoesMenu() {
    const menu = document.querySelector("#vertical-menu");

    if (!menu) return null;

    const shoesLink = menu.querySelector(
      ':scope > li.menu-option > a[href="#!/shoes"]'
    );

    if (!shoesLink) return null;

    const shoesCategory = shoesLink.closest("li.menu-option");

    return {
      category: shoesCategory,
      submenu: shoesCategory.querySelector(
        ":scope > .menu-secondary-container > .menu-secondary"
      )
    };
  }

  // Add Shoe Pairs after Right Shoe.
  function tryInject() {
    if (!isSupportedPage()) return;

    const result = findShoesMenu();

    if (!result || !result.submenu) return;

    const { submenu } = result;

    if (
      pairsMenuItem &&
      pairsMenuItem.isConnected &&
      pairsMenuItem.parentElement === submenu
    ) {
      return;
    }

    const existing = submenu.querySelector(
      ':scope > li[data-rfb-pairs-menu]'
    );

    if (existing) {
      pairsMenuItem = existing;
      return;
    }

    const item = document.createElement("li");

    item.className = "menu-secondary-option";
    item.dataset.rfbPairsMenu = "1";
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");

    const label = document.createElement("span");

    label.className = "font-caption-header menu-text";
    label.textContent = LABEL;

    item.appendChild(label);

    item.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      selectPairs();
    });

    item.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectPairs();
      }
    });

    const rightShoe = submenu.querySelector(
      ':scope > li.menu-secondary-option[href="#!/shoes/right-shoe"]'
    );

    if (rightShoe) {
      rightShoe.insertAdjacentElement("afterend", item);
    } else {
      submenu.appendChild(item);
    }

    pairsMenuItem = item;

    updateMenuSelection();
  }

  // Keep the custom selection visually active.
  function updateMenuSelection() {
    const result = findShoesMenu();

    if (!result) return;

    result.submenu
      .querySelectorAll(":scope > li.menu-secondary-option")
      .forEach(item => {
        if (item === pairsMenuItem) {
          item.classList.toggle("active", pairsSelected);
        } else {
          item.classList.toggle(
            "active",
            !pairsSelected &&
            item.getAttribute("href") === location.hash
          );
        }
      });
  }

  // Find the real Favorites content area.
  function findContent() {
    const selector = getPageMode() === "inventory"
      ? "#inventory-container .current-items"
      : "#favorites-container .current-items";
    return document.querySelector(selector);
  }

  function createGrid() {
    gridEl = document.createElement("div");
    gridEl.className = "rfb-wrap";
    gridEl.dataset.rfbGrid = "1";

    const message = document.createElement("div");

    message.className = "rfb-msg";
    message.textContent = "Loading…";

    gridEl.appendChild(message);
  }
function updateBreadcrumb() {
  const header = currentItems?.querySelector(
    ":scope > .container-header"
  );

  if (!header) return;

  // Find the exact breadcrumb element containing "Left Shoe".
  const candidates = [...header.querySelectorAll("*")];

  const node = candidates.find(el =>
    el.children.length === 0 &&
    el.textContent.trim() === "Left Shoe"
  );

  if (!node) return;

  breadcrumbNode = node;

  if (breadcrumbOriginalText === null) {
    breadcrumbOriginalText = node.textContent;
  }

  node.textContent = "Shoe Pairs";
}

  function restoreBreadcrumb() {
    if (
      breadcrumbNode?.isConnected &&
      breadcrumbNode.textContent.trim() === "Shoe Pairs"
    ) {
      breadcrumbNode.textContent = breadcrumbOriginalText;
    }

    breadcrumbNode = null;
    breadcrumbOriginalText = null;
  }
  // Mount directly below Roblox's content header.
  function mountGrid() {
    if (!pairsSelected) return false;

    const content = findContent();

    if (!content) return false;

    const header = content.querySelector(
      ":scope > .container-header"
    );

    if (!header) return false;

    currentItems = content;

    content.classList.add("rfb-pairs-active");

    updateBreadcrumb();

    if (!gridEl) {
      createGrid();
    }

    if (
      gridEl.parentElement !== content ||
      gridEl.previousElementSibling !== header
    ) {
      header.insertAdjacentElement("afterend", gridEl);
    }

    return true;
  }

  function cleanup() {
    viewToken++;

    restoreBreadcrumb();

    pairsSelected = false;

    if (gridEl) {
      gridEl.remove();
      gridEl = null;
    }

    document.querySelectorAll(
      ".current-items.rfb-pairs-active"
    ).forEach(el => {
      el.classList.remove("rfb-pairs-active");
    });

    currentItems = null;

    updateMenuSelection();
  }

  function priceEl(d) {
    const p = document.createElement("div");

    p.className = "rfb-price";

    if (!d.forSale) {
      p.textContent = "Off sale";
      return p;
    }

    if (d.price == null) return p;

    p.innerHTML =
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<path d="M8 1.5l5.6 3.25v6.5L8 14.5l-5.6-3.25v-6.5z"/>' +
      '<rect x="6" y="6" width="4" height="4" fill="currentColor" stroke="none"/>' +
      '</svg>';

    p.appendChild(
      document.createTextNode(String(d.price))
    );

    return p;
  }

  function render() {
    if (!gridEl) return;

    gridEl.textContent = "";

    const errors = data?.errors || [];

    if (errors.length) {
      const warning = document.createElement("div");

      warning.className = "rfb-msg rfb-warning";

      warning.textContent =
        `${errors.length} bundle request(s) failed. Results may be incomplete.`;

      gridEl.appendChild(warning);
    }

    const items = (data?.items || [])
      .filter(d => d.type === TYPE);

    if (!items.length) {
      const message = document.createElement("div");

      message.className = "rfb-msg";

      message.textContent = errors.length
        ? "Could not retrieve all shoe bundles."
        : (getPageMode() === "inventory"
          ? "No owned shoe pairs found."
          : "No favorited shoe pairs found.");

      gridEl.appendChild(message);
    }

    for (const d of items) {
      const a = document.createElement("a");

      a.className = "rfb-card";
      a.href = "https://www.roblox.com/bundles/" + d.id;

      const thumb = document.createElement("div");

      thumb.className = "rfb-thumb";

      if (d.thumb) {
        const img = document.createElement("img");

        img.src = d.thumb;
        img.alt = "";
        img.onerror = () => img.remove();

        thumb.appendChild(img);
      }

      const name = document.createElement("div");

      name.className = "rfb-name";
      name.textContent = d.name;

      const creator = document.createElement("div");

      creator.className = "rfb-by";
      creator.textContent = "By " + d.creator;

      a.append(
        thumb,
        name,
        creator,
        priceEl(d)
      );

      gridEl.appendChild(a);
    }

    if (errors.length) {
      const retry = document.createElement("button");

      retry.className = "rfb-retry";
      retry.textContent = "Retry failed requests";

      retry.addEventListener("click", () => {
        data = null;
        loading = null;
        loadData(viewToken);
      });

      gridEl.appendChild(retry);
    }
  }

  async function loadData(token) {
    if (!pairsSelected || !gridEl) return;

    try {
      if (!data) {
        if (!loading) {
          const request = getPageMode() === "inventory"
            ? { type: "getOwnedShoeBundles", userId: getInventoryUserId() }
            : { type: "getFavoriteBundles" };
          loading = browser.runtime.sendMessage(request);
        }

        const request = loading;

        try {
          data = await request;
        } finally {
          if (loading === request) {
            loading = null;
          }
        }
      }

      if (
        token !== viewToken ||
        !pairsSelected ||
        !gridEl
      ) {
        return;
      }

      render();

    } catch (e) {
      if (
        token !== viewToken ||
        !pairsSelected ||
        !gridEl
      ) {
        return;
      }

      loading = null;

      gridEl.textContent = "";

      const message = document.createElement("div");

      message.className = "rfb-msg";

      message.textContent =
        "Could not load bundles: " +
        String(e.message || e);

      const retry = document.createElement("button");

      retry.className = "rfb-retry";
      retry.textContent = "Retry";

      retry.addEventListener("click", () => {
        data = null;
        loading = null;
        loadData(viewToken);
      });

      gridEl.append(message, retry);
    }
  }

  function selectPairs() {
    if (pairsSelected) return;

    pairsSelected = true;

    viewToken++;

    updateMenuSelection();

    if (mountGrid()) {
      loadData(viewToken);
    }
  }

  // Restore native Shoes when another category is selected.
  function handleNativeMenuClick(e) {
    const target = e.target instanceof Element
      ? e.target
      : e.target.parentElement;

    if (!target) return;

    if (target.closest("[data-rfb-pairs-menu]")) {
      return;
    }

    const nativeItem = target.closest(
      "#vertical-menu .menu-option, #vertical-menu .menu-secondary-option"
    );

    if (nativeItem && pairsSelected) {
      cleanup();
    }
  }

  // Only menu navigation resets Shoe Pairs.
  document.addEventListener(
    "click",
    handleNativeMenuClick,
    true
  );

  // Leaving Favorites resets extension state.
  function handleNavigation() {
    if (!isSupportedPage()) {
      cleanup();

      if (pairsMenuItem) {
        pairsMenuItem.remove();
        pairsMenuItem = null;
      }

      data = null;
      loading = null;

      return;
    }

    updateMenuSelection();
    tryInject();

    if (pairsSelected) {
      if (mountGrid() && !data && !loading) {
        loadData(viewToken);
      }
    }
  }

  window.addEventListener(
    "hashchange",
    handleNavigation
  );

  window.addEventListener(
    "popstate",
    handleNavigation
  );

  // Roblox dynamically rebuilds parts of the Favorites page.
  new MutationObserver(() => {
    clearTimeout(timer);

    timer = setTimeout(handleNavigation, 150);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  handleNavigation();
})();
