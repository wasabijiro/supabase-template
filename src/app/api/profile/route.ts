import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/api/client'
import { SupabaseRepository } from '@/lib/api/adapters'
import { ApiError } from '@/lib/api/error'
import { logger } from '@/lib/logger'

const supabaseRepository = new SupabaseRepository(supabase)

/**
 * Get profile by userId
 * @route GET /api/profile
 * @param userId - The ID of the user whose profile to retrieve
 * @returns Profile data or error response
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      logger.warn('Missing userId in request')
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    logger.info('Fetching profile', { userId })
    const result = await supabaseRepository.findProfileById(userId)

    return result.match(
      (profile) => {
        logger.info('Profile fetched successfully', { userId })
        return NextResponse.json(profile)
      },
      (error: ApiError) => {
        logger.error('Profile get error', { userId, error })
        return NextResponse.json(
          { error: error.message },
          { status: error.code }
        )
      }
    )
  } catch (error) {
    logger.error('Unexpected error in profile fetch', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}