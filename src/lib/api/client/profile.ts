import { Profile } from '@/lib/api/domain'
import { logger } from '@/lib/logger'
import { getAuthSession } from '@/lib/api/client/session'

export interface UpdateProfileParams {
  displayName: string
  avatarUrl: string
}

export const profileApi = {
  async fetch(userId: string): Promise<Profile> {
    try {
      const response = await fetch(`/api/profile?userId=${userId}`)
      const data = await response.json()
      if (!response.ok) {
        logger.error('Failed to fetch profile', { error: data.error })
        throw new Error(data.error)
      }
      return data
    } catch (error) {
      logger.error('Error fetching profile', { error })
      throw error
    }
  },

  async update(params: UpdateProfileParams): Promise<void> {
    try {
      const session = await getAuthSession()
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          display_name: params.displayName,
          avatar_url: params.avatarUrl
        })
      })
      const data = await response.json()
      if (!response.ok) {
        logger.error('Failed to update profile', { error: data.error })
        throw new Error(data.error)
      }
    } catch (error) {
      logger.error('Error updating profile', { error })
      throw error
    }
  }
}
