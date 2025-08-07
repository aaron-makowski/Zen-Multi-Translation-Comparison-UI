import Link from "next-intl/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ComparePage() {
  const t = useTranslations("ComparePage")
  const tCommon = useTranslations("Common")
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("selectText")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild className="h-auto py-4">
              <Link href="/books/xinxinming">
                <div className="text-left">
                  <div className="font-medium">{t("xinxinTitle")}</div>
                  <div className="text-sm opacity-80">{t("xinxinDesc")}</div>
                </div>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4" variant="outline" disabled>
              <div className="text-left">
                <div className="font-medium">{t("platformTitle")}</div>
                <div className="text-sm opacity-80">{t("comingSoon")}</div>
              </div>
            </Button>
            <Button asChild className="h-auto py-4" variant="outline" disabled>
              <div className="text-left">
                <div className="font-medium">{t("heartTitle")}</div>
                <div className="text-sm opacity-80">{t("comingSoon")}</div>
              </div>
            </Button>
            <Button asChild className="h-auto py-4" variant="outline" disabled>
              <div className="text-left">
                <div className="font-medium">{t("diamondTitle")}</div>
                <div className="text-sm opacity-80">{t("comingSoon")}</div>
              </div>
            </Button>
          </div>
        </Card>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/">{tCommon("returnHome")}</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
