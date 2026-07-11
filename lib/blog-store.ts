// Blog content source.
//
// Posts now live in Supabase (table `blog_posts`), written by the Caddie AI
// app's Blog agent via /api/blog/publish. The 10 original posts in
// `blog-data.ts` are kept as a seed/fallback so the site still renders if
// Supabase is unconfigured (local dev) or the query fails. Database rows win
// over seed posts on a slug collision.

import { createClient } from "@supabase/supabase-js";
import { blogPosts as seedPosts, type BlogPost } from "./blog-data";

export type { BlogPost };

interface BlogRow {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string | null;
  category: string | null;
  read_time: string | null;
  image: string | null;
  published_at: string;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function rowToPost(row: BlogRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author || "Caddie AI Team",
    category: row.category || "Insights",
    readTime: row.read_time || "5 min read",
    date: formatDate(row.published_at),
    image: row.image || undefined,
  };
}

// Pull published posts from Supabase. Returns [] on any failure (missing env,
// missing table, network) so the caller falls back to seed content.
async function fetchDbPosts(): Promise<BlogPost[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, content, author, category, read_time, image, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return (data as BlogRow[]).map(rowToPost);
  } catch {
    return [];
  }
}

function byDateDesc(a: BlogPost, b: BlogPost): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const dbPosts = await fetchDbPosts();
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  // DB rows take precedence; seed posts fill in anything not yet migrated.
  const merged = [...dbPosts, ...seedPosts.filter((p) => !dbSlugs.has(p.slug))];
  return merged.sort(byDateDesc);
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const dbPosts = await fetchDbPosts();
  return dbPosts.find((p) => p.slug === slug) ?? seedPosts.find((p) => p.slug === slug);
}
