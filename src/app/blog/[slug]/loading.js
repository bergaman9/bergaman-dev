import { SkeletonBox, SkeletonText } from '@/app/components/Skeleton';

export default function Loading() {
  return <div className="page-content pb-16 pt-6" aria-busy="true" aria-label="Loading article"><div className="mx-auto max-w-5xl"><div className="mb-4 flex gap-3"><SkeletonBox className="h-7 w-24" rounded="rounded-full" /><SkeletonBox className="h-7 w-28" rounded="rounded-full" /></div><SkeletonBox className="mb-3 h-12 w-11/12" /><SkeletonBox className="mb-6 h-12 w-2/3" /><SkeletonBox className="mb-8 h-6 w-4/5" /><SkeletonBox className="mb-8 aspect-[2/1] w-full" /><div className="rounded-xl border border-[#3e503e]/30 bg-[#2e3d29]/20 p-6"><SkeletonText lines={10} /></div></div></div>;
}
