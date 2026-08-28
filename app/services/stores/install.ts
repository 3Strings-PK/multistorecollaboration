import prisma from "~/db.server";
import type { Session } from "@shopify/shopify-app-react-router";

export async function registerOrReactivateStore(session: Session) {
  const shopDomain = session.shop;
  
  // Fetch shop details from Shopify to populate the Store record
  // (In a real scenario, you'd use the GraphQL client here to fetch Shop { name, email, currency, timezone })
  // For now, we mock the shop details based on the session.
  const shopDetails = {
    shopifyShopId: session.shop.replace(".myshopify.com", ""),
    shopName: shopDomain.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    shopOwnerName: "Store Owner",
    shopOwnerEmail: `owner@${shopDomain}`,
    currency: "USD",
    timezone: "America/New_York"
  };

  await prisma.store.upsert({
    where: { shopDomain },
    update: {
      status: "ACTIVE",
      installationStatus: "INSTALLED",
      lastSeenAt: new Date(),
      // Update shop details if they changed
      shopName: shopDetails.shopName,
      shopOwnerEmail: shopDetails.shopOwnerEmail,
    },
    create: {
      shopifyShopId: shopDetails.shopifyShopId,
      shopDomain,
      shopName: shopDetails.shopName,
      shopOwnerName: shopDetails.shopOwnerName,
      shopOwnerEmail: shopDetails.shopOwnerEmail,
      currency: shopDetails.currency,
      timezone: shopDetails.timezone,
      status: "ACTIVE",
      installationStatus: "INSTALLED",
      lastSeenAt: new Date(),
    },
  });
}