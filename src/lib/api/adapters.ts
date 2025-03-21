import { SupabaseClient } from '@supabase/supabase-js'
import { Result, ok, err } from 'neverthrow'
import { DbRepository } from './domain'
import { ApiError, createApiError } from './error'
import { Profile } from './domain'
import { logger } from '@/lib/logger'

export class SupabaseRepository implements DbRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findProfileById(id: string): Promise<Result<Profile, ApiError>> {
    try {
      logger.info('Fetching profile', { id })
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return err(createApiError(
          'database',
          error.message,
          error
        ))
      }

      if (!data) {
        return err(createApiError(
          'not_found',
          `Profile with id ${id} not found`
        ))
      }

      return ok({
        id: data.id,
        displayName: data.display_name,
        avatarUrl: data.avatar_url
      })
    } catch (error) {
      logger.error('Failed to fetch profile', { id, error })
      return err(createApiError(
        'unknown',
        error instanceof Error ? error.message : 'Unknown error occurred',
        error
      ))
    }
  }

  async updateProfile(id: string, data: Partial<Profile>): Promise<Result<boolean, ApiError>> {
    return ok(true)
  }
}
