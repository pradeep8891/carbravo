import { Container, Stack, Typography } from '@mui/material'

export function FoundationPage() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2} sx={{ py: 8 }}>
        <Typography variant="overline" color="primary">
          CarBravo frontend foundation
        </Typography>
        <Typography variant="h3" component="h1">
          Architecture skeleton is ready
        </Typography>
        <Typography color="text.secondary">
          This is a minimal technical placeholder, not a product screen. Build approved features
          within their own feature modules.
        </Typography>
      </Stack>
    </Container>
  )
}
