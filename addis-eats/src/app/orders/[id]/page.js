import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrder } from "@/lib/orders";
import { requireSession, requireOrderAccess } from "@/lib/auth-guard";
import OrderTracker from "./OrderTracker";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Order #${id.slice(0, 8)} Status · Addis Eats`,
    description: `Real-time order progress tracking for Addis Eats order ${id}`,
  };
}

// Server Component that seeds the initial order data into the client polling component.
// Passing initialOrder as fallbackData ensures NO spinner appears on first paint!
export default async function OrderStatusPage({ params }) {
  const { id } = await params;

  // Ownership check: must be signed in, and must own the order (or be staff)
  const session = await requireSession(`/signin?next=/orders/${id}`);

  const initialOrder = getOrder(id);

  // On serverless platforms the in-memory order store can be empty after a cold
  // start. Instead of a hard 404, show a friendly "order expired" message so the
  // user knows what happened and can navigate back to the menu.
  if (!initialOrder) {
    return (
      <main className="order-page-wrapper">
        <div className="order-tracker-view">
          <div className="order-header-card">
            <div className="order-header-meta">
              <span className="eyebrow">Order not found</span>
              <h1 className="order-title">Order #{id.slice(0, 8)}</h1>
              <p className="order-timestamp">
                This order could not be found. It may have expired from our
                real-time tracking system after the server restarted.
              </p>
            </div>
          </div>
          <div className="order-actions">
            <Link href="/menu" className="button">
              Browse the menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Only the order's owner or staff can view the order page
  requireOrderAccess(initialOrder, session);

  return (
    <main className="order-page-wrapper">
      <OrderTracker initialOrder={initialOrder} orderId={id} />
    </main>
  );
}

