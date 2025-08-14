"use client"
interface Translation {
  id: string
  text: string
  translator: string
  language: string
}

export function TranslationAnalytics({ translation, verseId }: { translation: Translation; verseId: string }) {
  function handleSelect() {
    fetch("/api/verse-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, translationId: translation.id, eventType: "select" })
    })
  }
  return (
    <div
      onClick={handleSelect}
      className="border-b pb-4 last:border-b-0 last:pb-0 cursor-pointer"
    >
      <h3 className="font-medium text-lg mb-2">Translation by {translation.translator}</h3>
      <p className="text-gray-800 whitespace-pre-line">{translation.text}</p>
      <p className="text-sm text-gray-500 mt-2">Language: {translation.language}</p>
    </div>
  )
}
