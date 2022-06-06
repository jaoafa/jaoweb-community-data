export type PermissionGroupKey =
  | 'admin'
  | 'moderator'
  | 'regular'
  | 'verified'
  | 'limited-verified'

export default interface PermissionGroup {
  key: PermissionGroupKey
  displayName: string
}

export interface PermissionPlayer {
  id: number
  player: string
  uuid: string
  permission: string
  expire_at: string | null
  updated_at: string
}

export const groups: PermissionGroup[] = [
  {
    key: 'admin',
    displayName: 'Admin',
  },
  {
    key: 'moderator',
    displayName: 'Moderator',
  },
  {
    key: 'regular',
    displayName: 'Regular',
  },
  {
    key: 'verified',
    displayName: 'Verified',
  },
  {
    key: 'limited-verified',
    displayName: 'Limited Verified',
  },
]
