import { ShoppingBag, Calendar, HelpCircle, Mic, Bell, Clock } from 'lucide-react';

const features = [
    {
        icon: ShoppingBag,
        title: "Takes Orders",
        description: "Handles takeaway orders, modifications, special requests. Just like your best staff.",
        color: "orange"
    },
    {
        icon: Calendar,
        title: "Makes Bookings",
        description: "Table reservations with date, time, party size. Syncs with your calendar.",
        color: "blue"
    },
    {
        icon: HelpCircle,
        title: "Answers Questions",
        description: "Opening hours, menu items, allergens, parking. Trained on YOUR info.",
        color: "green"
    },
    {
        icon: Mic,
        title: "Speaks Irish English",
        description: "Not an American robot. Natural voice your customers trust.",
        color: "purple"
    },
    {
        icon: Bell,
        title: "Sends Notifications",
        description: "Instant SMS to you AND the customer. Nothing falls through cracks.",
        color: "pink"
    },
    {
        icon: Clock,
        title: "Works 24/7",
        description: "3am order? Bank holiday? Makes no difference. Always on.",
        color: "amber"
    }
];

const colorClasses = {
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    pink: { bg: "bg-pink-100", text: "text-pink-600" },
    amber: { bg: "bg-amber-100", text: "text-amber-600" },
};

export default function FeaturesGrid() {
    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wide mb-3">Features</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Everything You Need to Never Miss an Order
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        OrderBot does more than answer calls — it becomes an extension of your team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => {
                        const colors = colorClasses[feature.color as keyof typeof colorClasses];
                        return (
                            <div
                                key={feature.title}
                                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${colors.bg} mb-6`}>
                                    <feature.icon className={`h-7 w-7 ${colors.text}`} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
