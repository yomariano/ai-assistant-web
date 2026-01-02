import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/content/blog";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/marketing/Breadcrumbs";
import CTASection from "@/components/marketing/CTASection";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog - AI Voice Assistant Insights & Tips",
  description:
    "Learn how to automate phone calls, save time, and boost productivity with AI voice assistants. Tips, guides, and industry insights.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPosts({ limit: 20 });

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumbs items={breadcrumbs} />

      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ValidateCall Blog
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Insights, tips, and guides on automating phone calls with AI voice
            assistants.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                  {post.featured_image_url && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={post.featured_image_url}
                        alt={post.featured_image_alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full mb-3">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{post.author_name}</span>
                      <span>·</span>
                      <time dateTime={post.published_at || undefined}>
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Draft"}
                      </time>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <CTASection
        title="Ready to try AI voice calls?"
        description="Start automating your phone calls today and save hours every week."
      />
    </div>
  );
}
