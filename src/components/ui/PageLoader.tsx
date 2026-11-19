import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export interface PageLoaderProps {
  label?: string;
  fullPage?: boolean;
  minHeight?: number | string;
}

export function PageLoader({
  label = "Loading",
  fullPage = false,
  minHeight = 120,
}: PageLoaderProps) {
  return (
    <Box
      role="status"
      aria-label={label}
      sx={{
        width: "100%",
        minHeight: fullPage ? "60vh" : minHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
      }}
    >
      <CircularProgress size={24} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
