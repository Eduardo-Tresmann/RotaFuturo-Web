import * as React from "react"
import { cn } from "@/lib/utils"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col w-64 min-h-screen border-r bg-[#f6f8fa] px-6 py-10 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

export interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export function SidebarItem({ active, icon, children, className, ...props }: SidebarItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-semibold transition-colors",
        active
          ? "bg-zinc-200 text-zinc-900 shadow-sm"
          : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
        className
      )}
      style={{ minHeight: 56 }}
      {...props}
    >
      {icon && <span className="w-7 h-7 flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}
