import Link from "next-intl/link"
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
            <Button asChild className="h-auto py-4">
              <Link href="/books/platform-sutra">
                <div className="text-left">
                  <div className="font-medium">Platform Sutra</div>
                  <div className="text-sm opacity-80">Translations of the Sixth Patriarch's teaching</div>
                </div>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4">
              <Link href="/books/heart-sutra">
                <div className="text-left">
                  <div className="font-medium">Heart Sutra</div>
                  <div className="text-sm opacity-80">The essence of Prajñāpāramitā</div>
                </div>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4">
              <Link href="/books/diamond-sutra">
                <div className="text-left">
                  <div className="font-medium">Diamond Sutra</div>
                  <div className="text-sm opacity-80">A key Mahayana text on emptiness</div>
                </div>
              </Link>
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
