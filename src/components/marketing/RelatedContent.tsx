import Link from "next/link";
import Image from "next/image";
import { getRelatedPosts } from "@/lib/content/blog";

interface RelatedContentProps {
  category?: string | null;
  currentSlug: string;
  tags?: string[] | null;
}

export default async function RelatedContent({
  category,
  currentSlug,
  tags,
}: RelatedContentProps) {
  const posts = await getRelatedPosts(currentSlug, category, tags);

  if (!posts.length) return null;

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="h-full">
              {post.featured_image_url && (
                <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                  <Image
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {post.excerpt}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
