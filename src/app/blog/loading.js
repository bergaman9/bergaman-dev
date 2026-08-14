import { SkeletonBox } from '@/app/components/Skeleton';

export default function Loading() {
  return (
    <div className="page-content py-10" aria-busy="true" aria-label="Loading writing">
      <div className="mb-8 max-w-xl"><SkeletonBox className="mb-3 h-10 w-40" /><SkeletonBox className="h-5 w-full" /></div>
      <div className="mb-10 grid max-w-xl grid-cols-2 gap-4"><SkeletonBox className="h-20 w-full" /><SkeletonBox className="h-20 w-full" /></div>
      <div className="mb-8 grid gap-4 rounded-xl border border-[#3e503e]/30 bg-[#2e3d29]/20 p-5 md:grid-cols-[1fr_16rem]"><SkeletonBox className="h-14 w-full" /><SkeletonBox className="h-14 w-full" /></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="overflow-hidden rounded-xl border border-[#3e503e]/30"><SkeletonBox className="h-48 w-full" rounded="rounded-none" /><div className="space-y-3 p-4"><SkeletonBox className="h-5 w-4/5" /><SkeletonBox className="h-4 w-full" /><SkeletonBox className="h-4 w-3/5" /></div></div>)}</div>
    </div>
  );
}
