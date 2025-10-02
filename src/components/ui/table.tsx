import * as React from "react"
import { cn } from "@/lib/utils"
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(
  ({ className, ...props }, ref) => (
  <div className="relative w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm text-zinc-800 dark:text-zinc-100 font-sans",
        "[&_thead]:bg-zinc-50 dark:[&_thead]:bg-zinc-800 [&_thead]:text-zinc-700 dark:[&_thead]:text-zinc-300 [&_thead]:font-semibold",
        "[&_tbody_tr:nth-child(even)]:bg-zinc-50 dark:[&_tbody_tr:nth-child(even)]:bg-zinc-800 [&_tbody_tr:hover]:bg-zinc-100 dark:[&_tbody_tr:hover]:bg-zinc-700",
        "[&_tfoot]:bg-zinc-100 dark:[&_tfoot]:bg-zinc-800 [&_tfoot]:font-medium",
        className
      )}
      {...props}
    />
  </div>
))
Table.displayName = "Table"
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(
  ({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-zinc-300/70 dark:bg-neutral-800",
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(
  ({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(
  ({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-gray-100 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(
  ({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition-colors hover:bg-gray-100 dark:hover:bg-neutral-900 data-[state=selected]:bg-blue-50",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(
  ({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 font-bold text-left align-middle  text-zinc-800 dark:text-zinc-100 border-b border-gray-200 bg-zinc-200 dark:bg-neutral-800 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(
  ({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 align-middle  text-zinc-900 dark:text-zinc-100 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(
  ({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-gray-500", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
