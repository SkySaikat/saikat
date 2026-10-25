"use client";

import { useEffect } from "react";

// Adds .in to every .reveal element as it scrolls into view. Without JS the
// elements are never hidden (see html.js .reveal in globals.css).
export default function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const observe = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    observe();
    // Pick up elements rendered later (client navigation, drawers).
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
