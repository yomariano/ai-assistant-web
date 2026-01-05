import { PhoneOff, Users, Clock } from 'lucide-react';

const painPoints = [
    {
        icon: PhoneOff,
        title: "Phone rings during rush hour. You can't answer.",
        description: "That's €15 walking out the door.",
        stat: "€15",
        statLabel: "Lost per missed call"
    },
    {
        icon: Users,
        title: "You hire someone just to answer phones.",
        description: "That's €2,000/month for a part-time task.",
        stat: "€2,000",
        statLabel: "Monthly staff cost"
    },
    {
        icon: Clock,
        title: "Customers leave voicemails. You call back hours later.",
        description: "They've already ordered elsewhere.",
        stat: "73%",
        statLabel: "Won't leave a voicemail"
    }
];

export default function UseCases() {
    return (
        <section id="problem" className="py-20 bg-gray-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-3">Sound Familiar?</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-white">
                        Every Missed Call is Money Lost
                    </p>
                    <p className="mt-4 text-lg text-gray-400">
                        Running a café or restaurant means your hands are always full. But the phone keeps ringing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {painPoints.map((point, index) => (
                        <div
                            key={index}
                            className="relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-500/10 mb-6">
                                <point.icon className="h-7 w-7 text-red-400" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {point.title}
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {point.description}
                            </p>

                            {/* Stat */}
                            <div className="pt-6 border-t border-gray-700">
                                <div className="text-3xl font-bold text-orange-400">{point.stat}</div>
                                <div className="text-sm text-gray-500">{point.statLabel}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Solution Teaser */}
                <div className="mt-16 text-center">
                    <p className="text-lg text-gray-400">
                        What if every call was answered in 0.5 seconds?
                    </p>
                    <p className="text-2xl font-semibold text-white mt-2">
                        Meet <span className="text-orange-400">OrderBot</span> — Your 24/7 Order Taker
                    </p>
                </div>
            </div>
        </section>
    );
}
