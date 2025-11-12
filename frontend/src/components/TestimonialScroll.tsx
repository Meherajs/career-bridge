"use client"

import { Star } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  handle: string
  avatar: string
  text: string
  highlight?: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    handle: "@sarahchen_dev",
    avatar: "SC",
    text: "was the simplest and easiest way to find my dream job. The AI recommendations were spot on! 🎯",
    highlight: "@CareerBridge"
  },
  {
    id: "2",
    name: "Michael Torres",
    handle: "@miketorres",
    avatar: "MT",
    text: "Just landed my first software engineering role thanks to the career roadmap! This platform is a game-changer for fresh graduates.",
    highlight: "@CareerBridge"
  },
  {
    id: "3",
    name: "Priya Sharma",
    handle: "@priyacodes",
    avatar: "PS",
    text: "WOW - what an amazing platform. The learning resources are perfectly curated and the job matches are incredibly relevant. #CareerSuccess",
    highlight: "@CareerBridge"
  },
  {
    id: "4",
    name: "James Anderson",
    handle: "@james_codes",
    avatar: "JA",
    text: "has been a lifesaver! Got 3 interview calls within a week of completing my profile. The skill assessment really helped me stand out.",
    highlight: "@CareerBridge"
  },
  {
    id: "5",
    name: "Aisha Rahman",
    handle: "@aisharahman",
    avatar: "AR",
    text: "Best career platform I've used. The personalized roadmap helped me transition from marketing to UX design in just 6 months! 🚀",
    highlight: "@CareerBridge"
  },
  {
    id: "6",
    name: "David Kim",
    handle: "@davidkim_tech",
    avatar: "DK",
    text: "Finally, a platform that understands what entry-level candidates need. The interview prep resources alone are worth it! 💯",
    highlight: "@CareerBridge"
  },
  {
    id: "7",
    name: "Emma Wilson",
    handle: "@emmawilson",
    avatar: "EW",
    text: "was hands down the best career decision I made this year. Found my role, learned new skills, and grew my network all in one place!",
    highlight: "@CareerBridge"
  },
  {
    id: "8",
    name: "Carlos Rodriguez",
    handle: "@carlos_dev",
    avatar: "CR",
    text: "The AI-powered job matching is incredible. Every recommendation was relevant to my skills and career goals. Highly recommend! ⭐⭐⭐⭐⭐",
    highlight: "@CareerBridge"
  }
]

export default function TestimonialScroll() {
  // Triple testimonials for seamless loop
  const tripleTestimonials = [...testimonials, ...testimonials, ...testimonials]

  const renderTestimonialText = (text: string, highlight?: string) => {
    if (!highlight) return text

    const parts = text.split(highlight)
    return (
      <>
        {parts[0]}
        <span className="text-gradient font-semibold">{highlight}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by Job Seekers & Students
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who've transformed their careers with CareerBridge
          </p>
        </div>
      </div>

      {/* Scrolling Testimonials Container */}
      <div className="relative w-full overflow-hidden">
        {/* Single Scrolling Row */}
        <div className="flex animate-scroll-left">
          {tripleTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="flex-shrink-0 w-[350px] md:w-[420px] mx-3"
            >
              <div className="glass-effect rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 h-full">
                <div className="flex items-start space-x-3 mb-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {testimonial.handle}
                    </p>
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {renderTestimonialText(testimonial.text, testimonial.highlight)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

