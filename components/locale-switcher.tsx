"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("LocaleSwitcher")

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value
    const segments = pathname.split("/")
    segments[1] = nextLocale
    router.push(segments.join("/") || "/")
  }

  return (
    <div>
      <label htmlFor="locale-switcher" className="sr-only">
        {t("label")}
      </label>
      <select
        id="locale-switcher"
        className="border rounded p-1 text-sm"
        value={locale}
        onChange={onSelectChange}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  )
}
