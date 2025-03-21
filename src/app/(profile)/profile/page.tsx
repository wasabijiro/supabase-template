'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logger } from '@/lib/logger'
import { Profile } from '@/lib/api/domain'
import { profileApi } from '@/lib/api/client/profile'
import { ProfileAvatar } from "@/components/view/ProfileAvatar"

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const data = await profileApi.fetch(user?.id || '')
      setProfile(data)
      setDisplayName(data.displayName || '')
      setAvatarUrl(data.avatarUrl || '')
    } catch (error) {
      logger.error('Error fetching profile', { error })
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true)
      await profileApi.update({
        displayName,
        avatarUrl
      })
      logger.info('Profile updated successfully')
      setIsEditing(false)
      await fetchProfile()
    } catch (error) {
      logger.error('Error updating profile', { error })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>ログインしてください</div>
  }

  return (
    <div className="min-h-screen p-8">
      <Card>
        <CardHeader>
          <CardTitle>プロフィール</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile && (
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <ProfileAvatar
                    avatarUrl={avatarUrl}
                    isEditing={true}
                    onAvatarChange={setAvatarUrl}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">表示名</label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="表示名を入力"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} disabled={loading}>
                      {loading ? '更新中...' : '更新する'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      キャンセル
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <ProfileAvatar
                      avatarUrl={profile.avatarUrl || ''}
                      isEditing={false}
                    />
                    <div>
                      <p className="text-sm font-medium">表示名</p>
                      <p>{profile.displayName || '未設定'}</p>
                    </div>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>
                    編集する
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
