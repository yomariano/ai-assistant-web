import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service | VoiceFleet',
    description: 'Terms of Service for VoiceFleet AI Voice Agents',
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
            <div className="mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-y2k-cyan hover:text-white transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
                
                <div className="glass-card rounded-2xl p-8 lg:p-12">
                    <h1 className="font-display text-3xl font-bold text-white mb-2">Terms of Service</h1>
                    <p className="text-y2k-silver text-sm mb-8">Last updated: December 2024</p>
                    
                    <div className="space-y-6 text-y2k-chrome text-sm leading-relaxed">
                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing and using VoiceFleet, you agree to be bound by these Terms of Service.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">2. Description of Service</h2>
                            <p>VoiceFleet provides AI-powered voice agents that handle phone calls for businesses using artificial intelligence.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">3. User Responsibilities</h2>
                            <p className="font-semibold text-white mb-2">You are solely responsible for:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>All calls made through your account</li>
                                <li>Ensuring you have authorization to contact the phone numbers you provide</li>
                                <li>Complying with all applicable laws (TCPA, GDPR, local telemarketing regulations)</li>
                                <li>The content and instructions you provide to the AI agent</li>
                                <li>Any consequences arising from calls made on your behalf</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">4. Prohibited Uses</h2>
                            <p className="mb-2">You agree NOT to use the Service to:</p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Make calls to emergency services (911, 112, 999, etc.)</li>
                                <li>Harass, threaten, or intimidate any person</li>
                                <li>Conduct fraudulent or deceptive activities</li>
                                <li>Violate any laws or regulations</li>
                                <li>Make unsolicited commercial calls without consent</li>
                                <li>Impersonate any person or entity</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">5. Payment and Billing</h2>
                            <p>Subscription fees are billed in advance. Usage is tracked according to your plan. You agree to pay all charges incurred under your account.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">6. Disclaimer of Warranties</h2>
                            <p>THE SERVICE IS PROVIDED AS IS WITHOUT WARRANTIES OF ANY KIND. We do not guarantee that calls will be completed successfully or that the AI will perform exactly as instructed.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">7. Limitation of Liability</h2>
                            <p>VoiceFleet shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability shall not exceed the amount you paid us in the past 12 months.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">8. Termination</h2>
                            <p>We may suspend or terminate your access at any time for violation of these terms or at our sole discretion.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">9. Contact</h2>
                            <p>For questions about these Terms, contact us at legal@voicefleet.ai</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
