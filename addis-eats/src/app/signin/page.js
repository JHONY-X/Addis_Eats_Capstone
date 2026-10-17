import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { safeNextPath } from "@/lib/safe-next-path";
import SignInForm from "./SignInForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your Addis Eats account to place orders and track deliveries.",
};

export default async function SignInPage({ searchParams }) {
  const sp = await searchParams;
  const next = safeNextPath(sp?.next);
  const googleSignInError = sp?.error === "google";

  // If the user is already signed in, redirect to their intended destination
  const session = await getSession();
  if (session) {
    redirect(next);
  }

  return (
    <main className="signin-page">
      <div className="signin-card">
        <span className="eyebrow">Welcome Back</span>
        <h1>Sign in to Addis Eats</h1>
        <p>Enter your credentials to access your account.</p>
        <SignInForm next={next} googleSignInError={googleSignInError} />
      </div>
    </main>
  );
}
