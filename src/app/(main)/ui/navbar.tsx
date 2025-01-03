"use client";
import ThemeToggle from "@/app/components/ThemeToggle";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { User } from "lucia";
// import { logout } from "@/app/(auth)/actions";
import { headerNavLinks } from "./headerNavLinks";

export default function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname();
  return (
    <div className="hidden w-full sm:block sm:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 sm:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 sm:flex-row sm:space-x-8 rtl:space-x-reverse sm:mt-0 sm:border-0 sm:bg-white dark:bg-gray-800 sm:dark:bg-[#1111] dark:border-gray-700">
        {headerNavLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.title}>
              <Link
                href={link.href}
                className={
                  active
                    ? "block py-2 px-3 text-white bg-blue-700 rounded sm:bg-transparent sm:text-blue-700 sm:p-0 dark:text-white sm:dark:text-blue-500"
                    : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 sm:hover:bg-transparent sm:border-0 sm:hover:text-blue-700 sm:p-0 dark:text-white sm:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white sm:dark:hover:bg-transparent"
                }
              >
                {link.title.toLowerCase()}
              </Link>
            </li>
          );
        })}

        {/* {!user ? (
          <Link href={"/login"}>Login</Link>
        ) : (
          <button onClick={async () => await logout()}>Sign Out</button>
        )} */}

        <li>
          <ThemeToggle />
        </li>
      </ul>
    </div>
  );
}
