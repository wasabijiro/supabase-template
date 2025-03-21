import { SupabaseClient } from '@supabase/supabase-js'
import { Result, ok, err } from 'neverthrow'
import { DbRepository } from './repository'
import { ApiError, createApiError } from './error'
import { logger } from '@/lib/logger'
import { authenticateUser } from './middleware'
import {
  GetProfileByIdRequest,
  GetProfileByIdResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from './types'
import { profileModelToDomain } from './domain'

export class SupabaseRepository implements DbRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findProfileById(request: GetProfileByIdRequest): Promise<Result<GetProfileByIdResponse, ApiError>> {
    try {
      logger.info('Fetching profile', { id: request.userId })
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', request.userId)
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
          `Profile with id ${request.userId} not found`
        ))
      }

      return ok(profileModelToDomain(data) as GetProfileByIdResponse)
    } catch (error) {
      logger.error('Failed to fetch profile', { id: request.userId, error })
      return err(createApiError(
        'unknown',
        error instanceof Error ? error.message : 'Unknown error occurred',
        error
      ))
    }
  }

  async updateProfile(request: UpdateProfileRequest): Promise<Result<UpdateProfileResponse, ApiError>> {
    try {
      // Authenticate user
      const authResult = await authenticateUser(this.client)
      if (authResult.isErr()) {
        return err(authResult.error)
      }
      const { user } = authResult.value

      logger.info('Updating profile', { userId: user.id })

      const { data, error } = await this.client
        .from('profiles')
        .update({
          display_name: request.display_name,
          avatar_url: request.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
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
          `Profile with id ${user.id} not found`
        ))
      }

      const profile = profileModelToDomain(data)
      return ok({
        success: true,
        profile
      } as UpdateProfileResponse)
    } catch (error) {
      logger.error('Failed to update profile', { error })
      return err(createApiError(
        'unknown',
        error instanceof Error ? error.message : 'Unknown error occurred',
        error
      ))
    }
  }
}
