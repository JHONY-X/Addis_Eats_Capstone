"use client";

import { useState } from "react";

export default function SignInForm({ next, googleSignInError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    googleSignInError ? "Google sign-in could not be completed. Please try again." : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Invalid credentials.");
        return;
      }

      // Redirect to the intended destination after successful sign-in
      window.location.href = next;
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="signin-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            id="signin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="field-error">{error}</p>}
        <button id="signin-submit" className="add-to-cart" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <div className="signin-divider"><span>or</span></div>
      <a
        className="google-signin-button"
        href={`/api/auth/google?next=${encodeURIComponent(next)}`}
      >
        <span className="google-signin-mark" aria-hidden="true">G</span>
        Continue with Google
      </a>
    </>
  );
}
