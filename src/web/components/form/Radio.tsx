import { type ComponentPropsWithRef, forwardRef } from "react";

import { cn } from "@/web/util/style/style";

type RadioProps = Omit<ComponentPropsWithRef<"input">, "type">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type="radio"
      className={cn(
        "size-4 rounded-full border border-border-strong text-primary",
        "focus:ring-2 focus:ring-border-focus focus:ring-offset-2",
        className
      )}
      {...props}
    />
  );
});
