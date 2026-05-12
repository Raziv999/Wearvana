import { notFound } from 'next/navigation'
import Link from 'next/link'
import { blogPosts } from '@/data/blogPosts'

const BASE_URL = 'https://getwearvana.com'

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Post Not Found | Wearvana Blog' }

  return {
    title: `${post.title} | Wearvana Blog`,
    description: post.excerpt,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${post.slug}`,
      siteName: 'Wearvana',
      type: 'article',
      publishedTime: post.date,
    },
  }
}

const CATEGORY_COLORS = {
  Drops:   'text-[#C0231E] border-[#C0231E]/30',
  Guides:  'text-[#34D399] border-[#34D399]/30',
  Culture: 'text-[#FBBF24] border-[#FBBF24]/30',
}

export default function BlogPostPage({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) notFound()

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Wearvana' },
    publisher: {
      '@type': 'Organization',
      name: 'Wearvana',
      url: BASE_URL,
    },
    url: `${BASE_URL}/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#0A0A0A] text-[#F4F4F4]">

        {/* ── Back nav ── */}
        <div className="border-b border-[#1C1C1C]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <Link
              href="/blog"
              className="font-body text-[10px] text-[#525252] hover:text-[#F4F4F4] tracking-[0.18em] uppercase transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>

        {/* ── Article header ── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">

          <div className="flex items-center gap-3 mb-5">
            <span className={`font-body text-[9px] tracking-[0.2em] uppercase border px-2 py-1 ${CATEGORY_COLORS[post.category] ?? 'text-[#525252] border-[#242424]'}`}>
              {post.category}
            </span>
            <span className="font-body text-[9px] text-[#383838] tracking-widest uppercase">
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="font-body text-[9px] text-[#383838] tracking-widest uppercase">
              · {post.readTime}
            </span>
          </div>

          <h1 className="font-heading font-black text-[#F4F4F4] text-3xl md:text-5xl uppercase leading-tight mb-4">
            {post.title}
          </h1>

          <p className="font-body text-[#525252] text-base leading-relaxed border-l-2 border-[#C0231E] pl-4 mb-10">
            {post.excerpt}
          </p>

          {/* ── Article body ── */}
          <article className="space-y-8">
            {post.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-heading font-black text-[#F4F4F4] text-xl md:text-2xl uppercase mb-3">
                  {section.heading}
                </h2>
                <div className="space-y-3">
                  {section.body.split('\n\n').map((para, j) => (
                    <p key={j} className="font-body text-[#909090] text-sm md:text-base leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </article>

          {/* ── CTA ── */}
          <div className="mt-12 border border-[#242424] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-heading font-black text-[#F4F4F4] uppercase text-lg mb-1">
                Ready to Pre-Order?
              </p>
              <p className="font-body text-[#525252] text-xs">
                Browse current drops. 50% advance via eSewa or Khalti. Authentic. Delivered in Nepal.
              </p>
            </div>
            <Link
              href="/#drops"
              className="shrink-0 bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-bold text-[10px] tracking-[0.18em] uppercase px-6 py-3 transition-colors"
            >
              Browse Drops →
            </Link>
          </div>

          {/* ── Related posts ── */}
          {related.length > 0 && (
            <div className="mt-12">
              <p className="font-body text-[9px] text-[#383838] tracking-[0.25em] uppercase mb-4">
                More Articles
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group border border-[#242424] hover:border-[#C0231E]/40 p-4 transition-all duration-200"
                  >
                    <span className={`font-body text-[8px] tracking-[0.2em] uppercase border px-1.5 py-0.5 mr-2 ${CATEGORY_COLORS[r.category] ?? 'text-[#525252] border-[#242424]'}`}>
                      {r.category}
                    </span>
                    <p className="font-heading font-black text-[#F4F4F4] group-hover:text-[#C0231E] uppercase text-sm leading-tight mt-2 transition-colors">
                      {r.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  )
}
