import { Result } from 'neverthrow'
import { ApiError } from './error'

export type ProfileId = string

export interface Profile {
  id: ProfileId
  displayName: string | null
  avatarUrl: string | null
}

// Repository interface
export interface DbRepository {
  findProfileById(id: ProfileId): Promise<Result<Profile, ApiError>>
  updateProfile(id: ProfileId, data: Partial<Profile>): Promise<Result<boolean, ApiError>>
}
