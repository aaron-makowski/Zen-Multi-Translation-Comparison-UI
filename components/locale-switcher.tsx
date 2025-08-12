"use client";

import Link from "next-intl/link";
import { useLocale } from "next-intl";
import { usePathname } from "next-intl/client";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-2">
      <Link href={pathname} locale="en" className={locale === "en" ? "font-bold" : ""}>
        EN
      </Link>
      <Link href={pathname} locale="es" className={locale === "es" ? "font-bold" : ""}>
        ES
      </Link>
    </div>
  );
}
