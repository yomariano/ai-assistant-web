import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock3, Tag } from "lucide-react";
import { getBlogPost, getBlogPostSlugs } from "@/lib/content/blog";
import {
  estimateReadingTime,
  formatBlogDate,
  getBlogDisplayDate,
  getBlogExcerpt,
} from "@/lib/content/blog-presentation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo";
import { BLOG_FAQS } from "@/lib/marketing/faqs";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import RelatedContent from "@/components/marketing/RelatedContent";
import CTASection from "@/components/marketing/CTASection";
import { RichBlogContent } from "@/components/content";
import BlogImpressionTracker from "@/components/blog/BlogImpressionTracker";
import BlogDemoEmbed from "@/components/blog/BlogDemoEmbed";
import { getDirectoryFromCategoryOrTags } from "@/lib/directory/verticals";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs("en");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug, { language: "en" });

  if (!post) {
    return {};
  }

  return generatePageMetadata({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || "",
    path: `/au/blog/${post.slug}`,
    ogImage: post.og_image_url || post.featured_image_url || undefined,
    type: "article",
    publishedTime: post.published_at || undefined,
    modifiedTime: post.updated_at,
    author: post.author_name,
    keywords: post.tags ?? undefined,
  });
}

export default async function AustraliaBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug, { language: "en" });

  if (!post) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", href: "/au" },
    { name: "Blog", href: "/au/blog" },
    { name: post.title, href: `/au/blog/${slug}` },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";
  const displayDate = getBlogDisplayDate(post);
  const formattedDate = formatBlogDate(displayDate, "en-AU", "long") || "Draft";
  const readTime = estimateReadingTime(post.content);
  const description = getBlogExcerpt(post, 240);
  const vertical = getDirectoryFromCategoryOrTags(post.category, post.tags);

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt || description}
        image={post.featured_image_url || `${siteUrl}/opengraph-image`}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        author={post.author_name}
        url={`${siteUrl}/au/blog/${slug}`}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={[...BLOG_FAQS]} />

      <div className="min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#ffffff_28%,#f8fafc_100%)]">
        <Header />

        <main>
          <section className="relative overflow-hidden border-b border-stone-200/80 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(226,232,240,0.72),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] pt-28 pb-14">
            <div className="mx-auto max-w-[1360px] px-6">
              <Link
                href="/au/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
                data-umami-event="blog_navigation_click"
                data-umami-event-location="au_post_hero_back"
                data-umami-event-post={slug}
                data-umami-event-locale="en-AU"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              <div className="mt-8 max-w-4xl">
                <span className="inline-flex rounded-full border border-stone-200 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 shadow-sm">
                  {post.category || "Article"}
                </span>

                <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-[-0.05em] text-stone-950 md:text-6xl">
                  {post.title}
                </h1>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-600 md:text-xl">
                  {description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-stone-500">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white shadow-sm">
                      {post.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{post.author_name}</p>
                      <p className="text-stone-500">VoiceFleet editorial</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1360px] px-6 pt-8">
            <div className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.07)]">
              <BlogImpressionTracker
                eventName="blog_section_viewed"
                eventData={{ section: "product_preview", post_slug: slug, locale: "en-AU" }}
              />
              <div className="border-b border-stone-200/80 bg-[linear-gradient(135deg,rgba(254,243,199,0.65),rgba(248,250,252,0.96))] px-6 py-8 md:px-10 lg:px-14 xl:px-16">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                  Product Preview
                </p>
                <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <h2 className="font-heading text-3xl font-bold tracking-[-0.03em] text-stone-950">
                      See how VoiceFleet works before you read the rest
                    </h2>
                    <p className="mt-3 text-base leading-7 text-stone-600">
                      Hear the AI flow, see the live product, and then keep reading with the Australian rollout context already in mind.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/au#demo"
                      className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
                      data-umami-event="blog_cta_click"
                      data-umami-event-location="au_product_preview"
                      data-umami-event-label="try_live_demo"
                      data-umami-event-post={slug}
                      data-umami-event-locale="en-AU"
                    >
                      Try Live Demo
                    </Link>
                    <a
                      href="https://calendly.com/voicefleet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50"
                      data-umami-event="blog_cta_click"
                      data-umami-event-location="au_product_preview"
                      data-umami-event-label="book_guided_demo"
                      data-umami-event-post={slug}
                      data-umami-event-locale="en-AU"
                    >
                      Book a Guided Demo
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[linear-gradient(180deg,rgba(248,250,252,0.88),rgba(255,255,255,0.98))]">
                <BlogDemoEmbed
                  embedded
                  trackingData={{ surface: "au_blog_post_preview", post_slug: slug, locale: "en-AU" }}
                />
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1360px] px-6 py-12">
            <div className="grid gap-8 xl:gap-10 lg:grid-cols-[190px_minmax(0,1fr)]">
              <aside className="h-fit lg:sticky lg:top-24">
                <div className="rounded-[1.5rem] border border-stone-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Reading notes
                  </p>
                  <dl className="mt-5 space-y-4 text-sm">
                    <div>
                      <dt className="text-stone-500">Published</dt>
                      <dd className="mt-1 font-semibold text-stone-900">{formattedDate}</dd>
                    </div>
                    <div>
                      <dt className="text-stone-500">Read time</dt>
                      <dd className="mt-1 font-semibold text-stone-900">{readTime} min</dd>
                    </div>
                    <div>
                      <dt className="text-stone-500">Category</dt>
                      <dd className="mt-1 font-semibold text-stone-900">{post.category || "Article"}</dd>
                    </div>
                  </dl>

                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-6 border-t border-stone-100 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                        Tags
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {vertical && (
                    <Link
                      href={`/au/directory/${vertical.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
                      data-umami-event="blog_directory_click"
                      data-umami-event-location="au_reading_notes"
                      data-umami-event-post={slug}
                      data-umami-event-locale="en-AU"
                      data-umami-event-target={vertical.slug}
                    >
                      Browse {vertical.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </aside>

              <div className="min-w-0">
                {post.featured_image_url && (
                  <div className="relative mb-8 aspect-[16/8.8] overflow-hidden rounded-[2rem] border border-stone-200/80 bg-stone-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                    <Image
                      src={post.featured_image_url}
                      alt={post.featured_image_alt || post.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 900px"
                    />
                  </div>
                )}

                <article className="rounded-[2rem] border border-stone-200/80 bg-white px-6 py-8 shadow-[0_28px_70px_rgba(15,23,42,0.07)] md:px-10 md:py-12 lg:px-14 xl:px-16">
                  <RichBlogContent
                    post={{
                      id: post.id,
                      title: post.title,
                      slug: post.slug,
                      content: post.content,
                      excerpt: post.excerpt || undefined,
                      category: post.category || undefined,
                      tags: post.tags || undefined,
                      author_name: post.author_name,
                      published_at: post.published_at || undefined,
                      chart_data: post.chart_data,
                      statistics: post.statistics,
                      sources: post.sources,
                      expert_quotes: post.expert_quotes,
                    }}
                    locale="en"
                  />

                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-12 border-t border-stone-200 pt-8">
                      <div className="mb-4 flex items-center gap-2 text-stone-700">
                        <Tag className="h-5 w-5" />
                        <span className="font-semibold">Tagged</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>

                {vertical && (
                  <div className="mt-8 rounded-[1.75rem] border border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(248,250,252,0.96))] p-7 shadow-[0_18px_45px_rgba(16,185,129,0.08)]">
                    <Link
                      href={`/au/directory/${vertical.slug}`}
                      className="flex items-center justify-between gap-4 group"
                      data-umami-event="blog_directory_click"
                      data-umami-event-location="au_post_footer"
                      data-umami-event-post={slug}
                      data-umami-event-locale="en-AU"
                      data-umami-event-target={vertical.slug}
                    >
                      <div>
                        <p className="font-heading text-xl font-bold tracking-[-0.02em] text-stone-950">
                          Browse {vertical.label} in our Australia directory
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          Explore Australian businesses using AI receptionists across this vertical.
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-emerald-700 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}

                <RelatedContent
                  category={post.category}
                  currentSlug={slug}
                  tags={post.tags}
                  locale="en"
                  articleHrefPrefix="/au/blog"
                />
              </div>
            </div>
          </section>

          <CTASection
            title="Ready to automate your Australian call flow?"
            description="Start with AU pricing, local number provisioning, and a guided setup path."
            primaryButtonText="Start Free Trial"
            primaryButtonHref="/register?region=AU"
            secondaryButtonText="See AU Pricing"
            secondaryButtonHref="/au#pricing"
          />
        </main>

        <Footer />
      </div>
    </>
  );
}
