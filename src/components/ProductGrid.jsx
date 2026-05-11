import FilterableGrid from './FilterableGrid'

async function getProducts(category) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${category}&available=true`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

function SectionHeader({ label, title }) {
  return (
    <div className="mb-6 pb-5 border-b border-[#242424]">
      <p className="font-body text-[#C0231E] text-[10px] tracking-[0.22em] uppercase mb-2">
        {label}
      </p>
      <h2
        className="font-heading font-black text-[#F4F4F4] uppercase leading-none"
        style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
      >
        {title}
      </h2>
    </div>
  )
}

export default async function ProductGrid() {
  const [sneakers, caps] = await Promise.all([
    getProducts('sneakers'),
    getProducts('caps'),
  ])

  return (
    <section id="drops" className="bg-[#0A0A0A] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Sneakers */}
        <div id="sneakers" className="mb-20 md:mb-28">
          <SectionHeader label="Drop 001" title="Sneakers" />
          {sneakers.length === 0 ? (
            <p className="font-body text-[#525252] text-sm">No sneakers available right now.</p>
          ) : (
            <FilterableGrid products={sneakers} />
          )}
        </div>

        {/* Caps */}
        <div id="caps">
          <SectionHeader label="New Era Collection" title="Caps" />
          {caps.length === 0 ? (
            <p className="font-body text-[#525252] text-sm">No caps available right now.</p>
          ) : (
            <FilterableGrid products={caps} />
          )}
        </div>

      </div>
    </section>
  )
}
