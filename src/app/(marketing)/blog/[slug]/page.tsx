import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPostSlugs } from "@/lib/content/blog";
import { generateBlogMetadata } from "@/lib/seo/metadata";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo";
import Header from "@/components/voicefleet/Header";
import Footer from "@/components/voicefleet/Footer";
import AuthorCard from "@/components/marketing/AuthorCard";
import RelatedContent from "@/components/marketing/RelatedContent";
import CTASection from "@/components/marketing/CTASection";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt || ""}
        image={post.featured_image_url || `${siteUrl}/og-image.jpg`}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        author={post.author_name}
        url={`${siteUrl}/blog/${slug}`}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>

            {post.category && (
              <span className="inline-block px-4 py-1.5 text-sm font-semibold text-white bg-white/20 backdrop-blur rounded-full mb-6">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 text-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{post.author_name}</p>
                  <p className="text-sm text-indigo-200">Author</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-IE", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Draft"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">5 min read</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-6 py-12">
          {post.featured_image_url && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 bg-muted shadow-xl -mt-20">
              <Image
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          )}

          {/* Styled Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-10 prose-headings:mb-4
              prose-h2:text-2xl prose-h2:border-b prose-h2:border-border prose-h2:pb-3
              prose-h3:text-xl prose-h3:text-primary
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-bold
              prose-ul:my-6 prose-ul:space-y-2
              prose-li:text-muted-foreground prose-li:leading-relaxed
              prose-table:my-8 prose-table:w-full prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden
              prose-th:bg-primary prose-th:text-primary-foreground prose-th:font-semibold prose-th:text-left prose-th:px-4 prose-th:py-3
              prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-border
              prose-tr:even:bg-muted/50
              [&_table]:shadow-lg [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-border
              [&_thead]:bg-gradient-to-r [&_thead]:from-indigo-600 [&_thead]:to-purple-600
              [&_thead_th]:text-white [&_thead_th]:font-semibold
              [&_tbody_tr:hover]:bg-muted/70 [&_tbody_tr]:transition-colors"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-foreground">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full font-medium hover:from-indigo-100 hover:to-purple-100 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Box */}
          <div className="mt-12 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <h3 className="text-xl font-bold text-foreground mb-2">Ready to try VoiceFleet?</h3>
            <p className="text-muted-foreground mb-4">See how AI voice agents can transform your business at 80% lower cost.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
              >
                Start Free Trial
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-200"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <RelatedContent
            category={post.category}
            currentSlug={slug}
            tags={post.tags}
          />
        </article>

        <CTASection
          title="Ready to Scale Your Support?"
          description="See how VoiceFleet AI voice agents can handle your calls at 80% lower cost."
        />

        <Footer />
      </div>
    </>
  );
}
