import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart } from 'lucide-react'

export function SidebarSkeleton() {
  return (
    <div className="h-screen w-20 bg-[#034621] flex flex-col items-center mr-10">
      <div className="pt-4">
        <ShoppingCart className="h-8 w-8 text-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center space-y-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-12 h-12 rounded-full bg-white/20" />
        ))}
      </div>
      <div className="pb-4">
        <Skeleton className="w-12 h-12 rounded-full bg-white/20" />
      </div>
    </div>
  )
}

