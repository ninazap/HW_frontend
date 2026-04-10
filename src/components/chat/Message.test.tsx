import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Message from './Message'

describe('Message', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('variant="user": отображает текст и класс пользователя', () => {
    render(<Message text="Привет от пользователя" variant="user" />)
    
    expect(screen.getByText('Привет от пользователя')).toBeInTheDocument()
    expect(screen.getByText('Вы')).toBeInTheDocument()
  })

  it('variant="assistant": отображает текст и класс ассистента', () => {
    render(<Message text="Привет от ассистента" variant="assistant" />)
    
    expect(screen.getByText('Привет от ассистента')).toBeInTheDocument()
    expect(screen.getByText('GigaChat')).toBeInTheDocument()
  })

  it('кнопка "Копировать" только для assistant', () => {
    const { container: userContainer } = render(<Message text="Текст" variant="user" />)
    const { container: assistantContainer } = render(<Message text="Текст" variant="assistant" />)
    
    expect(userContainer.querySelector('.copy-btn')).not.toBeInTheDocument()
    expect(assistantContainer.querySelector('.copy-btn')).toBeInTheDocument()
  })

  it('копирование текста по клику', async () => {
    const user = userEvent.setup()
    render(<Message text="Текст для копирования" variant="assistant" />)
    
    const copyButton = screen.getByRole('button', { name: /📋/i })
    await user.click(copyButton)
    
    expect(screen.getByText('✓ Скопировано')).toBeInTheDocument()
  })
})
