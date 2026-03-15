/**
 * Slug utility — generates a URL-safe wedding slug from couple names.
 *
 * Example:
 *   generateSlug('Priya', 'Rahul') → 'priya-rahul-k8j2'
 *   generateSlug('María José', 'Arjun') → 'maria-jose-arjun-x3f1'
 */
export function generateSlug(brideName: string, groomName: string): string {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')                        // decompose accented chars
      .replace(/[\u0300-\u036f]/g, '')         // strip diacritics
      .replace(/[^a-z0-9\s-]/g, '')            // remove non-alphanumeric
      .trim()
      .replace(/\s+/g, '-')                    // spaces → hyphens

  const base   = `${normalize(brideName)}-${normalize(groomName)}`
  const suffix = Math.random().toString(36).substring(2, 6)  // 4 random chars
  return `${base}-${suffix}`
}

/**
 * Format a date string for display (locale-aware).
 * Example: '2024-11-15' → 'November 15, 2024'
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

/**
 * Format a time string for display.
 * Example: '18:30:00' → '6:30 PM'
 */
export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number)
  const date   = new Date()
  date.setHours(h, m, 0, 0)
  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

/**
 * Build a WhatsApp deep link with a pre-filled message.
 * Uses wa.me — works without WhatsApp Business API.
 */
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}
