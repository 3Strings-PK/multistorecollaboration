import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Handles the OAuth callback and token exchange flow
  await authenticate.admin(request);
  return null;
};