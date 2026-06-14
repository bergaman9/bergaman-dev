"use client";

import { Fragment } from "react";
import PageHeader from "./PageHeader";

export function SkeletonBox({ className = "", rounded = "rounded-lg" }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer ${rounded} ${className}`}
    />
  );
}

export function SkeletonText({ lines = 3, className = "", widths }) {
  const defaultWidths = ["w-full", "w-11/12", "w-4/5", "w-2/3"];

  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBox
          key={index}
          className={`h-4 ${widths?.[index] || defaultWidths[index % defaultWidths.length]}`}
          rounded="rounded"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  imageHeight = "h-48",
  rows = 3,
  footer = true,
  className = "",
  showImage = true,
}) {
  return (
    <div className={`skeleton-surface overflow-hidden rounded-lg border backdrop-blur-md ${className}`}>
      {showImage && <SkeletonBox className={`${imageHeight} rounded-none`} />}
      <div className="p-4">
        <SkeletonBox className="mb-3 h-6 w-3/4" rounded="rounded" />
        <SkeletonText lines={rows} />
        {footer && (
          <div className="skeleton-divider mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex gap-2">
              <SkeletonBox className="h-6 w-16" rounded="rounded-full" />
              <SkeletonBox className="h-6 w-20" rounded="rounded-full" />
            </div>
            <SkeletonBox className="h-8 w-20" rounded="rounded" />
          </div>
        )}
      </div>
    </div>
  );
}

// Mirrors BlogPostCard: image with overlaid category+title, then a 2-line
// excerpt and a meta row (read time + views/likes/comments).
export function SkeletonBlogCard({ className = "" }) {
  return (
    <div className={`skeleton-surface h-full overflow-hidden rounded-lg border backdrop-blur-md ${className}`} aria-hidden="true">
      <div className="relative h-48">
        <SkeletonBox className="h-full w-full" rounded="rounded-none" />
        <div className="absolute bottom-0 left-0 w-full p-4">
          <SkeletonBox className="mb-2 h-5 w-20" rounded="rounded-full" />
          <SkeletonBox className="h-5 w-3/4" rounded="rounded" />
        </div>
      </div>
      <div className="p-4">
        <SkeletonBox className="mb-2 h-3.5 w-full" rounded="rounded" />
        <SkeletonBox className="mb-4 h-3.5 w-4/5" rounded="rounded" />
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-3 w-16" rounded="rounded" />
          <div className="flex gap-3">
            <SkeletonBox className="h-3 w-8" rounded="rounded" />
            <SkeletonBox className="h-3 w-8" rounded="rounded" />
            <SkeletonBox className="h-3 w-8" rounded="rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mirrors ProjectCard: rounded-[2rem] glass card, h-56 cover, category/date
// row, title, 3-line description, tech chips and an actions row.
export function SkeletonProjectCard({ className = "" }) {
  return (
    <div className={`skeleton-surface flex h-full flex-col overflow-hidden rounded-[2rem] border ${className}`} aria-hidden="true">
      <SkeletonBox className="h-56 w-full" rounded="rounded-none" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between">
          <SkeletonBox className="h-5 w-24" rounded="rounded-md" />
          <SkeletonBox className="h-3 w-16" rounded="rounded" />
        </div>
        <SkeletonBox className="mb-3 h-5 w-2/3" rounded="rounded" />
        <SkeletonText lines={3} className="mb-6" />
        <div className="mb-6 flex gap-2">
          <SkeletonBox className="h-6 w-16" rounded="rounded" />
          <SkeletonBox className="h-6 w-16" rounded="rounded" />
          <SkeletonBox className="h-6 w-12" rounded="rounded" />
        </div>
        <div className="skeleton-divider mt-auto flex items-center gap-3 border-t pt-4">
          <SkeletonBox className="h-10 flex-1" rounded="rounded-xl" />
          <SkeletonBox className="h-10 w-10" rounded="rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Mirrors PickCard grid: vertical 2:3 cover, then title + subtitle.
export function SkeletonPickCard({ className = "" }) {
  return (
    <div className={`skeleton-surface overflow-hidden rounded-xl border ${className}`} aria-hidden="true">
      <SkeletonBox className="aspect-[2/3] w-full" rounded="rounded-none" />
      <div className="space-y-2 p-4">
        <SkeletonBox className="h-4 w-3/4" rounded="rounded" />
        <SkeletonBox className="h-3 w-1/2" rounded="rounded" />
      </div>
    </div>
  );
}

export function PageSkeleton({
  title,
  subtitle,
  icon,
  controls = null,
  layout = "grid",
  itemCount = 6,
  renderItem,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
  listClassName = "space-y-4",
  className = "",
  headerVariant = "default",
}) {
  const wrapperClass = layout === "list" ? listClassName : gridClassName;

  return (
    <div className={className} aria-busy="true">
      {(title || subtitle || icon) && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          variant={headerVariant}
        />
      )}

      {controls && <div className="mb-8">{controls}</div>}

      <div className={wrapperClass}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <Fragment key={index}>
            {renderItem ? renderItem(index) : <SkeletonCard />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ columns = 4, rows = 6, className = "" }) {
  return (
    <div className={`skeleton-surface overflow-hidden rounded-lg border ${className}`} aria-busy="true">
      <div className="skeleton-divider grid gap-4 border-b p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonBox key={index} className="h-4" rounded="rounded" />
        ))}
      </div>
      <div className="divide-y" style={{ borderColor: "var(--skeleton-border, rgba(62, 80, 62, 0.2))" }}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 p-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <SkeletonBox
                key={columnIndex}
                className={`h-4 ${columnIndex === columns - 1 ? "w-2/3" : "w-full"}`}
                rounded="rounded"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
