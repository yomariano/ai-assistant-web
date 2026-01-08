"use client";

import { useState } from "react";
import {
  Building2,
  Stethoscope,
  Scale,
  Wrench,
  UtensilsCrossed,
  Home,
  Check,
  ChevronRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  promptTemplates,
  type PromptTemplate,
} from "@/lib/content/prompt-templates";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Stethoscope,
  Scale,
  Wrench,
  UtensilsCrossed,
  Home,
};

interface PromptTemplateSelectorProps {
  onSelectTemplate: (template: PromptTemplate) => void;
  currentTemplateId?: string;
}

export function PromptTemplateSelector({
  onSelectTemplate,
  currentTemplateId,
}: PromptTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateClick = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setShowPreview(false);
      setSelectedTemplate(null);
    }
  };

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
        with best practices for your business type.
      </p>

      {/* Template Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {promptTemplates.map((template) => {
          const Icon = iconMap[template.icon] || Building2;
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
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-muted-foreground" />
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
                  {(() => {
                    const Icon = iconMap[selectedTemplate.icon] || Building2;
                    return (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    );
                  })()}
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

              <div className="space-y-6 mt-4">
                {/* Guidelines */}
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    Key Guidelines
                  </h4>
                  <ul className="space-y-1">
                    {selectedTemplate.guidelines.map((guideline, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        {guideline}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sample Greeting */}
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    Sample Greeting
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-sm text-muted-foreground italic">
                      &ldquo;{selectedTemplate.firstMessage}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Suggested Name */}
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    Suggested Assistant Name
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.suggestedAssistantName}
                  </p>
                </div>

                {/* Placeholders to fill */}
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    Information You&apos;ll Provide
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.placeholders.map((placeholder) => (
                      <span
                        key={placeholder.key}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                      >
                        {placeholder.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* System Prompt Preview */}
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    System Prompt Preview
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border max-h-48 overflow-y-auto">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {selectedTemplate.systemPrompt}
                    </pre>
                  </div>
                </div>
              </div>

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
