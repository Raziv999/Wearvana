import Link from 'next/link'
import { blogPosts } from '@/data/blogPosts'

export const metadata = {
  title: 'Sneaker Stories | Wearvana Blog — Nepal Streetwear & Culture',
  description: 'Guides, drop breakdowns, and culture pieces for the Nepali sneakerhead. Learn sizing, follow the drops, understand the culture.',
  alternates: { canonical: 'https://getwearvana.com/blog' },
  openGraph: {
    title: 'Sneaker Stories | Wearvana Blog',
    description: 'Guides, culture, and drop coverage for Nepal\'s sneaker community.',
    url: 'https://getwearvana.com/blog',
    siteName: 'Wearvana',
    type: 'website',
  },
}

const CATEGORY_COLORS = {
  Drops:   'text-[#C0231E] border-[#C0231E]/30',
  Guides:  'text-[#34D399] border-[#34D399]/30',
  Culture: 'text-[#FBBF24] border-[#FBBF24]/30',
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F4F4]">

      {/* ── Header ── */}
      <div className="border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="font-body text-[#C0231E] text-[10px] tracking-[0.25em] uppercase mb-2">
            Wearvana Blog
          </p>
          <h1 className="font-heading font-black text-[#F4F4F4] text-4xl md:text-5xl uppercase mb-3">
            Sneaker Stories
          </h1>
          <p className="font-body text-[#525252] text-sm max-w-lg">
            Drop guides, sizing advice, and culture pieces for Nepal's sneaker community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* ── Featured article ── */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block border border-[#242424] hover:border-[#C0231E]/40 transition-all duration-200 mb-8 md:mb-12"
        >
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`font-body text-[9px] tracking-[0.2em] uppercase border px-2 py-1 ${CATEGORY_COLORS[featured.category] ?? 'text-[#525252] border-[#242424]'}`}>
                {featured.category}
              </span>
              <span className="font-body text-[9px] text-[#383838] tracking-widest uppercase">
                {featured.readTime}
              </span>
            </div>
            <h2 className="font-heading font-black text-[#F4F4F4] group-hover:text-[#C0231E] transition-colors text-2xl md:text-4xl uppercase leading-tight mb-3">
              {featured.title}
            </h2>
            <p className="font-body text-[#525252] text-sm leading-relaxed max-w-2xl mb-4">
              {featured.excerpt}
            </p>
            <span className="font-body text-[10px] text-[#C0231E] tracking-[0.18em] uppercase group-hover:underline">
              Read Article →
            </span>
          </div>
        </Link>

        {/* ── Article grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col border border-[#242424] hover:border-[#C0231E]/40 transition-all duration-200 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`font-body text-[9px] tracking-[0.2em] uppercase border px-2 py-0.5 ${CATEGORY_COLORS[post.category] ?? 'text-[#525252] border-[#242424]'}`}>
                  {post.category}
                </span>
                <span className="font-body text-[9px] text-[#383838] tracking-widest uppercase">
                  {post.readTime}
                </span>
              </div>
              <h3 className="font-heading font-black text-[#F4F4F4] group-hover:text-[#C0231E] transition-colors uppercase text-lg leading-tight mb-2">
                {post.title}
              </h3>
              <p className="font-body text-[#525252] text-xs leading-relaxed flex-1 mb-4">
                {post.excerpt}
              </p>
              <span className="font-body text-[10px] text-[#C0231E] tracking-[0.15em] uppercase group-hover:underline">
                Read →
              </span>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
