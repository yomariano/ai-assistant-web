import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/content/blog";
import { generatePageMetadata } from "@/lib/seo/metadata";
import HeaderES from "@/components/voicefleet/HeaderES";
import FooterES from "@/components/voicefleet/FooterES";
import CTASection from "@/components/marketing/CTASection";

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: "Blog - Recepcionista IA e Insights | VoiceFleet",
    description:
      "Artículos sobre recepcionistas IA, automatización de atención telefónica y cómo escalar tu negocio. Aprendé cómo VoiceFleet reduce costos.",
    path: "/es/blog",
  }),
  alternates: {
    canonical: "https://voicefleet.ai/es/blog",
    languages: {
      "es-AR": "/es/blog",
      en: "/blog",
    },
  },
  openGraph: {
    locale: "es_AR",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPageES() {
  const posts = await getBlogPosts({ limit: 1000, language: "es" });

  return (
    <div className="min-h-screen bg-background">
      <HeaderES />

      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog VoiceFleet
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Artículos sobre recepcionistas IA, automatización y cómo escalar tu
            atención telefónica sin sumar personal.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Todavía no hay artículos en español. ¡Volvé pronto!
            </p>
            <Link
              href="/blog"
              className="inline-block mt-4 text-primary hover:underline"
            >
              Ver artículos en inglés →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/es/blog/${post.slug}`}
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
                      <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-3">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
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
                              "es-AR",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Borrador"}
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
        title="¿Listo para Escalar tu Atención?"
        description="Descubrí cómo los agentes de voz IA de VoiceFleet pueden atender tus llamadas a un 80% menos de costo."
      />

      <FooterES />
    </div>
  );
}
