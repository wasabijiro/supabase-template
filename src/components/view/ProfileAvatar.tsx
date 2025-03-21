"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"

interface ProfileAvatarProps {
  avatarUrl: string
  isEditing: boolean
  onAvatarChange?: (url: string) => void
}

export function ProfileAvatar({ avatarUrl, isEditing, onAvatarChange }: ProfileAvatarProps) {
  return (
    <div className="space-y-2">
      {isEditing ? (
        <>
          <label className="text-sm font-medium">アバター</label>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={avatarUrl} alt="プロフィール画像" />
              <AvatarFallback>
                <User className="size-8" />
              </AvatarFallback>
            </Avatar>
            <Input
              value={avatarUrl}
              onChange={(e) => onAvatarChange?.(e.target.value)}
              placeholder="アバターURLを入力"
              className="flex-1"
            />
          </div>
        </>
      ) : (
        <Avatar className="size-16">
          <AvatarImage src={avatarUrl} alt="プロフィール画像" />
          <AvatarFallback>
            <User className="size-8" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}