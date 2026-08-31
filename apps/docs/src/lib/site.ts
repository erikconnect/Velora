/** Public surface URLs — keep in sync with docs/project/DEPLOY.md */
export const SITE = {
  showcase: "https://veloracss.io",
  docs: "https://docs.veloracss.io",
  github: "https://github.com/erikconnect/Velora",
  /** Hostinger VPS — WordPress + static host examples (configure when live) */
  examples: "https://examples.veloracss.io",
} as const;

export function showcaseUrl(path = ""): string {
  if (!path) return SITE.showcase;
  return `${SITE.showcase}${path.startsWith("/") ? path : `/${path}`}`;
}
