"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function Navigation() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Navigation');
  const basePath = `/${locale}`;
  const current = pathname.replace(new RegExp(`^/${locale}`), '') || '/';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
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
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
            <Link href={`${basePath}/login`} passHref>
              <Button variant="outline" size="sm" className="mr-2">
                {t('login')}
              </Button>
            </Link>
            <Link href={`${basePath}/register`} passHref>
              <Button size="sm">{t('register')}</Button>
            </Link>
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
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
          </MobileNavLink>
          <div className="flex space-x-2 px-3 py-2 items-center">
            <Link href={`${basePath}/login`} passHref className="w-1/2">
              <Button variant="outline" size="sm" className="w-full">
                {t('login')}
              </Button>
            </Link>
            <Link href={`${basePath}/register`} passHref className="w-1/2">
              <Button size="sm" className="w-full">
                {t('register')}
              </Button>
            </Link>
            <LocaleSwitcher />
            <ThemeToggle />
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
