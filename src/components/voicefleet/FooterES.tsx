import { Phone, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
              Recepcionista IA para pymes. Atendé llamadas, tomá mensajes y agendá turnos automáticamente.
            </p>
            <Link
              href="/es/#demo"
              className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              Hablá con nuestro equipo
            </Link>
          </div>

          {/* Links */}
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
              Términos
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              English
            </Link>
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
