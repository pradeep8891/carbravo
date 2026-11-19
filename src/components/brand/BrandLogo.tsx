import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

export interface BrandLogoProps {
  height?: number
  showProductLabel?: boolean
  alt?: string
}

export function BrandLogo({
  height = 32,
  showProductLabel = false,
  alt = 'CarBravo',
}: BrandLogoProps) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <Box
        component="img"
        src="/logo.svg"
        alt={alt}
        sx={{ display: 'block', width: 'auto', height, objectFit: 'contain' }}
      />
      {showProductLabel && (
        <>
          <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
          <Typography
            component="span"
            variant="overline"
            sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.18em' }}
          >
            Incentives
          </Typography>
        </>
      )}
    </Box>
  )
}
