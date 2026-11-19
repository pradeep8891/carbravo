import type { PropsWithChildren } from 'react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { appQueryClient } from '@/lib/query-client'
import { appTheme } from '@/theme'
import { ThemeModeProvider } from './ThemeModeProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={appQueryClient}>
      <ThemeModeProvider>
        <MuiThemeProvider theme={appTheme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ThemeModeProvider>
    </QueryClientProvider>
  )
}
