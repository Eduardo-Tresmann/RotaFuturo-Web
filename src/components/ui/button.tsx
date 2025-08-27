import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95',
  {
    variants: {
      variant: {
  default: 'bg-gradient-to-r from-[#6a5af9] to-[#3b3b7c] text-white px-8 py-4 text-lg shadow-lg hover:scale-105 transition',
        destructive:
          'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-soft hover:shadow-lg',
        outline:
          'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white shadow-soft',
        secondary:
          'bg-gradient-to-r from-zinc-100 to-zinc-200 text-zinc-800 hover:from-zinc-200 hover:to-zinc-300 shadow-soft',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        success:
          'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-soft hover:shadow-glow',
      },
      size: {
        default: 'h-14 rounded-xl px-8 py-4 text-lg',
        sm: 'h-9 rounded-lg px-4 py-2',
        lg: 'h-14 rounded-xl px-8 py-4 text-lg',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
