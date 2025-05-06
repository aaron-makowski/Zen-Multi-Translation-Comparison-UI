import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="container mx-auto p-2 md:p-4 max-w-3xl">
      <div className="mb-3">
        <Link href="/" className="flex items-center text-xs text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft size={14} className="mr-1" /> Back to Home
        </Link>
        <h1 className="text-2xl font-bold mb-1">About the Xinxin Ming</h1>
      </div>

      <Card className="mb-3">
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-base">History and Significance</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1 text-sm space-y-2">
          <p>
            The <strong>Xinxin Ming</strong> (信心銘), often translated as "Faith in Mind" or "Trust in Mind," is one of
            the earliest and most influential texts in Zen (Chan) Buddhism. It is attributed to Jianzhi Sengcan
            (鑑智僧璨), the Third Patriarch of Chan Buddhism in China, who lived during the 6th century CE.
          </p>
          <p>
            This short poem of approximately 600 Chinese characters is considered a foundational document in Zen
            Buddhism. Despite its brevity, it encapsulates the essence of Zen teaching, emphasizing non-dualistic
            thinking and the direct experience of reality beyond conceptual thought.
          </p>
          <p>
            The text begins with the famous lines "The Great Way is not difficult for those who have no preferences"
            (至道無難，唯嫌揀擇), setting the tone for its message about transcending the discriminating mind to realize
            the unity of all things.
          </p>
          <p>
            Over the centuries, the Xinxin Ming has been translated into many languages, with each translator bringing
            their own understanding and interpretation to the text. This has resulted in a rich variety of translations
            that offer different perspectives on the same profound teachings.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-base">About This App</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1 text-sm space-y-2">
          <p>
            This application was created to make it easier to explore and compare different translations of the Xinxin
            Ming. By presenting multiple translations side by side, users can gain a deeper understanding of the text
            and appreciate the nuances of different interpretations.
          </p>
          <p>The translations included in this app have been collected from various sources, including:</p>
          <div className="space-y-1 mt-2">
            <Link
              href="https://terebess.hu/english/hsin2.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Terebess Asia Online <ExternalLink size={10} className="ml-1" />
            </Link>
            <Link
              href="https://www.patheos.com/blogs/monkeymind/2018/07/faith-of-the-heart-mind-20-english-translations-of-the-xinxin-ming.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Monkey Mind <ExternalLink size={10} className="ml-1" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
