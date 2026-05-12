export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-[#111111] border border-[#242424] overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-square bg-[#1C1C1C]" />

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Brand */}
        <div className="h-2 w-16 bg-[#242424] rounded-sm" />
        {/* Name */}
        <div className="h-3 w-3/4 bg-[#242424] rounded-sm" />
        {/* Colorway */}
        <div className="h-2 w-1/2 bg-[#1C1C1C] rounded-sm" />

        {/* Price row */}
        <div className="flex items-end justify-between mt-2">
          <div className="space-y-1.5">
            <div className="h-2 w-20 bg-[#1C1C1C] rounded-sm" />
            <div className="h-5 w-24 bg-[#242424] rounded-sm" />
          </div>
          <div className="space-y-1.5 items-end flex flex-col">
            <div className="h-2 w-14 bg-[#1C1C1C] rounded-sm" />
            <div className="h-4 w-20 bg-[#242424] rounded-sm" />
          </div>
        </div>

        {/* CTA button */}
        <div className="h-11 w-full bg-[#1C1C1C] rounded-sm mt-1" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
