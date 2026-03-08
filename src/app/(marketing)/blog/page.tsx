import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3 } from "lucide-react";
import { getBlogPosts } from "@/lib/content/blog";
import {
  estimateReadingTime,
  formatBlogDate,
  getBlogDisplayDate,
  getBlogExcerpt,
} from "@/lib/content/blog-presentation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import CTASection from "@/components/marketing/CTASection";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog - AI Voice Agent Insights | VoiceFleet",
  description:
    "Insights on AI voice agents, customer service automation, and scaling support operations. Learn how businesses reduce costs with VoiceFleet.",
  path: "/blog",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const posts = await getBlogPosts({ limit: 1000 });
  const [featuredPost, ...otherPosts] = posts;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#ffffff_26%,#f8fafc_100%)] text-foreground">
      <Header />

      <main className="pb-24">
        <section className="relative overflow-hidden border-b border-stone-200/80 bg-[radial-gradient(circle_at_top_left,rgba(219,234,254,0.8),transparent_36%),radial-gradient(circle_at_top_right,rgba(226,232,240,0.75),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] pt-28 pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <span className="inline-flex items-center rounded-full border border-stone-200 bg-white/85 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-stone-600 shadow-sm">
              VoiceFleet Journal
            </span>
            <h1 className="mt-6 max-w-4xl font-heading text-5xl font-extrabold tracking-[-0.04em] text-stone-950 md:text-7xl">
              Ideas, comparisons, and practical notes on AI phone operations
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600 md:text-xl">
              Editorial-style analysis on AI receptionists, missed-call economics,
              industry playbooks, and how modern teams automate phone support
              without losing quality.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pt-14">
          {posts.length === 0 ? (
            <div className="rounded-[2rem] border border-stone-200 bg-white px-8 py-16 text-center shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
              <p className="text-lg text-stone-600">
                No blog posts yet. Check back soon.
              </p>
            </div>
          ) : (
            <>
              {featuredPost && (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group block"
                  data-umami-event="blog_article_click"
                  data-umami-event-source="blog_index_featured"
                  data-umami-event-target={featuredPost.slug}
                  data-umami-event-locale="en"
                >
                  <article className="grid overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_90px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="relative min-h-[320px] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.5),transparent_32%),linear-gradient(135deg,#0f172a_0%,#1e293b_38%,#334155_100%)]">
                      {featuredPost.featured_image_url ? (
                        <Image
                          src={featuredPost.featured_image_url}
                          alt={featuredPost.featured_image_alt || featuredPost.title}
                          fill
                          priority
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 100vw, 560px"
                        />
                      ) : (
                        <div className="flex h-full items-end p-8 md:p-10">
                          <div className="max-w-sm rounded-[1.5rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
                              Featured story
                            </p>
                            <p className="mt-3 text-2xl font-semibold leading-tight text-white">
                              {featuredPost.title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-between p-8 md:p-10">
                      <div>
                        <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                          {featuredPost.category || "Insights"}
                        </span>
                        <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-[-0.03em] text-stone-950 md:text-4xl">
                          {featuredPost.title}
                        </h2>
                        <p className="mt-5 text-lg leading-8 text-stone-600">
                          {getBlogExcerpt(featuredPost, 240)}
                        </p>
                      </div>

                      <div className="mt-10 space-y-4">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
                          <span>{featuredPost.author_name}</span>
                          <span>•</span>
                          <time dateTime={getBlogDisplayDate(featuredPost) || undefined}>
                            {formatBlogDate(getBlogDisplayDate(featuredPost), "en-IE", "long") || "Draft"}
                          </time>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-4 w-4" />
                            {estimateReadingTime(featuredPost.content)} min read
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors group-hover:text-blue-800">
                          Read article
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {otherPosts.length > 0 && (
                <div className="mt-14">
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-stone-900 md:text-3xl">
                      More from the journal
                    </h2>
                    <p className="text-sm text-stone-500">
                      {posts.length} published articles
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {otherPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group block"
                        data-umami-event="blog_article_click"
                        data-umami-event-source="blog_index_grid"
                        data-umami-event-target={post.slug}
                        data-umami-event-locale="en"
                      >
                        <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
                          <div className="relative h-56 overflow-hidden bg-[linear-gradient(135deg,#dbeafe_0%,#eff6ff_35%,#f8fafc_100%)]">
                            {post.featured_image_url ? (
                              <Image
                                src={post.featured_image_url}
                                alt={post.featured_image_alt || post.title}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.65),rgba(248,250,252,0.9))]" />
                            )}
                          </div>

                          <div className="flex flex-1 flex-col p-7">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                              <span>{post.category || "Insights"}</span>
                              <span className="h-1 w-1 rounded-full bg-stone-300" />
                              <span>{estimateReadingTime(post.content)} min read</span>
                            </div>

                            <h3 className="mt-4 font-heading text-2xl font-bold tracking-[-0.03em] text-stone-950 transition-colors group-hover:text-blue-800">
                              {post.title}
                            </h3>
                            <p className="mt-4 flex-1 text-base leading-7 text-stone-600">
                              {getBlogExcerpt(post, 180)}
                            </p>

                            <div className="mt-6 flex items-center justify-between gap-4 border-t border-stone-100 pt-5 text-sm text-stone-500">
                              <span>{post.author_name}</span>
                              <time dateTime={getBlogDisplayDate(post) || undefined}>
                                {formatBlogDate(getBlogDisplayDate(post), "en-IE", "short") || "Draft"}
                              </time>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <CTASection
        title="Ready to Scale Your Support?"
        description="See how VoiceFleet AI voice agents can handle your calls at 80% lower cost."
      />

      <Footer />
    </div>
  );
}
