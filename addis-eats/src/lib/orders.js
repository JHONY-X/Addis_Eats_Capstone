import { findDish } from "@/app/menu/dishes";
import { createClient } from "@/lib/supabase/server";

// Helper to determine status and step from elapsed time
export function calculateOrderStatus(createdAtISO) {
  const createdTime = new Date(createdAtISO).getTime();
  const elapsedSeconds = Math.max(0, (Date.now() - createdTime) / 1000);

  if (elapsedSeconds < 10) {
    return {
      status: "confirmed",
      step: 1,
      statusTitle: "Order Confirmed",
      description: "Your order has been received and sent to the kitchen.",
      estimatedMinutes: 25,
      progressPercent: 25,
    };
  } else if (elapsedSeconds < 25) {
    return {
      status: "preparing",
      step: 2,
      statusTitle: "Preparing in Kitchen",
      description: "Our chefs in Addis Ababa are freshly preparing your dishes.",
      estimatedMinutes: 18,
      progressPercent: 50,
    };
  } else if (elapsedSeconds < 50) {
    return {
      status: "out_for_delivery",
      step: 3,
      statusTitle: "Out for Delivery",
      description: "Courier Dawit is en route with your meal on a motorbike.",
      estimatedMinutes: 6,
      progressPercent: 75,
    };
  } else {
    return {
      status: "delivered",
      step: 4,
      statusTitle: "Delivered",
      description: "Your order has been delivered! Melkam Mikib (Bon Appétit)!",
      estimatedMinutes: 0,
      progressPercent: 100,
    };
  }
}

function fromRow(row) {
  return { id: row.id, userId: row.user_id, customerName: row.customer_name, address: row.address, phone: row.phone, items: row.items || [], createdAt: row.created_at, cancelledAt: row.cancelled_at };
}

function withLiveStatus(order) {
  if (order.cancelledAt) {
    return { ...order, status: "cancelled", canCancel: false, statusStep: 0, statusTitle: "Order Cancelled", statusDescription: "This order was cancelled before courier dispatch.", estimatedMinutes: 0, progressPercent: 0, lastPolledAt: new Date().toISOString() };
  }

  const liveState = calculateOrderStatus(order.createdAt);
  return { ...order, ...liveState, canCancel: liveState.status === "confirmed" || liveState.status === "preparing", statusDescription: liveState.description, lastPolledAt: new Date().toISOString() };
}

export async function saveOrder(orderData) {
  const id = orderData.id || crypto.randomUUID();
  const createdAt = orderData.createdAt || new Date().toISOString();

  // Enrich items with dish name if not present
  const enrichedItems = (orderData.items || []).map((item) => {
    const dish = findDish(item.dishId);
    return {
      dishId: item.dishId,
      quantity: item.quantity,
      price: dish?.price ?? item.price ?? 0,
      name: item.name || dish?.name || `Dish #${item.dishId}`,
      cuisine: dish?.cuisine || "Delicious",
      caloriesPerServing: dish?.caloriesPerServing || 250,
    };
  });

  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").insert({ id, user_id: orderData.userId, customer_name: orderData.customerName, address: orderData.address, phone: orderData.phone, items: enrichedItems, created_at: createdAt }).select().single();
  if (error) throw new Error(`Could not save order: ${error.message}`);
  return withLiveStatus(fromRow(data));
}

export async function getOrder(id) {
  if (!id) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select().eq("id", id).maybeSingle();
  if (error || !data) return null;
  return withLiveStatus(fromRow(data));
}

export async function cancelOrder(id) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("cancel_order", { p_order_id: id });
  if (error) throw new Error(`Could not cancel order: ${error.message}`);
  const row = Array.isArray(data) ? data[0] : data;
  return row ? withLiveStatus(fromRow(row)) : null;
}

/**
 * Get all orders — used by the staff kitchen dashboard.
 */
export async function getAllOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select().order("created_at", { ascending: false });
  if (error) return [];
  return (data || []).map((row) => withLiveStatus(fromRow(row)));
}

/**
 * Get orders filtered by userId — used to scope the orders page query
 * so a user cannot read another account's orders.
 */
export async function getOrdersByUser(userId) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select().eq("user_id", userId).order("created_at", { ascending: false });
  if (error) return [];
  return (data || []).map((row) => withLiveStatus(fromRow(row)));
}
