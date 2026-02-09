"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

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
        style={{ margin: "1px", background: background }}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
