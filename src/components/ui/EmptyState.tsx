import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  minHeight?: number | string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  minHeight = 160,
}: EmptyStateProps) {
  return (
    <Box
      role="status"
      sx={{
        width: "100%",
        minHeight,
        px: 3,
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {icon && (
        <Box
          aria-hidden="true"
          sx={{
            width: 40,
            height: 40,
            mb: 2,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
            color: "text.secondary",
          }}
        >
          {icon}
        </Box>
      )}

      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, maxWidth: 480 }}
        >
          {description}
        </Typography>
      )}

      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Box>
  );
}
