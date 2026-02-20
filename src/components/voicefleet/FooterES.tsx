import { Phone, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const reviewPlatforms = [
  { name: "Trustpilot", logo: "/integrations/trustpilot.svg", href: "https://www.trustpilot.com/" },
  { name: "G2", logo: "/integrations/g2.svg", href: "https://www.g2.com/" },
  { name: "Capterra", logo: "/integrations/capterra.png", href: "https://www.capterra.com/" },
];

const FooterES = () => {
  return (
    <footer className="bg-gradient-dark text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/es/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                <Image
                  src="/logo-mark.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <span className="text-xl font-heading font-bold">VoiceFleet</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-xs">
              Recepcionista IA para pymes. Atende llamadas, toma mensajes y agenda turnos automaticamente.
            </p>
            <Link
              href="/es/#demo"
              className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              Habla con nuestro equipo
            </Link>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
              <Link href="/es/funciones" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Funciones
              </Link>
              <Link href="/for" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Industrias
              </Link>
              <Link href="/connect" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Integraciones
              </Link>
              <Link href="/compare" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Comparar
              </Link>
              <Link href="/es/precios" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Precios
              </Link>
              <Link href="/blog" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Blog
              </Link>
              <Link href="/privacy" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Terminos
              </Link>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                English
              </Link>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider mb-2">
                Plataformas de resenas
              </p>
              <div className="flex flex-wrap gap-2.5">
                {reviewPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/80 hover:text-primary-foreground hover:border-primary-foreground/40 transition-colors"
                  >
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                    />
                    <span className="font-medium">{platform.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/10">
          <p className="text-sm text-primary-foreground/60 text-center">
            &copy; {new Date().getFullYear()} VoiceFleet. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterES;
