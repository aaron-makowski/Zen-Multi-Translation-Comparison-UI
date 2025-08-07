import Link from "next-intl/link"
import { useFormatter, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function Home() {
  const t = useTranslations("HomePage")
  const format = useFormatter()
  const formattedNumber = format.number(1234567.89)
  const formattedDate = format.dateTime(new Date(), { dateStyle: "long" })

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{t("title")}</h1>
        <p className="text-gray-600 mb-6 text-center">
          {t("formattedExample", { number: formattedNumber, date: formattedDate })}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{t("exploreTranslations")}</h2>
            <p className="text-gray-600 mb-4">{t("exploreDescription")}</p>
            <Button className="w-full" asChild>
              <Link href="/books">{t("viewBooks")}</Link>
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{t("compareTranslations")}</h2>
            <p className="text-gray-600 mb-4">{t("compareDescription")}</p>
            <Button className="w-full" asChild>
              <Link href="/compare">{t("compareTranslations")}</Link>
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{t("aboutProject")}</h2>
          <p className="text-gray-600 mb-4">{t("aboutDescription")}</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/about">{t("learnMore")}</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
