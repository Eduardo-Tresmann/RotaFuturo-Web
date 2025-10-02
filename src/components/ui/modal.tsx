import * as React from "react"
import { cn } from "@/lib/utils"
interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: React.ReactNode
}
export function Modal({ open, onOpenChange, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-700"
          onClick={() => onOpenChange(false)}
          aria-label="Fechar"
        >
          ×
        </button>
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
