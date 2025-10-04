"use client"

import type { SearchHistory } from "@/lib/types"
import { Clock, Trash2 } from "lucide-react"

interface HistoryListProps {
  history: SearchHistory[]
  onSelectTerm: (term: string) => void
  onClearHistory: () => void
}

export function HistoryList({ history, onSelectTerm, onClearHistory }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No search history yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Start searching for images to build your history</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Search History</h2>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" />
          Clear History
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((item, index) => (
          <button
            key={`${item.term}-${index}`}
            onClick={() => onSelectTerm(item.term)}
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-foreground hover:shadow-md"
          >
            <Clock className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{item.term}</p>
              <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
