"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { templatesApi, type AssistantTemplate } from "@/lib/api";

interface TemplateSelectionStepProps {
  selectedTemplate: string | null;
  onSelect: (templateId: string) => void;
  onNext: () => void;
  onBack: () => void;
  region?: string;
}

export function TemplateSelectionStep({
  selectedTemplate,
  onSelect,
  onNext,
  onBack,
  region = "IE",
}: TemplateSelectionStepProps) {
  const [templates, setTemplates] = useState<AssistantTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isSpanish = region === "AR";

  useEffect(() => {
    async function loadTemplates() {
      try {
        const response = await templatesApi.list({
          region,
          locale: isSpanish ? "es-AR" : undefined,
        });
        if (response.success) {
          setTemplates(response.templates);
        }
      } catch (err) {
        console.error("Failed to load templates:", err);
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, [region, isSpanish]);

  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          {isSpanish ? "Que tipo de negocio tenes?" : "What type of business do you have?"}
        </h2>
        <p className="text-muted-foreground text-sm">
          {isSpanish
            ? "Elegí tu rubro y configuramos tu asistente con guiones y comportamientos adecuados."
            : "Select your industry and we&apos;ll set up your AI assistant with the right scripts and behaviors"}
        </p>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 max-h-[340px] overflow-y-auto pr-1">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 text-left transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              selectedTemplate === template.id
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            )}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            )}
            <div className="text-2xl mb-2">{template.icon}</div>
            <h3 className="font-semibold text-foreground text-sm mb-1">
              {template.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          </button>
        ))}
      </div>

      {/* Info text */}
      {selectedTemplate && (
        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {isSpanish ? "Excelente eleccion!" : "Great choice!"}
            </span>{" "}
            {isSpanish
              ? "Tu asistente quedara preconfigurado con flujos de conversacion del rubro, escenarios comunes y respuestas profesionales."
              : "Your AI will be pre-configured with industry-specific conversation flows, common scenarios, and professional responses."}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          {isSpanish ? "Atras" : "Back"}
        </Button>
        <Button
          variant="hero"
          onClick={onNext}
          disabled={!selectedTemplate}
          className="flex-1"
        >
          {isSpanish ? "Continuar" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export default TemplateSelectionStep;
