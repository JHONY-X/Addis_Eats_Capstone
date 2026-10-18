import { cancelOrder, getOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;

  // Ownership check: ensure the requesting user owns this order (or is staff)
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const order = await getOrder(id);

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  // Only the order's owner or staff can read the order
  if (order.userId && order.userId !== session.id && session.role !== "staff") {
    return Response.json({ error: "You do not have permission to view this order." }, { status: 403 });
  }

  return Response.json({ order });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const order = await getOrder(id);
  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.userId !== session.id) {
    return Response.json({ error: "Only the customer who placed this order can cancel it." }, { status: 403 });
  }

  const cancelledOrder = await cancelOrder(id);
  if (!cancelledOrder) {
    return Response.json({ error: "Orders can only be cancelled before courier dispatch." }, { status: 409 });
  }

  return Response.json({ order: cancelledOrder });
}
