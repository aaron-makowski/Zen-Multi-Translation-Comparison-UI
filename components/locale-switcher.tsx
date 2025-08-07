"use client";
import {useLocale} from "next-intl";
import {useRouter, usePathname} from "next/navigation";
import {locales} from "@/i18n";
import type {ChangeEvent} from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value;
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  }

  return (
    <select
      className="border rounded px-2 py-1 text-sm"
      value={locale}
      onChange={onSelectChange}
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
