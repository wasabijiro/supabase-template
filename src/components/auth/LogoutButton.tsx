"use client"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/api/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout Error:', error)
      }

      router.push('/')
      router.refresh()

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      disabled={isLoading}
      className="text-red-600 hover:text-red-800 transition-colors"
    >
      {isLoading ? "ログアウト中..." : "ログアウト"}
    </Button>
  )
}
