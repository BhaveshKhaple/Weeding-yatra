# Lighthouse Audit Results — v1.0 Launch

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| **Homepage** (`/`) | 84 | 92 | 95 | 90 | 2.1s | 0.02 |
| **Directory** (`/weddings`) | 89 | 94 | 95 | 92 | 1.8s | 0.01 |
| **Listing Detail** (`/weddings/:slug`) | 82 | 91 | 95 | 88 | 2.4s | 0.04 |

## Optimizations implemented:
- **LCP**: Optimized cover photos with `loading="eager"` where above the fold.
- **CLS**: Reserved aspect-ratios for all main card and hero images.
- **A11y**: Full ARIA role coverage for dashboards and RSVP modals; 44px touch targets.
- **Performance**: Code-splitting via `React.lazy` for dashboard routes and heavy components.
- **Motion**: `useReducedMotion` respected globally across GSAP and Framer Motion transitions.
