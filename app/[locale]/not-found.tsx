import { Button } from "@/components/ui/button"
import Link from "next-intl/link"
import { useTranslations } from "next-intl"

export default function NotFound() {
  const t = useTranslations("NotFoundPage")
  const tCommon = useTranslations("Common")

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">{t("description")}</p>
      <Button asChild>
        <Link href="/">{tCommon("returnHome")}</Link>
      </Button>
    </div>
  )
}
