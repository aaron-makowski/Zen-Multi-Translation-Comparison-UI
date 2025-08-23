import type React from "react";
<<<<<<< HEAD
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function LocaleLayout({
=======
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {NextIntlClientProvider} from "next-intl";
import {notFound} from "next/navigation";
import "../globals.css";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import {locales} from "@/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zen Texts Translation Comparison",
  description: "Compare different translations of classic Zen texts",
  generator: "v0.dev",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
>>>>>>> origin/codex/set-up-next-intl-with-translations
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
<<<<<<< HEAD
  unstable_setRequestLocale(locale);

=======
>>>>>>> origin/codex/set-up-next-intl-with-translations
  let messages;
  try {
    messages = (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
<<<<<<< HEAD
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Navigation />
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
=======
    <html lang={locale}>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navigation />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
>>>>>>> origin/codex/set-up-next-intl-with-translations
  );
}
