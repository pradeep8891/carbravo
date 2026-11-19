import { createTheme } from '@mui/material/styles'
import { palette } from './palette'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    ...palette,
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
  },
})
