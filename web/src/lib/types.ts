// ============================================================
// NeuralBay API Gateway — TypeScript 类型定义
// ============================================================

// ——— 通用 API 响应 ———
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

// ——— 用户 ———
export interface UserInfo {
  id: number
  username: string
  display_name: string
  role: number
  status: number
  email: string
  group: string
  quota: number
  used_quota: number
  request_count: number
  aff_code: string
  aff_count: number
  aff_quota: number
  aff_history_quota: number
  inviter_id: number
  sidebar_modules: string[]
  permissions: Record<string, unknown>
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  id: number
  username: string
  display_name: string
  role: number
  status: number
  group: string
}

// ——— Token/API Key ———
export interface ApiKey {
  id: number
  user_id: number
  key: string
  name: string
  status: number
  created_time: number
  accessed_time: number
  expired_time: number
  remain_quota: number
  unlimited_quota: boolean
  used_quota: number
  group: string
}

// ——— 模型 ———
export interface ModelInfo {
  id: string
  object: string
  created: number
  owned_by: string
}

// ——— 日志/用量 ———
export interface UsageLog {
  id: number
  user_id: number
  created_at: number
  type: number
  content: string
  username: string
  token_name: string
  model_name: string
  quota: number
  prompt_tokens: number
  completion_tokens: number
  channel_id: number
  channel_name: string
  request_id: string
}

// ——— 系统状态 ———
export interface SystemStatus {
  version: string
  start_time: number
  email_verification: boolean
  github_oauth: boolean
  discord_oauth: boolean
  oidc_oauth: boolean
  linuxdo_oauth: boolean
  wechat_login: boolean
  telegram_login: boolean
  password_login_enabled: boolean
  password_register_enabled: boolean
  turnstile_check: boolean
  display_token_stat: boolean
  chat_link: string | null
}

// ——— 常量 ———
export const UserRole = {
  Common: 1,
  Admin: 2,
  Root: 3,
} as const

export const UserStatus = {
  Disabled: 0,
  Enabled: 1,
} as const

export const TokenStatus = {
  Disabled: 0,
  Enabled: 1,
} as const
