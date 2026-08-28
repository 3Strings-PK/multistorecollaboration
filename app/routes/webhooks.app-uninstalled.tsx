import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, payload } = await authenticate.webhook(request);

  if (topic !== "APP_UNINSTALLED") {
    return new Response("Unhandled topic", { status: 404 });
  }

  if (session) {
    // Mark the store as uninstalled and invalidate tokens
    await prisma.store.update({
      where: { shopDomain: shop },
      data: {
        status: "UNINSTALLED",
        installationStatus: "UNINSTALLED",
      },
    });

    // Delete the session to invalidate the access token immediately
    await prisma.session.delete({
      where: { id: session.id },
    }).catch(() => {
      // Session might already be deleted by the framework, ignore
    });
  }

  return new Response();
};