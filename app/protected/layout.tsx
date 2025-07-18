import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";

import { Sidebar } from "@/components/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-5xl flex justify-end items-center p-3 px-5 text-sm">
                {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              </div>
            </nav>
            <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
              {children}
            </div>
            <footer className="w-full flex items-center justify-center mx-auto text-center text-xs gap-8 py-3">
              <p>
                Created by{" "}
                <a
                  href="https://github.com/ianjrobertson"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Ian Robertson
                </a>
              </p>
              <ThemeSwitcher />
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
