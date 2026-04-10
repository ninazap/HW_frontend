import { describe, it, expect, vi, beforeEach } from 'vitest'
import { storage } from './storage'

describe('localStorage утилиты', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockClear()
    localStorage.setItem.mockClear()
    localStorage.removeItem.mockClear()
  })

  it('get: читает данные из localStorage', () => {
    const mockData = { key: 'value' }
    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))
    
    const result = storage.get('test-key')
    
    expect(localStorage.getItem).toHaveBeenCalledWith('test-key')
    expect(result).toEqual(mockData)
  })

  it('get: возвращает null при отсутствии данных', () => {
    localStorage.getItem.mockReturnValue(null)
    
    const result = storage.get('non-existent')
    
    expect(result).toBeNull()
  })

  it('get: возвращает null при невалидном JSON', () => {
    localStorage.getItem.mockReturnValue('invalid{json')
    
    const result = storage.get('bad-json')
    
    expect(result).toBeNull()
  })

  it('set: записывает данные в localStorage', () => {
    const data = { foo: 'bar' }
    
    storage.set('test-key', data)
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify(data)
    )
  })

  it('remove: удаляет данные из localStorage', () => {
    storage.remove('test-key')
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('test-key')
  })
})
