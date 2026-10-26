import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getFeedItems } from "@/components/dashboard/feed/getFeedItems";

export async function GET(request: Request) {
  const param = new URL(request.url).searchParams.get("sort");
  const sort = param === "oldest" ? "oldest" : "newest";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await getFeedItems(supabase, user.id, sort);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 500 },
    );
  }
}
