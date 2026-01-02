import { ShieldCheck, Lock, EyeOff, FileKey, Check } from 'lucide-react';

const benchmarks = [
    "SOC2 Type II Compliant",
    "HIPAA Ready Infrastructure",
    "ISO 27001 Certified Data Centers",
    "GDPR & CCPA Compliant"
];

export default function SecuritySection() {
    return (
        <div id="security" className="py-16 relative">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-12 items-center">
                    <div>
                        <h2 className="text-tech text-sm text-y2k-cyan mb-4">Security First</h2>
                        <p className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Enterprise-Grade{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-y2k-cyan to-y2k-electric-blue">Trust</span>
                        </p>
                        <p className="mt-4 text-base leading-7 text-y2k-chrome">
                            We understand that voice data is sensitive. That's why we've built ValidateCall with a security-first architecture, ensuring your data remains private and protected at all times.
                        </p>

                        <div className="mt-8 space-y-3">
                            {benchmarks.map((item) => (
                                <div key={item} className="flex items-center gap-3 glass-card rounded-lg px-4 py-2 inline-flex mr-2 mb-2">
                                    <div className="flex-none rounded-full bg-y2k-cyan/20 p-1">
                                        <Check className="h-3 w-3 text-y2k-cyan" />
                                    </div>
                                    <span className="text-sm text-y2k-chrome font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="glass-card rounded-2xl p-6 group hover:glow-blue transition-all duration-300">
                            <div className="chrome-surface w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:glow-blue transition-all">
                                <Lock className="h-6 w-6 text-y2k-cyan" />
                            </div>
                            <h3 className="font-display text-base font-bold text-white">End-to-End Encryption</h3>
                            <p className="mt-2 text-sm text-y2k-chrome">All audio streams and transcripts are encrypted at rest and in transit using AES-256.</p>
                        </div>
                        <div className="glass-card rounded-2xl p-6 group hover:glow-blue transition-all duration-300">
                            <div className="chrome-surface w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:glow-blue transition-all">
                                <EyeOff className="h-6 w-6 text-y2k-cyan" />
                            </div>
                            <h3 className="font-display text-base font-bold text-white">PII Redaction</h3>
                            <p className="mt-2 text-sm text-y2k-chrome">Automatically identify and redact sensitive information like credit cards and SSNs from transcripts.</p>
                        </div>
                        <div className="glass-card rounded-2xl p-6 group hover:glow-blue transition-all duration-300">
                            <div className="chrome-surface w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:glow-blue transition-all">
                                <FileKey className="h-6 w-6 text-y2k-cyan" />
                            </div>
                            <h3 className="font-display text-base font-bold text-white">Access Control</h3>
                            <p className="mt-2 text-sm text-y2k-chrome">Granular RBAC and SSO (SAML/OIDC) integration for complete control over your workspace.</p>
                        </div>
                        <div className="glass-card rounded-2xl p-6 group hover:glow-blue transition-all duration-300">
                            <div className="chrome-surface w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:glow-blue transition-all">
                                <ShieldCheck className="h-6 w-6 text-y2k-cyan" />
                            </div>
                            <h3 className="font-display text-base font-bold text-white">Audit Logs</h3>
                            <p className="mt-2 text-sm text-y2k-chrome">Complete audit trails of all agent modifications, call triggers, and data exports.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
