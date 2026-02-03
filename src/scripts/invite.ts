import { authClient } from "../lib/auth-client";

const form = document.getElementById("invite-form") as HTMLFormElement | null;
const errorEl = document.getElementById("invite-error");
const successEl = document.getElementById("invite-success");

if (!form) {
  console.error("Invite form not found.");
} else {
  const messages = {
    missingId: form.dataset.missingId || "Missing invitation id.",
    passwordMismatch: form.dataset.passwordMismatch || "Passwords do not match.",
    failed: form.dataset.failed || "Invite acceptance failed.",
    success: form.dataset.success || "Invite accepted.",
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (errorEl) {
      errorEl.textContent = "";
    }
    if (successEl) {
      successEl.textContent = "";
    }

    const formData = new FormData(form);
    const invitationId = form.dataset.invitationId;
    const firstName = String(formData.get("firstName") || "");
    const lastName = String(formData.get("lastName") || "");
    const email = String(formData.get("email") || "");
    const language = String(formData.get("language") || "en");
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!invitationId) {
      if (errorEl) {
        errorEl.textContent = messages.missingId;
      }
      return;
    }

    if (password !== confirmPassword) {
      if (errorEl) {
        errorEl.textContent = messages.passwordMismatch;
      }
      return;
    }

    const { error } = await authClient.acceptInvitation({
      invitationId,
      name: `${firstName} ${lastName}`.trim() || undefined,
      email: email || undefined,
      password,
      firstName,
      lastName,
      language,
    });

    if (error) {
      if (errorEl) {
        errorEl.textContent = error.message || messages.failed;
      }
      return;
    }

    const profileResponse = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, language }),
    });

    if (!profileResponse.ok && profileResponse.status === 401) {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
    }

    if (successEl) {
      successEl.textContent = messages.success;
    }
    window.location.href = "/";
  });
}
