import { notFound } from "next/navigation";
import { getOrder } from "@/lib/orders";
import { requireSession, requireOrderAccess } from "@/lib/auth-guard";
import TrackingClient from "./TrackingClient";

export const dynamic = "force-dynamic";

export default async function TrackOrderPage({ params }) {
  const { id } = await params;
  const session = await requireSession(`/signin?next=/track/${id}`);
  const order = getOrder(id);
  if (!order) notFound();
  requireOrderAccess(order, session);
  return <main className="track-page-wrapper"><TrackingClient order={order} orderId={id} /></main>;
}
