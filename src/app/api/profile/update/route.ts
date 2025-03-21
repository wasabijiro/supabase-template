import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedClient } from '@/lib/api/client'
import { SupabaseRepository } from '@/lib/api/adapters'
import { ApiError } from '@/lib/api/error'
import { logger } from '@/lib/logger'
import { isValidUpdateProfileRequest } from '@/lib/api/types'
import { extractBearerToken } from '@/lib/api/auth'

/**
 * Update profile
 * @route PUT /api/profile/update
 * @auth Required - Bearer token in Authorization header
 *   - Format: `Authorization: Bearer <token>`
 *   - Token must be a valid Supabase session token
 *   - User can only update their own profile
 * @param request - Request with profile data and authorization header
 * @body {Object} request.body
 *   - display_name {string|null} Optional display name
 *   - avatar_url {string|null} Optional avatar URL
 * @returns {Object} Success response or error
 *   - success: true with updated profile data
 *   - 401: Unauthorized - Missing or invalid token
 *   - 400: Bad Request - Invalid request body
 *   - 404: Not Found - Profile not found
 *   - 500: Internal Server Error
 */
export async function PUT(request: NextRequest) {
  try {
    // Extract token from header
    const tokenResult = extractBearerToken(request.headers.get('authorization'))
    if (tokenResult.isErr()) {
      return NextResponse.json(
        { error: tokenResult.error.message },
        { status: tokenResult.error.code }
      )
    }

    // Create authenticated client
    const authenticatedClient = createAuthenticatedClient(tokenResult.value)
    const repository = new SupabaseRepository(authenticatedClient)

    // Validate request body
    const body = await request.json()
    if (!isValidUpdateProfileRequest(body)) {
      logger.warn('Invalid update profile request', { body })
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Update profile
    logger.info('Processing profile update request')
    const result = await repository.updateProfile(body)

    return result.match(
      (response) => {
        logger.info('Profile updated successfully')
        return NextResponse.json(response)
      },
      (error: ApiError) => {
        logger.error('Profile update failed', { error })
        return NextResponse.json(
          { error: error.message },
          { status: error.code }
        )
      }
    )
  } catch (error) {
    logger.error('Unexpected error in profile update', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
