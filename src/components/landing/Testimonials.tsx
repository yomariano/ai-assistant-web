import { Star } from 'lucide-react';

const reviews = [
    {
        content: "I used to dread calling the DMV to renew my registration. ValidateCall waited on hold for 2 hours and patched me in only when a human actually picked up. Absolute lifesaver!",
        author: "Sarah J.",
        role: "Small Business Owner",
        rating: 5
    },
    {
        content: "Canceling my gym membership was always a nightmare of retention scripts and guilt trips. This AI handled the entire conversation firmly and got it cancelled in under 5 minutes.",
        author: "Michael Chen",
        role: "Software Engineer",
        rating: 5
    },
    {
        content: "As a non-native English speaker, I sometimes struggle with fast-talking service reps. The AI speaks perfectly and gets my appointments sorted without any confusion.",
        author: "Elena Rodriguez",
        role: "Marketing Director",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">Testimonials</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Loved by People Who Value Their Time
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        Join thousands of users who have reclaimed their day from hold music and call anxiety.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                        >
                            <div className="flex gap-x-1 text-amber-400 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                            <blockquote className="text-gray-700 leading-relaxed">
                                "{review.content}"
                            </blockquote>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="font-semibold text-gray-900">{review.author}</div>
                                <div className="text-sm text-gray-500">{review.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
