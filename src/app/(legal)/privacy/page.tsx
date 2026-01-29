import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy | VoiceFleet',
    description: 'Privacy Policy for VoiceFleet AI Voice Agents',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-dark py-16 px-6">
            <div className="mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-y2k-cyan hover:text-white transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
                
                <div className="glass-card rounded-2xl p-8 lg:p-12">
                    <h1 className="font-display text-3xl font-bold text-white mb-2">Privacy Policy</h1>
                    <p className="text-y2k-silver text-sm mb-8">Last updated: December 2024</p>
                    
                    <div className="space-y-6 text-y2k-chrome text-sm leading-relaxed">
                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">1. Information We Collect</h2>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Account information (email, name)</li>
                                <li>Payment information (processed securely by Stripe)</li>
                                <li>Call logs and transcripts</li>
                                <li>Usage data and analytics</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">2. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>To provide and improve our services</li>
                                <li>To process payments</li>
                                <li>To communicate with you about your account</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">3. Data Retention</h2>
                            <p>We retain call logs and account data for as long as your account is active and as required by law. You may request deletion of your data by contacting us.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">4. Data Security</h2>
                            <p>We use industry-standard security measures including encryption in transit and at rest. However, no method of transmission over the Internet is 100% secure.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">5. Third-Party Services</h2>
                            <p>We use third-party services including Stripe (payments), Supabase (database), and VAPI (voice AI). These services have their own privacy policies.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">6. Your Rights</h2>
                            <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@voicefleet.ai to exercise these rights.</p>
                        </section>

                        <section>
                            <h2 className="font-display text-lg font-bold text-white mb-3">7. Contact</h2>
                            <p>For privacy questions, contact us at privacy@voicefleet.ai</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
