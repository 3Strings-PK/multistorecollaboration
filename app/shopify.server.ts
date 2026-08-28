import "@shopify/shopify-app-react-router/server";
import { ApiVersion, shopifyApp } from "@shopify/shopify-app-react-router";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

// Note: ApiVersion.July26 assumes the SDK has been updated for the 2026-07 release. 
// If the SDK enum lags, use the string literal "2026-07" if the type permits, or ApiVersion.Unstable.
const API_VERSION = "2026-07" as any; 

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  apiVersion: API_VERSION,
  scopes: process.env.SCOPES?.split(",") || ["read_products", "write_products"],
  appUrl: process.env.HOST!,
  isEmbeddedApp: true,
  sessionStorage: new PrismaSessionStorage(prisma),
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks/app-uninstalled",
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      // Register webhooks declaratively defined in shopify.app.toml
      shopify.registerWebhooks({ session });
    },
  },
  future: {
    unstable_tokenExchange: true, // Enable token exchange for embedded apps
  },
});

export default shopify;
export const authenticate = shopify.authenticate;
export const registerWebhooks = shopify.registerWebhooks;
export const ensureInstalledOnShop = shopify.ensureInstalledOnShop;