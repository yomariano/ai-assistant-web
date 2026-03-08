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
import { generateBlogMetadata } from "@/lib/seo/metadata";
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo";
import { BLOG_FAQS } from "@/lib/marketing/faqs";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import RelatedContent from "@/components/marketing/RelatedContent";
import CTASection from "@/components/marketing/CTASection";
import { RichBlogContent } from "@/components/content";
import BlogDemoEmbed from "@/components/blog/BlogDemoEmbed";
import PricingSection from "@/components/voicefleet/PricingSection";
import { getDirectoryFromCategoryOrTags } from "@/lib/directory/verticals";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {};
  }

  return generateBlogMetadata(post);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${slug}` },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";
  const displayDate = getBlogDisplayDate(post);
  const formattedDate = formatBlogDate(displayDate, "en-IE", "long") || "Draft";
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
        url={`${siteUrl}/blog/${slug}`}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema items={[...BLOG_FAQS]} />

      <div className="min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#ffffff_28%,#f8fafc_100%)]">
        <Header />

        <main>
          <section className="relative overflow-hidden border-b border-stone-200/80 bg-[radial-gradient(circle_at_top_left,rgba(219,234,254,0.8),transparent_32%),radial-gradient(circle_at_top_right,rgba(226,232,240,0.72),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] pt-28 pb-14">
            <div className="mx-auto max-w-6xl px-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
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

          <section className="mx-auto max-w-6xl px-6 py-12">
            <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
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
                      href={`/directory/${vertical.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
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

                <article className="rounded-[2rem] border border-stone-200/80 bg-white px-6 py-8 shadow-[0_28px_70px_rgba(15,23,42,0.07)] md:px-10 md:py-12 lg:px-14">
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

                <div className="mt-8 rounded-[1.75rem] border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.95),rgba(248,250,252,0.95))] p-8 shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
                  <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-stone-950">
                    Hear the product behind the article
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
                    Try the live AI demo below, pick an industry, and hear how a
                    VoiceFleet receptionist handles real inbound calls.
                  </p>
                </div>

                {vertical && (
                  <div className="mt-8 rounded-[1.75rem] border border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(248,250,252,0.96))] p-7 shadow-[0_18px_45px_rgba(16,185,129,0.08)]">
                    <Link
                      href={`/directory/${vertical.slug}`}
                      className="flex items-center justify-between gap-4 group"
                    >
                      <div>
                        <p className="font-heading text-xl font-bold tracking-[-0.02em] text-stone-950">
                          Browse {vertical.label} in our directory
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          Explore businesses using AI receptionists across this
                          vertical.
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
                />
              </div>
            </div>
          </section>

          <section className="border-t border-stone-200/80 bg-white [&>div]:min-h-0">
            <BlogDemoEmbed />
          </section>

          <PricingSection />

          <CTASection
            title="Ready to Scale Your Support?"
            description="See how VoiceFleet AI voice agents can handle your calls at 80% lower cost."
          />
        </main>

        <Footer />
      </div>
    </>
  );
}
