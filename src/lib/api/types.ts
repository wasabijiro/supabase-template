import { Profile } from "./domain"

// `GET /api/profile`
export interface GetProfileByIdRequest {
  userId: string
}
export type GetProfileByIdResponse = Profile

// `PUT /api/profile/update`
export interface UpdateProfileRequest {
  display_name?: string | null
  avatar_url?: string | null
}
export interface UpdateProfileResponse {
  success: boolean
  profile: Profile
}
export function isValidUpdateProfileRequest(request: UpdateProfileRequest): boolean {
  if (request.display_name || request.avatar_url) {
    return true
  }
  return false
}
