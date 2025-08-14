"use client";

import type React from "react";

<<<<<<< HEAD
<<<<<<< HEAD
import Link from "next-intl/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
=======
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
>>>>>>> origin/codex/set-up-next-intl-with-translations
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
=======
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
>>>>>>> origin/codex/implement-theme-toggle-with-tailwind

export function Navigation() {
  const pathname = usePathname();
<<<<<<< HEAD
  const t = useTranslations("Navigation");
=======
  const locale = useLocale();
  const t = useTranslations('Navigation');
  const basePath = `/${locale}`;
  const current = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
>>>>>>> origin/codex/set-up-next-intl-with-translations

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
<<<<<<< HEAD
              <Link href="/" className="font-bold text-xl">
                {t("title")}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/" current={pathname === "/"}>
                {t("home")}
              </NavLink>
              <NavLink href="/books" current={pathname.startsWith("/books")}>
                {t("books")}
              </NavLink>
              <NavLink href="/compare" current={pathname === "/compare"}>
                {t("compare")}
              </NavLink>
              <NavLink href="/reddit" current={pathname.startsWith("/reddit")}>
                Reddit
              </NavLink>
              <NavLink href="/pdf-preview" current={pathname === "/pdf-preview"}>
                {t("pdfPreview")}
              </NavLink>
              <NavLink href="/about" current={pathname === "/about"}>
                {t("about")}
=======
              <Link href={basePath} className="font-bold text-xl">
                {t('title')}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href={basePath} current={current === "/"}>
                {t('home')}
              </NavLink>
              <NavLink href={`${basePath}/books`} current={current.startsWith("/books")}>
                {t('books')}
              </NavLink>
              <NavLink href={`${basePath}/compare`} current={current === "/compare"}>
                {t('compare')}
              </NavLink>
              <NavLink href={`${basePath}/reddit`} current={current === "/reddit"}>
                {t('reddit')}
              </NavLink>
              <NavLink href={`${basePath}/pdf-preview`} current={current === "/pdf-preview"}>
                {t('pdfPreview')}
              </NavLink>
              <NavLink href={`${basePath}/about`} current={current === "/about"}>
                {t('about')}
>>>>>>> origin/codex/set-up-next-intl-with-translations
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
<<<<<<< HEAD
            <Link href="/login" passHref>
              <Button variant="outline" size="sm" className="mr-2">
                {t("login")}
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button size="sm">{t("register")}</Button>
=======
            <Link href={`${basePath}/login`} passHref>
              <Button variant="outline" size="sm" className="mr-2">
                {t('login')}
              </Button>
            </Link>
<<<<<<< HEAD
            <Link href={`${basePath}/register`} passHref>
              <Button size="sm">{t('register')}</Button>
>>>>>>> origin/codex/set-up-next-intl-with-translations
            </Link>
            <LocaleSwitcher />
            <ThemeToggle />
=======
            <ThemeSwitcher />
>>>>>>> origin/codex/implement-theme-toggle-with-tailwind
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
<<<<<<< HEAD
          <MobileNavLink href="/" current={pathname === "/"}>
            {t("home")}
          </MobileNavLink>
          <MobileNavLink href="/books" current={pathname.startsWith("/books")}>
            {t("books")}
          </MobileNavLink>
          <MobileNavLink href="/compare" current={pathname === "/compare"}>
            {t("compare")}
          </MobileNavLink>
          <MobileNavLink href="/reddit" current={pathname.startsWith("/reddit")}>
            Reddit
          </MobileNavLink>
          <MobileNavLink href="/pdf-preview" current={pathname === "/pdf-preview"}>
            {t("pdfPreview")}
          </MobileNavLink>
          <MobileNavLink href="/about" current={pathname === "/about"}>
            {t("about")}
=======
          <MobileNavLink href={basePath} current={current === "/"}>
            {t('home')}
          </MobileNavLink>
          <MobileNavLink href={`${basePath}/books`} current={current.startsWith("/books")}>
            {t('books')}
          </MobileNavLink>
          <MobileNavLink href={`${basePath}/compare`} current={current === "/compare"}>
            {t('compare')}
          </MobileNavLink>
          <MobileNavLink href={`${basePath}/reddit`} current={current === "/reddit"}>
            {t('reddit')}
          </MobileNavLink>
          <MobileNavLink href={`${basePath}/pdf-preview`} current={current === "/pdf-preview"}>
            {t('pdfPreview')}
          </MobileNavLink>
          <MobileNavLink href={`${basePath}/about`} current={current === "/about"}>
            {t('about')}
>>>>>>> origin/codex/set-up-next-intl-with-translations
          </MobileNavLink>
          <div className="flex space-x-2 px-3 py-2 items-center">
            <Link href={`${basePath}/login`} passHref className="w-1/2">
              <Button variant="outline" size="sm" className="w-full">
<<<<<<< HEAD
                {t("login")}
=======
                {t('login')}
>>>>>>> origin/codex/set-up-next-intl-with-translations
              </Button>
            </Link>
            <Link href={`${basePath}/register`} passHref className="w-1/2">
              <Button size="sm" className="w-full">
<<<<<<< HEAD
                {t("register")}
=======
                {t('register')}
>>>>>>> origin/codex/set-up-next-intl-with-translations
              </Button>
            </Link>
<<<<<<< HEAD
            <LocaleSwitcher />
            <ThemeToggle />
=======
            <ThemeSwitcher />
>>>>>>> origin/codex/implement-theme-toggle-with-tailwind
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
        current
          ? "border-indigo-500 text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
        current
          ? "bg-indigo-50 border-indigo-500 text-indigo-700"
          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
      }`}
    >
      {children}
    </Link>
  );
}
