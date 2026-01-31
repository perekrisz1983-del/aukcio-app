"use client";

import * as React from "react";
import { Button as ShadcnButton, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends ButtonProps {
  // No additional props needed for now
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    // Apply custom hover for the default (primary) variant
    const customClassName = variant === "default" 
      ? cn("hover:bg-[hsl(var(--primary-hover))] ", className) 
      : className;

    return (
      <ShadcnButton
        ref={ref}
        className={customClassName}
        variant={variant}
        {...props}
      />
    );
  }
);
CustomButton.displayName = "CustomButton";

export { CustomButton };