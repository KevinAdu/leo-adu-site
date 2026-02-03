import { appInviteClient } from "@better-auth-kit/app-invite/client";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  plugins: [appInviteClient()],
});
