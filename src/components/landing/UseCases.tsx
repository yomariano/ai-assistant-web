import { Calendar, PhoneOff, Building2, Stethoscope, CreditCard, HelpCircle } from 'lucide-react';

const useCases = [
    {
        title: "Book Appointments",
        description: "Schedule doctor visits, salon appointments, or restaurant reservations without the back-and-forth.",
        icon: Calendar,
        example: "\"Book me a haircut for Saturday afternoon\"",
        color: "indigo"
    },
    {
        title: "Cancel Subscriptions",
        description: "Navigate retention scripts and cancel unwanted services. No guilt trips, no hassle.",
        icon: PhoneOff,
        example: "\"Cancel my gym membership effective immediately\"",
        color: "rose"
    },
    {
        title: "Government & DMV",
        description: "Let AI wait on hold for hours and connect you only when a human is ready.",
        icon: Building2,
        example: "\"Renew my vehicle registration\"",
        color: "amber"
    },
    {
        title: "Healthcare Calls",
        description: "Schedule appointments, request prescription refills, or check on insurance claims.",
        icon: Stethoscope,
        example: "\"Schedule my annual checkup with Dr. Smith\"",
        color: "emerald"
    },
    {
        title: "Billing Disputes",
        description: "Negotiate bills, dispute charges, or request refunds on your behalf.",
        icon: CreditCard,
        example: "\"Dispute the $50 late fee on my account\"",
        color: "violet"
    },
    {
        title: "Customer Support",
        description: "Handle returns, track packages, or resolve issues with any company.",
        icon: HelpCircle,
        example: "\"Check the status of my return request\"",
        color: "sky"
    }
];

const colorClasses = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
    sky: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
};

export default function UseCases() {
    return (
        <section id="use-cases" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">Use Cases</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        What Can Our AI Call For You?
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        From personal errands to business operations, our AI handles any phone call with human-like conversation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {useCases.map((useCase) => {
                        const colors = colorClasses[useCase.color as keyof typeof colorClasses];
                        return (
                            <div 
                                key={useCase.title} 
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} mb-4`}>
                                    <useCase.icon className={`h-6 w-6 ${colors.text}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{useCase.description}</p>
                                <div className={`${colors.bg} ${colors.border} border rounded-lg px-3 py-2`}>
                                    <p className={`text-sm ${colors.text} italic`}>{useCase.example}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
