import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: ReactNode;
  description?: ReactNode;
  onRetry?: () => void;
  retryLabel?: ReactNode;
  fullPage?: boolean;
}

export function ErrorState({
  title = "Unable to load this information",
  description = "Something went wrong. Please try again.",
  onRetry,
  retryLabel = "Try again",
  fullPage = false,
}: ErrorStateProps) {
  return (
    <Box
      role="alert"
      sx={{
        width: "100%",
        minHeight: fullPage ? "60vh" : 160,
        px: 3,
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 44,
          height: 44,
          mb: 2,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "error.light",
          color: "error.dark",
        }}
      >
        <ErrorOutlineRounded />
      </Box>

      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5, maxWidth: 480 }}
      >
        {description}
      </Typography>

      {onRetry && (
        <Button
          variant="outline"
          size="small"
          startIcon={<RefreshRounded />}
          onClick={onRetry}
          sx={{ mt: 3 }}
        >
          {retryLabel}
        </Button>
      )}
    </Box>
  );
}
