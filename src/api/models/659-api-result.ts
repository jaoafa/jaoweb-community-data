interface Api659Category {
  category_id: string
  text: string
  name: string
  description: string
  match_type: string
  base: string
  start: string
  end: string
  created_at: string
  updated_at: string
}

interface Api659Record {
  message_id: string
  rawtext: string
  diff: string
  posted_at: string
  created_at: string
  user_id: string
  category_category_id: number
}

interface Api659User {
  user_id: string
  username: string
  discriminator: string
  avatar_url: string
  created_at: string
  updated_at: string
}

export interface Api659Result {
  status: boolean
  code: number
  categories: Api659Category[]
  records: Api659Record[]
  users: Api659User[]
}

export interface Api659UserResponse {
  userId: string
  userName: string
  discriminator: string
  avatarUrl: string
}

export interface Api659RecordResponse {
  rank: number
  messageId: string
  rawtext: string
  diff: number
  user: Api659UserResponse
  postedAt: string
  createdAt: string
}

export interface Api659CategoryResponse {
  categoryId: number
  name: string
  text: string
  description: string
  base: string
}
