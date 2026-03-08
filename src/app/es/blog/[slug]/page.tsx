import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock3, Tag } from "lucide-react";
import { getBlogPost } from "@/lib/content/blog";
import {
  estimateReadingTime,
  formatBlogDate,
  getBlogDisplayDate,
  getBlogExcerpt,
} from "@/lib/content/blog-presentation";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo";
import HeaderES from "@/components/voicefleet/HeaderES";
import FooterES from "@/components/voicefleet/FooterES";
import CTASection from "@/components/marketing/CTASection";
import { RichBlogContent } from "@/components/content";
import BlogDemoEmbed from "@/components/blog/BlogDemoEmbed";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {};
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || getBlogExcerpt(post, 180),
    alternates: {
      canonical: `${siteUrl}/es/blog/${slug}`,
      languages: {
        "es-AR": `/es/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || getBlogExcerpt(post, 180),
      url: `${siteUrl}/es/blog/${slug}`,
      type: "article",
      locale: "es_AR",
      images: post.featured_image_url
        ? [{ url: post.featured_image_url, alt: post.featured_image_alt || post.title }]
        : undefined,
    },
  };
}

export default async function BlogPostPageES({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Inicio", href: "/es" },
    { name: "Blog", href: "/es/blog" },
    { name: post.title, href: `/es/blog/${slug}` },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://voicefleet.ai";
  const displayDate = getBlogDisplayDate(post);
  const formattedDate = formatBlogDate(displayDate, "es-AR", "long") || "Borrador";
  const readTime = estimateReadingTime(post.content);
  const description = getBlogExcerpt(post, 240);

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt || description}
        image={post.featured_image_url || `${siteUrl}/opengraph-image`}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        author={post.author_name}
        url={`${siteUrl}/es/blog/${slug}`}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#ffffff_28%,#f8fafc_100%)]">
        <HeaderES />

        <main>
          <section className="relative overflow-hidden border-b border-stone-200/80 bg-[radial-gradient(circle_at_top_left,rgba(219,234,254,0.8),transparent_32%),radial-gradient(circle_at_top_right,rgba(226,232,240,0.72),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] pt-28 pb-14">
            <div className="mx-auto max-w-[1360px] px-6">
              <Link
                href="/es/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Blog
              </Link>

              <div className="mt-8 max-w-4xl">
                <span className="inline-flex rounded-full border border-stone-200 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 shadow-sm">
                  {post.category || "Artículo"}
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
                      <p className="text-stone-500">Equipo editorial de VoiceFleet</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>{readTime} min de lectura</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1360px] px-6 pt-8">
            <div className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.07)]">
              <div className="border-b border-stone-200/80 bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(248,250,252,0.96))] px-6 py-8 md:px-10 lg:px-14 xl:px-16">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                  Product Preview
                </p>
                <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <h2 className="font-heading text-3xl font-bold tracking-[-0.03em] text-stone-950">
                      Mira como funciona VoiceFleet antes de seguir leyendo
                    </h2>
                    <p className="mt-3 text-base leading-7 text-stone-600">
                      Quien llega desde un blog deberia ver el producto enseguida. Prueba el demo en vivo, escucha el flujo de IA y despues sigue con el articulo.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/demo"
                      className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
                    >
                      Probar Demo
                    </Link>
                    <a
                      href="https://calendly.com/voicefleet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50"
                    >
                      Reservar Demo
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[linear-gradient(180deg,rgba(248,250,252,0.88),rgba(255,255,255,0.98))]">
                <BlogDemoEmbed embedded />
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1360px] px-6 py-12">
            <div className="grid gap-8 xl:gap-10 lg:grid-cols-[190px_minmax(0,1fr)]">
              <aside className="h-fit lg:sticky lg:top-24">
                <div className="rounded-[1.5rem] border border-stone-200/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Datos del artículo
                  </p>
                  <dl className="mt-5 space-y-4 text-sm">
                    <div>
                      <dt className="text-stone-500">Publicado</dt>
                      <dd className="mt-1 font-semibold text-stone-900">{formattedDate}</dd>
                    </div>
                    <div>
                      <dt className="text-stone-500">Lectura</dt>
                      <dd className="mt-1 font-semibold text-stone-900">{readTime} min</dd>
                    </div>
                    <div>
                      <dt className="text-stone-500">Categoría</dt>
                      <dd className="mt-1 font-semibold text-stone-900">{post.category || "Artículo"}</dd>
                    </div>
                  </dl>

                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-6 border-t border-stone-100 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                        Etiquetas
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
                  />

                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-12 border-t border-stone-200 pt-8">
                      <div className="mb-4 flex items-center gap-2 text-stone-700">
                        <Tag className="h-5 w-5" />
                        <span className="font-semibold">Etiquetas</span>
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
              </div>
            </div>
          </section>

          <CTASection
            title="¿Listo para escalar tu atención?"
            description="Descubrí cómo los agentes de voz IA de VoiceFleet pueden atender tus llamadas a un 80% menos de costo."
          />
        </main>

        <FooterES />
      </div>
    </>
  );
}
