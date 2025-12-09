"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./Button";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wallet/setup", label: "Wallet Setup" },
  { href: "/guardians", label: "Guardians" },
  { href: "/recovery", label: "Recovery" },
  { href: "/vault", label: "Vault" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="w-full border-b/0 bg-gradient-to-r from-indigo-900/60 via-slate-900/50 to-cyan-900/50 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-lg font-semibold text-gradient tracking-tight"
          >
            Wallet Recovery
          </Link>
          <nav className="hidden gap-3 text-sm sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-md px-3 py-2 transition hover:bg-white/10 text-gray-100",
                  pathname === link.href && "bg-white/15 text-white shadow-sm"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <span className="hidden text-sm text-gray-200 sm:inline">
                {session?.user?.email}
              </span>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button onClick={() => router.push("/signup")}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


