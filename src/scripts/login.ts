import { authClient } from "../lib/auth-client";

const form = document.getElementById("login-form") as HTMLFormElement | null;
const errorEl = document.getElementById("login-error");

if (!form) {
  console.error("Login form not found.");
} else {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (errorEl) {
      errorEl.textContent = "";
    }

    const formData = new FormData(form);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      if (errorEl) {
        errorEl.textContent = error.message || "Sign-in failed.";
      }
      return;
    }

    if (data && data.url) {
      window.location.href = data.url;
      return;
    }

    window.location.href = "/";
  });
}
