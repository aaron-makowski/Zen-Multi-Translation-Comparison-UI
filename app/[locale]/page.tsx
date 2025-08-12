import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat(locale).format(now);
  const formattedNumber = new Intl.NumberFormat(locale).format(12345.67);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{t("title")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{t("explore.title")}</h2>
            <p className="text-gray-600 mb-4">{t("explore.desc")}</p>
            <Button className="w-full" asChild>
              <Link href="/books">{t("explore.button")}</Link>
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{t("compare.title")}</h2>
            <p className="text-gray-600 mb-4">{t("compare.desc")}</p>
            <Button className="w-full" asChild>
              <Link href="/compare">{t("compare.button")}</Link>
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{t("about.title")}</h2>
          <p className="text-gray-600 mb-4">{t("about.desc")}</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/about">{t("about.button")}</Link>
          </Button>
        </div>

        <p className="mt-4">{t("dateLabel", { date: formattedDate })}</p>
        <p>{t("numberLabel", { number: formattedNumber })}</p>
      </div>
    </main>
  );
}
