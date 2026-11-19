import { useEffect } from 'react'
import { AppRouter } from '@/routes/AppRouter'

export function App() {
  useEffect(() => {
    const loader = document.getElementById('boot-loader')

    if (!loader) {
      return
    }

    // Hide the static HTML loader after React has rendered its first frame.
    const frame = window.requestAnimationFrame(() => {
      loader.classList.add('is-hidden')
    })

    const timeout = window.setTimeout(() => {
      loader.remove()
    }, 220)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [])

  return <AppRouter />
}
