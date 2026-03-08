import type { BlogPost } from "@/lib/supabase-server";

type BlogDateSource = Pick<BlogPost, "published_at" | "created_at">;

const WORDS_PER_MINUTE = 225;

export function getBlogDisplayDate(post: Partial<BlogDateSource>): string | null {
  return post.published_at || post.created_at || null;
}

export function formatBlogDate(
  date: string | null | undefined,
  locale = "en-IE",
  format: "long" | "short" = "long"
): string | null {
  if (!date) {
    return null;
  }

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    month: format === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function estimateReadingTime(content: string): number {
  const words = stripBlogContent(content)
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(3, Math.ceil(words / WORDS_PER_MINUTE));
}

export function getBlogExcerpt(
  post: Pick<BlogPost, "excerpt" | "content">,
  maxLength = 180
): string {
  const excerpt = post.excerpt?.trim();
  if (excerpt) {
    return excerpt;
  }

  const summary = stripBlogContent(post.content);
  if (summary.length <= maxLength) {
    return summary;
  }

  return `${summary.slice(0, maxLength).trimEnd()}...`;
}

function stripBlogContent(content: string): string {
  return content
    .replace(/\[(?:CHART|STAT|QUOTE|SOURCE):[^\]]+\]/g, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
