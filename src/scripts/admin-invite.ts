import { authClient } from "../lib/auth-client";

const form = document.getElementById("invite-form") as HTMLFormElement | null;
const errorEl = document.getElementById("invite-error");
const successEl = document.getElementById("invite-success");

if (!form) {
  console.error("Admin invite form not found.");
} else {
  const messages = {
    success: form.dataset.success || "Invite sent.",
    failed: form.dataset.failed || "Invite failed.",
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
    const email = String(formData.get("email") || "");

    const { error } = await authClient.inviteUser({ email });

    if (error) {
      if (errorEl) {
        errorEl.textContent = error.message || messages.failed;
      }
      return;
    }

    if (successEl) {
      successEl.textContent = messages.success;
    }
    form.reset();
  });
}
