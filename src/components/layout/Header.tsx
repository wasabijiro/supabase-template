"use client"

import { GoogleLoginButton } from "@/components/auth/LoginButton"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
  const { isAuthenticated, loading } = useAuth()

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Logo or title */}
        <div>
          {/* Add logo or title here if needed */}
        </div>

        {/* Right side - Auth button */}
        <div>
          {!loading && (
            isAuthenticated ? (
              <LogoutButton />
            ) : (
              <GoogleLoginButton />
            )
          )}
        </div>
      </div>
    </header>
  )
}
