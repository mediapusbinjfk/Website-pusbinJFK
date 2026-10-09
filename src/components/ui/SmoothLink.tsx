"use client";

import React, { useRef } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SmoothLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

/**
 * MVP Smooth Link: wraps Next.js Link with a CSS-class fade-out before navigation.
 * The page-in animation is handled by PageTransition on the incoming page.
 */
export const SmoothLink: React.FC<SmoothLinkProps> = ({
  href,
  children,
  className,
  ...props
}) => {
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only intercept left-click without modifiers
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();

    // Add leaving class to body for global overlay effect
    document.documentElement.classList.add("page-leaving");

    setTimeout(() => {
      document.documentElement.classList.remove("page-leaving");
      router.push(href.toString());
    }, 250);
  };

  return (
    <Link ref={linkRef} href={href} className={cn(className)} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};
