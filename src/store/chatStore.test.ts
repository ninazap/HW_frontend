import { describe, it, expect, beforeEach } from 'vitest'
import { useChatStore } from './chatStore'
import type { Message } from '../types/message'

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({
      chats: [],
      activeChatId: null,
      isLoading: false,
      error: null,
    })
  })

  it('CREATE_CHAT: создаёт новый чат с уникальным id', () => {
    const state = useChatStore.getState()
    const chatId = state.createChat('Тестовый чат')
    
    const { chats } = useChatStore.getState()
    expect(chats).toHaveLength(1)
    expect(chats[0].id).toBe(chatId)
    expect(chats[0].title).toBe('Тестовый чат')
    expect(chats[0].messages).toEqual([])
  })

  it('ADD_MESSAGE: добавляет сообщение в чат', () => {
    const state = useChatStore.getState()
    const chatId = state.createChat()
    
    const message: Message = {
      id: 1,
      role: 'user',
      content: 'Привет',
      timestamp: new Date(),
    }
    
    state.addMessage(chatId, message)
    
    const { chats } = useChatStore.getState()
    expect(chats[0].messages).toHaveLength(1)
    expect(chats[0].messages[0].content).toBe('Привет')
  })

  it('DELETE_CHAT: удаляет чат из массива', () => {
    const state = useChatStore.getState()
    const chatId = state.createChat()
    
    state.deleteChat(chatId)
    
    const { chats } = useChatStore.getState()
    expect(chats).toHaveLength(0)
  })

  it('RENAME_CHAT: обновляет название чата', () => {
    const state = useChatStore.getState()
    const chatId = state.createChat('Старое название')
    
    state.updateChatTitle(chatId, 'Новое название')
    
    const { chats } = useChatStore.getState()
    expect(chats[0].title).toBe('Новое название')
  })
})
