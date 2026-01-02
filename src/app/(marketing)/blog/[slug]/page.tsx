import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPostSlugs } from "@/lib/content/blog";
import { generateBlogMetadata } from "@/lib/seo/metadata";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import AuthorCard from "@/components/marketing/AuthorCard";
import RelatedContent from "@/components/marketing/RelatedContent";
import CTASection from "@/components/marketing/CTASection";
import Image from "next/image";

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
    process.env.NEXT_PUBLIC_SITE_URL || "https://validatecall.com";

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

      <div className="min-h-screen bg-white">
        <Breadcrumbs items={breadcrumbs} />

        <article className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12">
            {post.category && (
              <span className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
            )}
            <AuthorCard
              name={post.author_name}
              avatar={post.author_avatar_url}
              date={post.published_at || post.created_at}
            />
          </header>

          {post.featured_image_url && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 bg-gray-100">
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
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
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

        <CTASection />
      </div>
    </>
  );
}
