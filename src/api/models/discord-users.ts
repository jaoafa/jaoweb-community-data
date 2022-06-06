interface User {
  id: string
  username: string
  avatar: string
  avatar_decoration?: any
  discriminator: string
  public_flags: number
  bot?: boolean
}

export interface DiscordUser {
  avatar?: any
  communication_disabled_until?: Date
  flags: number
  is_pending: boolean
  joined_at: Date
  nick: string
  pending: boolean
  premium_since?: Date
  roles: string[]
  user: User
  mute: boolean
  deaf: boolean
}
