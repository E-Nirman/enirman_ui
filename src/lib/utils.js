import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/*
 * cn — merge Tailwind classes safely.
 *
 * Resolves class conflicts (e.g. `px-2` vs `px-4`) by keeping the last
 * one, so overrides passed via props always win. This is the same
 * helper shadcn-vue uses in every component; standardizing on it keeps
 * our composed components consistent.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
