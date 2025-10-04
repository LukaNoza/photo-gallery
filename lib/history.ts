import type { SearchHistory } from "./types"

const HISTORY_KEY = "search_history"

export function getSearchHistory(): SearchHistory[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(HISTORY_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function addToSearchHistory(term: string): void {
  if (typeof window === "undefined" || !term.trim()) return

  const history = getSearchHistory()

  // Remove existing entry if present
  const filtered = history.filter((item) => item.term.toLowerCase() !== term.toLowerCase())

  // Add new entry at the beginning
  const updated = [{ term, timestamp: Date.now() }, ...filtered]

  // Keep only last 50 searches
  const limited = updated.slice(0, 50)

  localStorage.setItem(HISTORY_KEY, JSON.stringify(limited))
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(HISTORY_KEY)
}
