import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return <main className="signin-page"><div className="signin-card"><span className="eyebrow">Account recovery</span><h1>Reset your password</h1><p>Enter your email and we’ll send you a secure reset link.</p><ForgotPasswordForm /><p className="signin-help"><Link href="/signin">Back to sign in</Link></p></div></main>;
}
