"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setMessage(""); setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const result = await response.json();
      if (!response.ok) setError(result.details ? `${result.error} (${result.details})` : result.error || "Could not send the reset email.");
      else setMessage("If an account exists for that email, a password reset link is on its way.");
    } catch { setError("Could not connect to the server. Please try again."); }
    finally { setIsSubmitting(false); }
  }
  return <form className="signin-form" onSubmit={handleSubmit}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>{error && <p className="field-error">{error}</p>}{message && <p className="form-success">{message}</p>}<button className="add-to-cart" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send reset link"}</button></form>;
}
