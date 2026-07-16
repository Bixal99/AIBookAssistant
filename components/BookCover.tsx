"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

type BookCoverProps = {
  src?: string | null;
  title: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

/** Blob covers often time out via Next image optimizer — load them unoptimized. */
export default function BookCover({
  src,
  title,
  width = 120,
  height = 180,
  className,
  priority,
}: BookCoverProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  if (!showImage) {
    return (
      <div
        className={className}
        style={{ width, height }}
        aria-label={`${title} cover`}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#cbbfa8] bg-[#f4ede0] px-3 text-center">
          <BookOpen className="size-6 text-[var(--landing-maroon)]" />
          <span className="line-clamp-3 text-xs font-medium text-[#6d5f4b]">
            {title}
          </span>
        </div>
      </div>
    );
  }

  const isBlob = src!.includes("blob.vercel-storage.com");

  return (
    <Image
      src={src!}
      alt={title}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={isBlob}
      onError={() => setFailed(true)}
    />
  );
}
