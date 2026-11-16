
async function getJSON(url) {
  const r = await fetch(url, { credentials: "include" });

  if (!r.ok) {
    throw new Error(url + " -> " + r.status);
  }

  return r.json();
}

async function loadFavoriteBundles() {
  const me = await getJSON(
    "https://users.roblox.com/v1/users/authenticated"
  );

  const seen = new Map();
  const errors = [];

  for (const subtype of [1, 2, 3, 4, 5]) {
    let cursor = null;

    do {
      let url =
        `https://catalog.roblox.com/v1/favorites/users/${me.id}/favorites/${subtype}/bundles?limit=30`;

      if (cursor) {
        url += "&cursor=" + encodeURIComponent(cursor);
      }

      let result;

      try {
        result = await getJSON(url);
      } catch (e) {
        errors.push({
          subtype,
          cursor,
          message: String(e.message || e)
        });

        break;
      }

      for (const b of result.favorites || []) {
        seen.set(b.id, {
          id: b.id,
          name: b.name,
          type: b.bundleType || "Other",
          creator: b.creator ? b.creator.name : "",
          price: b.product ? b.product.priceInRobux : null,
          forSale: b.product ? b.product.isForSale : false,
          thumb: null
        });
      }

      cursor = result.moreFavorites
        ? result.nextCursor
        : null;

    } while (cursor);
  }

  const all = [...seen.values()];

  // Retrieve thumbnails in batches of 50.
  for (let i = 0; i < all.length; i += 50) {
    const batch = all.slice(i, i + 50);

    try {
      const thumbnails = await getJSON(
        "https://thumbnails.roblox.com/v1/bundles/thumbnails?size=150x150&format=Png&bundleIds=" +
        batch.map(b => b.id).join(",")
      );

      for (const item of thumbnails.data || []) {
        const bundle = batch.find(
          b => b.id === item.targetId
        );

        if (bundle && item.imageUrl) {
          bundle.thumb = item.imageUrl;
        }
      }
    } catch (e) {
      // Thumbnail failures do not invalidate bundle results.
    }
  }

  return {
    items: all,
    errors
  };
}

browser.runtime.onMessage.addListener(msg => {
  if (msg && msg.type === "getFavoriteBundles") {
    return loadFavoriteBundles();
  }
});
