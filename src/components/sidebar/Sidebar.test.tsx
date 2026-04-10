import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from './Sidebar'
import type { Chat } from '../../store/chatStore'
import { useState } from 'react'

const mockChats: Chat[] = [
  { id: '1', title: 'Чат 1', messages: [], createdAt: 1, updatedAt: 1 },
  { id: '2', title: 'Чат 2', messages: [], createdAt: 1, updatedAt: 1 },
  { id: '3', title: 'Проект React', messages: [], createdAt: 1, updatedAt: 1 },
]

describe('Sidebar', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    chats: mockChats,
    activeChatId: '1',
    onCreateChat: vi.fn(),
    onSelectChat: vi.fn(),
    onDeleteChat: vi.fn(),
    onRenameChat: vi.fn(),
    searchQuery: '',
    onSearchChange: vi.fn(),
  }

  it('отображает все чаты при пустом поиске', () => {
    render(<Sidebar {...defaultProps} searchQuery="" />)
    expect(screen.getByText('Чат 1')).toBeInTheDocument()
    expect(screen.getByText('Чат 2')).toBeInTheDocument()
    expect(screen.getByText('Проект React')).toBeInTheDocument()
  })

  it('фильтрует чаты по названию', () => {
    render(<Sidebar {...defaultProps} searchQuery="React" />)
    expect(screen.getByText('Проект React')).toBeInTheDocument()
    expect(screen.queryByText('Чат 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Чат 2')).not.toBeInTheDocument()
  })

  it('вызывает onSearchChange при вводе в поиск', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()
    
    // Обёртка для обновления searchQuery при вводе
    const Wrapper = () => {
      const [searchQuery, setSearchQuery] = useState('')
      const handleSearchChange = (query: string) => {
        onSearchChange(query)
        setSearchQuery(query)
      }
      return (
        <Sidebar
          isOpen={true}
          onClose={vi.fn()}
          chats={mockChats}
          activeChatId="1"
          onCreateChat={vi.fn()}
          onSelectChat={vi.fn()}
          onDeleteChat={vi.fn()}
          onRenameChat={vi.fn()}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      )
    }
    
    render(<Wrapper />)
    const searchInput = screen.getByPlaceholderText(/поиск чатов/i)
    await user.type(searchInput, 'тест')
    
    expect(onSearchChange).toHaveBeenLastCalledWith('тест')
  })

  it('кнопка "Новый чат" вызывает onCreateChat', async () => {
    const user = userEvent.setup()
    render(<Sidebar {...defaultProps} />)
    const newChatButton = screen.getByText(/новый чат/i)
    await user.click(newChatButton)
    expect(defaultProps.onCreateChat).toHaveBeenCalled()
  })
})
