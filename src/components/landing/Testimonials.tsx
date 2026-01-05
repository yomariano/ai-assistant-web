import { Star, Quote } from 'lucide-react';

const reviews = [
    {
        content: "We were losing 10+ orders every Saturday during rush. OrderBot paid for itself in the first weekend.",
        author: "Sarah",
        business: "The Rolling Scone",
        location: "Dublin",
        rating: 5
    },
    {
        content: "I was skeptical about AI but customers can't tell the difference. Some even prefer it because there's no hold time.",
        author: "Michael",
        business: "Pasta Palace",
        location: "Cork",
        rating: 5
    },
    {
        content: "Setup took 20 minutes. They called me, asked about my menu, and it was live the next day. Brilliant.",
        author: "Emma",
        business: "Green Bean Café",
        location: "Galway",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wide mb-3">Testimonials</h2>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Trusted by 50+ Irish Food Businesses
                    </p>
                    <p className="mt-4 text-lg text-gray-600">
                        Hear from restaurant owners, café managers, and takeaway shops across Ireland.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative"
                        >
                            {/* Quote icon */}
                            <Quote className="h-8 w-8 text-orange-200 absolute top-6 right-6" />

                            <div className="flex gap-x-1 text-orange-400 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                            <blockquote className="text-gray-700 leading-relaxed text-lg">
                                &ldquo;{review.content}&rdquo;
                            </blockquote>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="font-semibold text-gray-900">{review.author}</div>
                                <div className="text-sm text-orange-600 font-medium">{review.business}</div>
                                <div className="text-sm text-gray-500">{review.location}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logo bar placeholder */}
                <div className="mt-16 pt-12 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-500 mb-8">Trusted by restaurants, cafés, and takeaways across Ireland</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
                        <div className="h-8 w-24 bg-gray-200 rounded" />
                        <div className="h-8 w-28 bg-gray-200 rounded" />
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                        <div className="h-8 w-32 bg-gray-200 rounded" />
                        <div className="h-8 w-24 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        </section>
    );
}
