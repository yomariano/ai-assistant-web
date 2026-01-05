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

        {/* Breadcrumb */}
        <div className="pt-24 pb-4 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12">
            {post.category && (
              <span className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
            )}
            <AuthorCard
              name={post.author_name}
              avatar={post.author_avatar_url}
              date={post.published_at || post.created_at}
            />
          </header>

          {post.featured_image_url && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 bg-muted">
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

          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

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
