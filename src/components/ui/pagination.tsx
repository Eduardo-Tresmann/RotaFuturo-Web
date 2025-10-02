import * as React from "react"
import { cn } from "@/lib/utils"
interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav className="flex w-full justify-center mt-4" role="navigation" aria-label="Paginação">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            className={cn(
              "px-3 py-1 rounded-l border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100",
              page === 1 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            &lt;
          </button>
        </li>
        {Array.from({ length: totalPages }).map((_, i) => (
          <li key={i}>
            <button
              className={cn(
                "px-3 py-1 border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100",
                page === i + 1 && "bg-zinc-200 font-bold"
              )}
              onClick={() => onPageChange(i + 1)}
              aria-current={page === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            className={cn(
              "px-3 py-1 rounded-r border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100",
              page === totalPages && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Próxima página"
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  )
}
