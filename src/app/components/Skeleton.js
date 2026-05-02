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
