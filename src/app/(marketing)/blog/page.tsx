import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/content/blog";
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

export default async function BlogPage() {
  const posts = await getBlogPosts({ limit: 20 });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            VoiceFleet Blog
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Insights on AI voice agents, automation, and scaling customer support
            without scaling headcount.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
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
                <article className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border">
                  {post.featured_image_url && (
                    <div className="relative h-48 bg-muted">
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
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-indigo-600 transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{post.author_name}</span>
                      <span>·</span>
                      <time dateTime={post.published_at || undefined}>
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString(
                              "en-IE",
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
        title="Ready to Scale Your Support?"
        description="See how VoiceFleet AI voice agents can handle your calls at 80% lower cost."
      />

      <Footer />
    </div>
  );
}
