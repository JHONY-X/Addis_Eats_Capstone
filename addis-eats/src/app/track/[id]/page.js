import Link from "next/link";
import { getOrder } from "@/lib/orders";
import { requireSession, requireOrderAccess } from "@/lib/auth-guard";
import TrackingClient from "./TrackingClient";

export const dynamic = "force-dynamic";

export default async function TrackOrderPage({ params }) {
  const { id } = await params;
  const session = await requireSession(`/signin?next=/track/${id}`);
  const order = getOrder(id);

  // On serverless platforms the in-memory order store can be empty after a cold
  // start. Instead of a hard 404, show a friendly "order expired" message.
  if (!order) {
    return (
      <main className="track-page-wrapper">
        <div className="tracking-page">
          <div className="tracking-heading">
            <div>
              <p className="eyebrow">Order not found</p>
              <h1>Track order #{id.slice(0, 8)}</h1>
              <p>
                This order could not be found. It may have expired from our
                real-time tracking system after the server restarted.
              </p>
            </div>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/menu" className="button">
              Browse the menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  requireOrderAccess(order, session);
  return <main className="track-page-wrapper"><TrackingClient order={order} orderId={id} /></main>;
}
