"use client";

// React 19's <ViewTransition> is available via the App Router in Next.js 16.
// It activates automatically during route navigations (which are React Transitions).
// See: node_modules/next/dist/docs/01-app/02-guides/view-transitions.md
import { ViewTransition } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps page content with React's <ViewTransition> for smooth View Transitions API animation.
 * The page-content view-transition-class receives fade + 10px slide animations defined in globals.css.
 * Falls back to the .page-transition CSS animation on browsers that don't support View Transitions API.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  return (
    <ViewTransition default="slide-in">
      <div className={`page-transition w-full ${className ?? ""}`}>
        {children}
      </div>
    </ViewTransition>
  );
};
