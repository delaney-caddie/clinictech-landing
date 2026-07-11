// Publish endpoint for the Caddie AI app's Blog agent.
//
// The app POSTs a finished post here with a shared bearer secret. We upsert it
// into Supabase (`blog_posts`, keyed by slug) and revalidate the blog routes so
// the new post appears without a redeploy.
//
// Auth: Authorization: Bearer ${BLOG_PUBLISH_SECRET}
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createHash, timingSafeEqual } from "crypto";
import { z } from "zod";

export const runtime = "nodejs";

const PostSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  excerpt: z.string().min(1).max(600),
  content: z.string().min(1), // HTML
  category: z.string().min(1).max(80).default("Insights"),
  author: z.string().min(1).max(120).default("Caddie AI Team"),
  readTime: z.string().min(1).max(40).default("5 min read"),
  image: z.string().url().optional(),
  published: z.boolean().default(true),
});

function authorized(req: NextRequest): boolean {
  const secret = process.env.BLOG_PUBLISH_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return false;
  const provided = createHash("sha256").update(header.slice(7)).digest();
  const expected = createHash("sha256").update(secret).digest();
  return timingSafeEqual(provided, expected);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const post = parsed.data;

  const supabase = createClient(url, key);
  const { error } = await supabase.from("blog_posts").upsert(
    {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      read_time: post.readTime,
      image: post.image ?? null,
      published: post.published,
      published_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );

  if (error) {
    console.error("[blog/publish] upsert failed", error);
    return NextResponse.json({ error: "Database write failed" }, { status: 500 });
  }

  // Refresh the list and the post page so the new content is live immediately.
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return NextResponse.json({
    ok: true,
    slug: post.slug,
    url: `/blog/${post.slug}`,
  });
}
