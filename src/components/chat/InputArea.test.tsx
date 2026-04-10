import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputArea from './InputArea'

describe('InputArea', () => {
  const mockOnSend = vi.fn()
  const mockOnStop = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('кнопка "Отправить" заблокирована при пустом поле', () => {
    render(<InputArea onSend={mockOnSend} onStop={mockOnStop} disabled={false} />)

    const sendButton = screen.getByRole('button', { name: /➤/i })
    expect(sendButton).toBeDisabled()
  })

  it('отправка по клику на кнопку "Отправить"', async () => {
    const user = userEvent.setup()
    render(<InputArea onSend={mockOnSend} onStop={mockOnStop} disabled={false} />)

    const textarea = screen.getByPlaceholderText(/введите сообщение/i)
    const sendButton = screen.getByRole('button', { name: /➤/i })

    await user.type(textarea, 'Тестовое сообщение')
    await user.click(sendButton)

    expect(mockOnSend).toHaveBeenCalledWith('Тестовое сообщение')
  })

  it('отправка по нажатию Enter', async () => {
    const user = userEvent.setup()
    render(<InputArea onSend={mockOnSend} onStop={mockOnStop} disabled={false} />)

    const textarea = screen.getByPlaceholderText(/введите сообщение/i)

    await user.type(textarea, 'Сообщение{Enter}')

    expect(mockOnSend).toHaveBeenCalledWith('Сообщение')
  })

  it('при isLoading=true отображается кнопка "Стоп", поле ввода активно', () => {
    render(<InputArea onSend={mockOnSend} onStop={mockOnStop} disabled={true} />)

    const textarea = screen.getByPlaceholderText(/введите сообщение/i)
    expect(textarea).not.toBeDisabled() // поле должно быть активным для следующего сообщения

    const stopButton = screen.getByRole('button', { name: /стоп/i })
    expect(stopButton).toBeInTheDocument()

    const sendButton = screen.queryByRole('button', { name: /➤/i })
    expect(sendButton).not.toBeInTheDocument()
  })
})
