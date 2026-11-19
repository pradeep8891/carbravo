import Chip, { type ChipProps } from "@mui/material/Chip";
import type { ReactNode } from "react";

export type StatusTone = "neutral" | "success" | "warning" | "error" | "info";

export interface StatusChipProps {
  label: ReactNode;
  tone?: StatusTone;
  size?: ChipProps["size"];
}

const toneColor: Record<StatusTone, NonNullable<ChipProps["color"]>> = {
  neutral: "default",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
};

export function StatusChip({
  label,
  tone = "neutral",
  size = "small",
}: StatusChipProps) {
  return (
    <Chip
      label={label}
      color={toneColor[tone]}
      size={size}
      aria-label={typeof label === "string" ? label : undefined}
    />
  );
}
