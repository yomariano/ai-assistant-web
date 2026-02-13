"use client";

import { useState, useEffect } from "react";
import {
  Check,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { templatesApi } from "@/lib/api";
import type { AssistantTemplate, TemplatePreview } from "@/lib/api";

export interface SelectedTemplateData {
  id: string;
  name: string;
  firstMessage: string;
  systemPrompt: string;
  suggestedAssistantName?: string;
}

interface PromptTemplateSelectorProps {
  onSelectTemplate: (template: SelectedTemplateData) => void;
  currentTemplateId?: string;
  businessName?: string;
  businessDescription?: string;
}

export function PromptTemplateSelector({
  onSelectTemplate,
  currentTemplateId,
  businessName,
  businessDescription,
}: PromptTemplateSelectorProps) {
  const [templates, setTemplates] = useState<AssistantTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<AssistantTemplate | null>(null);
  const [preview, setPreview] = useState<TemplatePreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [templateDetails, setTemplateDetails] = useState<{
    defaultSettings?: { greetingName?: string };
  } | null>(null);

  // Fetch templates from API on mount
  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await templatesApi.list();
        setTemplates(res.templates || []);
      } catch (err) {
        console.error("Failed to load templates:", err);
      } finally {
        setIsLoadingTemplates(false);
      }
    }
    loadTemplates();
  }, []);

  const handleTemplateClick = async (template: AssistantTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
    setIsLoadingPreview(true);
    setPreview(null);

    try {
      // Fetch both template details (for suggestedAssistantName) and preview in parallel
      const [detailRes, previewRes] = await Promise.all([
        templatesApi.get(template.id),
        templatesApi.preview(template.id, {
          businessName: businessName || "Your Business",
          businessDescription: businessDescription || "",
        }),
      ]);
      setTemplateDetails(detailRes.template);
      setPreview(previewRes.preview);
    } catch (err) {
      console.error("Failed to load template preview:", err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleUseTemplate = () => {
    if (selectedTemplate && preview) {
      onSelectTemplate({
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        firstMessage: preview.firstMessage,
        systemPrompt: preview.systemPromptFull,
        suggestedAssistantName: templateDetails?.defaultSettings?.greetingName,
      });
      setShowPreview(false);
      setSelectedTemplate(null);
      setPreview(null);
      setTemplateDetails(null);
    }
  };

  if (isLoadingTemplates) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading templates...</span>
      </div>
    );
  }

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">
          Start with a Template
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Choose an industry template to quickly configure your AI receptionist
        with best practices, security rules, and natural speech patterns.
      </p>

      {/* Template Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {templates.map((template) => {
          const isSelected = currentTemplateId === template.id;

          return (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className={`
                relative p-4 rounded-xl border text-left transition-all
                hover:border-primary/50 hover:bg-primary/5
                ${isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card"
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="text-2xl mb-3">
                {template.icon}
              </div>
              <h4 className="font-medium text-foreground text-sm mb-1">
                {template.name}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {template.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {selectedTemplate.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedTemplate.name}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedTemplate.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {isLoadingPreview ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Generating preview{businessName ? ` for ${businessName}` : ""}...
                  </span>
                </div>
              ) : preview ? (
                <div className="space-y-6 mt-4">
                  {/* What's Included */}
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-1">
                      {[
                        "Industry-specific conversation flows",
                        "Security rules (injection protection, impersonation defense)",
                        "Natural speech patterns (dates, times, phone numbers)",
                        "Conversation rules (concise responses, info-gathering-first)",
                        "Personalized with your business name",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Greeting */}
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">
                      Greeting
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;{preview.firstMessage}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* System Prompt Preview */}
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">
                      System Prompt Preview
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-3 border border-border max-h-48 overflow-y-auto">
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                        {preview.systemPromptPreview}
                      </pre>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Showing first 500 characters. Full prompt ({preview.systemPromptFull.length.toLocaleString()} chars) will be applied on use.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Failed to load preview. Please try again.
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  onClick={handleUseTemplate}
                  className="flex-1"
                  disabled={isLoadingPreview || !preview}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use This Template
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PromptTemplateSelector;
