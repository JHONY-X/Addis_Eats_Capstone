import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import type { Session } from '@/lib/session';
import type { Order } from '@/lib/orders';

/**
 * Ensure a user session exists. If not, redirect to the supplied path.
 * Returns the resolved session for further checks.
 */
export async function requireSession(redirectTo: string = '/'): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(redirectTo);
  // `redirect` never returns, so the line below is type‑safe.
  return session as Session;
}

/**
 * Verify that the current session is allowed to view the given order.
 * If the user is neither the owner nor staff, a redirect to `/` occurs.
 */
export function requireOrderAccess(order: Order, session: Session): void {
  if (order.userId && order.userId !== session.id && session.role !== 'staff') {
    redirect('/');
  }
}
