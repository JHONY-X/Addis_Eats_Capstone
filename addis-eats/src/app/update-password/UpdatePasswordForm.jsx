"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState(""); const [confirmation, setConfirmation] = useState(""); const [error, setError] = useState(""); const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault(); setError("");
    if (password !== confirmation) { setError("Passwords do not match."); return; }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/update-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) setError(result.error || "Could not update your password."); else router.push("/signin?reset=success");
    } catch { setError("Could not connect to the server. Please try again."); }
    finally { setIsSubmitting(false); }
  }
  return <form className="signin-form" onSubmit={handleSubmit}><label>New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required /></label><label>Confirm new password<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" minLength={8} required /></label>{error && <p className="field-error">{error}</p>}<button className="add-to-cart" type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating…" : "Update password"}</button></form>;
}
