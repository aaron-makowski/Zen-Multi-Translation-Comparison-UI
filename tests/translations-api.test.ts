import { describe, it, expect } from 'vitest'
import { GET } from '../app/api/v1/translations/route'

describe('GET /api/v1/translations', () => {
  it('returns Platform Sutra verse translations', async () => {
    const res = await GET(
      new Request('http://localhost/api/v1/translations?book=platform-sutra&verseId=1')
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual([
      { translator: 'red_pine', text: 'Bodhi is originally no tree,' },
      { translator: 'conze', text: 'Bodhi originally has no tree,' },
      { translator: 'red_pine', text: 'the bright mirror has no stand,' },
      { translator: 'conze', text: 'the bright mirror is no stand,' },
      { translator: 'red_pine', text: 'Buddha nature is always clean and pure,' },
      { translator: 'conze', text: 'Originally there is not a single thing,' },
      { translator: 'red_pine', text: 'where would dust alight?' },
      { translator: 'conze', text: 'Where can dust alight?' },
    ])
  })

  it('returns Heart Sutra verse translations', async () => {
    const res = await GET(
      new Request('http://localhost/api/v1/translations?book=heart-sutra&verseId=1')
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual([
      {
        translator: 'red_pine',
        text:
          'Avalokiteshvara Bodhisattva, practicing deep prajna paramita, clearly saw that all five skandhas are empty, thus relieving all suffering and distress.',
      },
      {
        translator: 'conze',
        text:
          'When Bodhisattva Avalokiteshvara was practicing the profound Prajnaparamita, he perceived that all five skandhas are empty, thereby transcending all suffering.',
      },
    ])
  })

  it('returns Diamond Sutra verse translations', async () => {
    const res = await GET(
      new Request('http://localhost/api/v1/translations?book=diamond-sutra&verseId=1')
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual([
      {
        translator: 'red_pine',
        text:
          "Thus have I heard. Once the Buddha dwelt in Anathapindika's park in Jetavana at Sravasti.",
      },
      {
        translator: 'conze',
        text:
          'Thus I have heard. Once upon a time the Lord dwelt at Shravasti in the Jetavana monastery of Anathapindika.',
      },
    ])
  })

  it('returns 404 for unknown book', async () => {
    const res = await GET(
      new Request('http://localhost/api/v1/translations?book=unknown&verseId=1')
    )
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'Book not found' })
  })

  it('returns 404 for missing verse', async () => {
    const res = await GET(
      new Request('http://localhost/api/v1/translations?book=platform-sutra&verseId=999')
    )
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'Verse not found' })
  })
})

