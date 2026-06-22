// ============================================================
// NeuralBay API Gateway — API 客户端
// 基于 fetch 封装，自动处理 session auth 和错误
// ============================================================

import type {
  ApiResponse,
  PaginatedData,
  UserInfo,
  LoginRequest,
  LoginResponse,
  ApiKey,
  ModelInfo,
  UsageLog,
  SystemStatus,
} from "./types"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || ""

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  let res: Response
  try {
    res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
  } catch (networkError) {
    throw new ApiError(
      "Network error: server may be waking up (free tier). Please wait a moment and try again.",
      0
    )
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}: ${res.statusText}`
    try {
      const errJson = await res.json()
      if (errJson.message) msg = errJson.message
    } catch {}
    throw new ApiError(msg, res.status)
  }

  const json: ApiResponse<T> = await res.json()

  if (!json.success) {
    throw new ApiError(json.message || "Request failed", res.status)
  }

  return json.data
}

// ——— 认证 ———
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>("/api/user/login", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function logout(): Promise<void> {
  await request("/api/user/logout", { method: "GET" })
}

export async function getSelf(): Promise<UserInfo> {
  return request<UserInfo>("/api/user/self")
}

export async function register(data: LoginRequest): Promise<void> {
  await request("/api/user/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ——— Token / API Key ———
export async function getTokens(params?: {
  page?: number
  page_size?: number
}): Promise<PaginatedData<ApiKey>> {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set("page", String(params.page))
  if (params?.page_size != null) qs.set("page_size", String(params.page_size))
  const query = qs.toString()
  return request<PaginatedData<ApiKey>>(
    `/api/token${query ? "?" + query : ""}`
  )
}

export async function createToken(data: {
  name: string
  remain_quota?: number
  expired_time?: number
  unlimited_quota?: boolean
}): Promise<ApiKey> {
  return request<ApiKey>("/api/token", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteToken(id: number): Promise<void> {
  await request(`/api/token/${id}`, { method: "DELETE" })
}

// ——— 模型 ———
export async function getModels(): Promise<Record<string, ModelInfo[]>> {
  return request<Record<string, ModelInfo[]>>("/api/models")
}

// ——— 用量日志 ———
export async function getUserLogs(params?: {
  page?: number
  page_size?: number
  start_timestamp?: number
  end_timestamp?: number
  model_name?: string
  token_name?: string
}): Promise<PaginatedData<UsageLog>> {
  const qs = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== "") qs.set(k, String(v))
    })
  }
  const query = qs.toString()
  return request<PaginatedData<UsageLog>>(
    `/api/log/self${query ? "?" + query : ""}`
  )
}

// ——— 系统 ———
export async function getStatus(): Promise<SystemStatus> {
  return request<SystemStatus>("/api/status")
}

// ——— 用量统计 ———
export async function getUsageStat(): Promise<{
  total_quota: number
  used_quota: number
  total_tokens: number
}> {
  const [user, status] = await Promise.all([getSelf(), getStatus()])
  return {
    total_quota: user.quota,
    used_quota: user.used_quota,
    total_tokens: user.used_quota,
  }
}

export { ApiError }