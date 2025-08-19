import { cn } from "@/lib/utils";

interface FormLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function FormLabel({ children, htmlFor, required, className }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-semibold text-zinc-700 mb-2",
        required && "after:content-['*'] after:ml-0.5 after:text-red-500",
        className
      )}
    >
      {children}
    </label>
  );
}