import { cn } from "@/lib/utils";
import { forwardRef } from "react";
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  required?: boolean;
}
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, required, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-soft hover:shadow-glow",
            error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";