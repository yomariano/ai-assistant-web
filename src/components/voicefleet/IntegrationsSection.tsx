import { Plug } from "lucide-react";

const IntegrationsSection = () => {
  const integrations = [
    { name: "Salesforce", category: "CRM" },
    { name: "HubSpot", category: "CRM" },
    { name: "Zendesk", category: "Support" },
    { name: "Freshdesk", category: "Support" },
    { name: "Twilio", category: "Telephony" },
    { name: "Genesys", category: "Telephony" },
    { name: "Five9", category: "Telephony" },
    { name: "Talkdesk", category: "Telephony" },
    { name: "Microsoft Teams", category: "Collaboration" },
    { name: "Slack", category: "Collaboration" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Plug className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Integrations</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Works With Your <span className="text-gradient-primary">Existing Stack</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Seamless integration with the tools you already use
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl border border-border p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <span className="text-lg font-bold text-primary">
                  {integration.name.charAt(0)}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">{integration.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{integration.category}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Don&apos;t see your system? We offer custom integrations for enterprise clients.
          </p>
          <a href="#demo" className="text-primary font-semibold hover:underline">
            Contact us for custom integration →
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
