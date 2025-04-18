import * as React from "react";

import { cn } from "../../libs/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
      type={type}
      className={cn(
        "flex h-10 w-full bg-gray-dark rounded-none border-b border-gray-400 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
    
    );
  },
);
Input.displayName = "Input";

export { Input };
