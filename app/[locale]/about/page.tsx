import Link from "next-intl/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const t = useTranslations("AboutPage")
  const tCommon = useTranslations("Common")

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

        <div className="prose max-w-none">
          <p className="mb-4">{t("intro")}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t("xinxinTitle")}</h2>
          <p className="mb-4">{t("xinxinDesc1")}</p>
          <p className="mb-4">{t("xinxinDesc2")}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t("comparisonTitle")}</h2>
          <p className="mb-4">{t("comparisonDesc")}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t("comparisonItem1")}</li>
            <li>{t("comparisonItem2")}</li>
            <li>{t("comparisonItem3")}</li>
            <li>{t("comparisonItem4")}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{t("futureTitle")}</h2>
          <p className="mb-4">{t("futureDesc")}</p>
          <ul className="list-disc pl-6 mb-4">
            <li>{t("futureItem1")}</li>
            <li>{t("futureItem2")}</li>
            <li>{t("futureItem3")}</li>
            <li>{t("futureItem4")}</li>
            <li>{t("futureItem5")}</li>
          </ul>
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link href="/">{tCommon("returnHome")}</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
