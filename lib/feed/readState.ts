"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Anyone can call a server action, so check the input first.
const itemSchema = z.object({ itemId: z.uuid(), isRead: z.boolean() });

// Mark one article read (true) or unread (false) for the signed-in user.
export async function setItemRead(itemId: string, isRead: boolean) {
  const input = itemSchema.safeParse({ itemId, isRead });
  if (!input.success) return { error: "Invalid item." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out." };

  // One row per (user, article): add it, or update it if it's already there.
  const { error } = await supabase.from("user_item_state").upsert(
    {
      user_id: user.id,
      item_id: input.data.itemId,
      is_read: input.data.isRead,
      read_at: input.data.isRead ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,item_id" },
  );

  if (error) {
    console.error("setItemRead failed:", error);
    return { error: "Couldn't save. Try again." };
  }

  // Redraw the page with what's now in the database.
  refresh();
  return { error: null };
}

// Which items "mark all read" covers. Leave empty for everything.
export type ReadScope = { feedId?: string; categoryId?: string };

const scopeSchema = z.object({
  feedId: z.uuid().optional(),
  categoryId: z.uuid().optional(),
});

// Mark many items read in one go (runs the mark_all_read SQL function).
export async function markAllRead(scope: ReadScope = {}) {
  const input = scopeSchema.safeParse(scope);
  if (!input.success) return { error: "Invalid scope." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You're signed out." };

  const { error } = await supabase.rpc("mark_all_read", {
    p_feed_id: input.data.feedId ?? null,
    p_category_id: input.data.categoryId ?? null,
  });

  if (error) {
    console.error("markAllRead failed:", error);
    return { error: "Couldn't mark all as read. Try again." };
  }

  refresh();
  return { error: null };
}
