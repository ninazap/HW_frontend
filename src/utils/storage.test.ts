import { describe, it, expect, vi, beforeEach } from 'vitest'
import { storage } from './storage'

describe('localStorage утилиты', () => {
  const mockGetItem = vi.spyOn(localStorage, 'getItem')
  const mockSetItem = vi.spyOn(localStorage, 'setItem')
  const mockRemoveItem = vi.spyOn(localStorage, 'removeItem')

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetItem.mockClear()
    mockSetItem.mockClear()
    mockRemoveItem.mockClear()
  })

  it('get: читает данные из localStorage', () => {
    const mockData = { key: 'value' }
    mockGetItem.mockReturnValue(JSON.stringify(mockData))
    
    const result = storage.get('test-key')
    
    expect(mockGetItem).toHaveBeenCalledWith('test-key')
    expect(result).toEqual(mockData)
  })

  it('get: возвращает null при отсутствии данных', () => {
    mockGetItem.mockReturnValue(null)
    expect(storage.get('non-existent')).toBeNull()
  })

  it('get: возвращает null при невалидном JSON', () => {
    mockGetItem.mockReturnValue('invalid{json')
    expect(storage.get('bad-json')).toBeNull()
  })

  it('set: записывает данные в localStorage', () => {
    storage.set('test-key', { foo: 'bar' })
    expect(mockSetItem).toHaveBeenCalledWith('test-key', '{"foo":"bar"}')
  })

  it('remove: удаляет данные из localStorage', () => {
    storage.remove('test-key')
    expect(mockRemoveItem).toHaveBeenCalledWith('test-key')
  })
})
