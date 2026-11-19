import { createBrowserRouter, RouterProvider } from 'react-router'
import { FoundationPage } from '@/app/FoundationPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <FoundationPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
