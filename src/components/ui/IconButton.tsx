import MuiIconButton, {
  type IconButtonProps as MuiIconButtonProps,
} from "@mui/material/IconButton";

export type IconButtonVariant = "standard" | "soft" | "outlined";

export interface IconButtonProps extends MuiIconButtonProps {
  variant?: IconButtonVariant;
}

export function IconButton({
  variant = "standard",
  size = "medium",
  sx,
  ...props
}: IconButtonProps) {
  return (
    <MuiIconButton
      {...props}
      size={size}
      sx={[
        {
          borderRadius: 1.5,
          ...(variant === "soft" && {
            bgcolor: "action.hover",
            "&:hover": { bgcolor: "action.selected" },
          }),
          ...(variant === "outlined" && {
            border: 1,
            borderColor: "divider",
            "&:hover": { bgcolor: "action.hover" },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
