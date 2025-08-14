import Link from "next-intl/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">About Zen Texts Translation Comparison</h1>

        <div className="prose max-w-none">
          <p className="mb-4">
            This project aims to provide a platform for exploring and comparing different translations of classic Zen
            texts. By presenting multiple translations side by side, readers can gain a deeper understanding of these
            profound works.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">The Xinxin Ming</h2>
          <p className="mb-4">
            The Xinxin Ming (信心銘), often translated as &quot;Faith in Mind&quot; or &quot;Trust in Mind,&quot; is a classic Chinese Zen
            poem attributed to the Third Patriarch of Zen, Jianzhi Sengcan (鑑智僧璨). Written in the 7th century, this
            text is one of the earliest and most influential texts in the Zen tradition.
          </p>
          <p className="mb-4">
            The poem consists of 146 lines of four characters each, and it expresses the essence of Zen teaching in a
            concise and poetic form. It emphasizes non-dualism, the unity of all things, and the importance of
            transcending conceptual thinking.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Translation Comparison</h2>
          <p className="mb-4">
            Different translators bring their own understanding, background, and linguistic choices to their
            translations. By comparing multiple translations, readers can:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Gain a more nuanced understanding of the original text</li>
            <li>See different interpretations of challenging passages</li>
            <li>Appreciate the richness and depth of the original work</li>
            <li>Develop their own insights based on multiple perspectives</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Future Development</h2>
          <p className="mb-4">This project is continuously evolving. Future plans include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Adding more Zen texts and translations</li>
            <li>Implementing user accounts for saving favorites and notes</li>
            <li>Creating a community for discussion and sharing insights</li>
            <li>Adding word-by-word comparison features</li>
            <li>Incorporating audio pronunciations of the original text</li>
          </ul>
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
