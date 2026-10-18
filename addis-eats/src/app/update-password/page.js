import Link from "next/link";
import UpdatePasswordForm from "./UpdatePasswordForm";

export const metadata = { title: "Choose a new password" };

export default function UpdatePasswordPage() {
  return <main className="signin-page"><div className="signin-card"><span className="eyebrow">Account recovery</span><h1>Choose a new password</h1><p>Use at least 8 characters for your new password.</p><UpdatePasswordForm /><p className="signin-help"><Link href="/signin">Back to sign in</Link></p></div></main>;
}
