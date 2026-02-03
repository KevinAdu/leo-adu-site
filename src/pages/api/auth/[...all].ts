import type { APIRoute } from "astro";
import { auth } from "../../../auth";

export const ALL: APIRoute = async (context) => {
  return auth.handler(context.request);
};
