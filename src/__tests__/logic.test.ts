import { describe, it, expect } from 'vitest'
import { profileByScore, sumScore, encodeState, decodeState, Answer } from '../logic'

describe('profileByScore', () => {
  it('maps thresholds correctly', () => {
    expect(profileByScore(18).key).toBe('靈氣充盈型')
    expect(profileByScore(13).key).toBe('氣血雙虛型')
    expect(profileByScore(9).key).toBe('陰虛火旺型')
    expect(profileByScore(7).key).toBe('陽氣不足型')
    expect(profileByScore(6).key).toBe('氣鬱體滯型')
  })
})

describe('sumScore', () => {
  it('ignores Q7 in total', () => {
    const mock: Answer[] = [
      { qid: 'Q1', title: '', option: { key: 'A', label: '', score: 3 } },
      { qid: 'Q7', title: '', option: { key: 'A', label: '', } },
      { qid: 'Q2', title: '', option: { key: 'C', label: '', score: 1 } },
    ]
    expect(sumScore(mock)).toBe(4)
  })
})

describe('encode/decode', () => {
  it('roundtrips JSON data', () => {
    const payload = { a: 1, b: '測試' }
    const enc = encodeState(payload)
    const dec = decodeState(enc)
    expect(dec.a).toBe(1)
    expect(dec.b).toBe('測試')
  })
})
