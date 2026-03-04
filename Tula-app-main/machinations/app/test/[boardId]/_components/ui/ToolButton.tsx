"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/canvas";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  background?: string
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
  background = "black"
}: ToolButtonProps) => {
  return (
    <Hint label={label}>
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size="icon"
        className={cn(
          "m-1 transition-colors",
          isActive
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : `bg-${background}`
        )}
        style={{ background: !isActive ? background : undefined }}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
