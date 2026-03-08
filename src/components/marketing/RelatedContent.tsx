import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3 } from "lucide-react";
import { getRelatedPosts } from "@/lib/content/blog";
import BlogImpressionTracker from "@/components/blog/BlogImpressionTracker";
import {
  estimateReadingTime,
  formatBlogDate,
  getBlogDisplayDate,
  getBlogExcerpt,
} from "@/lib/content/blog-presentation";

interface RelatedContentProps {
  category?: string | null;
  currentSlug: string;
  tags?: string[] | null;
  locale?: "en" | "es";
}

export default async function RelatedContent({
  category,
  currentSlug,
  tags,
  locale = "en",
}: RelatedContentProps) {
  const posts = await getRelatedPosts(currentSlug, category, tags);

  if (!posts.length) {
    return null;
  }

  return (
    <section className="mt-14 border-t border-stone-200/80 pt-10">
      <BlogImpressionTracker
        eventName="blog_section_viewed"
        eventData={{ section: "related_articles", post_slug: currentSlug, locale }}
      />
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
            Continue reading
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.03em] text-stone-950">
            Related articles
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block"
            data-umami-event="blog_article_click"
            data-umami-event-source="related_articles"
            data-umami-event-origin={currentSlug}
            data-umami-event-target={post.slug}
            data-umami-event-locale={locale}
          >
            <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-stone-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.09)]">
              <div className="relative h-44 overflow-hidden bg-[linear-gradient(135deg,#dbeafe_0%,#eff6ff_35%,#f8fafc_100%)]">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.65),rgba(248,250,252,0.9))]" />
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  <span>{post.category || "Insights"}</span>
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {estimateReadingTime(post.content)} min
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-xl font-bold tracking-[-0.03em] text-stone-950 transition-colors group-hover:text-blue-800">
                  {post.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-stone-600">
                  {getBlogExcerpt(post, 135)}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-stone-100 pt-4 text-sm text-stone-500">
                  <time dateTime={getBlogDisplayDate(post) || undefined}>
                    {formatBlogDate(getBlogDisplayDate(post), "en-IE", "short") || "Draft"}
                  </time>
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-700 transition-colors group-hover:text-blue-800">
                    Read
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
