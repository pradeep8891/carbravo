import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FoundationPage } from './FoundationPage'

describe('FoundationPage', () => {
  it('renders the foundation placeholder', () => {
    render(<FoundationPage />)
    expect(screen.getByRole('heading', { name: /architecture skeleton is ready/i })).toBeInTheDocument()
  })
})
