# NeuralBay AI Gateway — AGENTS.md

## 项目概述
基于 New API (Calcium-Ion/new-api) v1.0.0-rc.14 构建的海外 AI 模型中转站。
统一的 AI 模型聚合与分发网关，支持跨格式转换为 OpenAI/Claude/Gemini 兼容接口。

## 目录结构
- `backend/` — Go 后端（原 New API 完整代码，586 Go 文件）
  - `main.go` — 入口（嵌入前端静态文件）
  - `router/` — 路由定义（api, relay, web, video）
  - `controller/` — HTTP 处理器（50+ 控制器）
  - `relay/` — 中继引擎（20+ 模型适配器）
  - `middleware/` — 中间件（认证/CORS/限流/审计）
  - `model/` — 数据模型（用户/令牌/渠道/日志）
  - `common/` — 共享工具（数据库/Redis/缓存/加密）
  - `dto/` — 数据传输对象（OpenAI/Claude/Gemini 格式定义）
  - `service/` — 业务逻辑（计费/配额/计费结算）
- `web/` — Next.js 15 管理面板（定制 UI）
- `deploy/` — Docker / K8s 部署配置
- `sdk/` — 多语言 SDK（Python / JS / Go）
- `docs/` — API 文档 / 部署指南 / 贡献指南
- `.github/workflows/` — CI/CD 流水线

## 构建与运行

### 后端
```bash
cd backend
go build -o new-api.exe .
./new-api.exe
# 访问 http://localhost:3000
```

### 前端（定制版）
```bash
cd web
npm install
npm run dev
# 访问 http://localhost:3001
```

### 生产部署
```bash
docker compose up -d
```

## 代码规范
- Go: 标准 gofmt 格式
- TypeScript: ESLint + 严格模式
- 所有 API 返回结构化 JSON 错误
- 环境变量优先，默认值在 common/env.go 中定义

## 关键配置（.env）
- `SESSION_SECRET` / `CRYPTO_SECRET` / `JWT_SECRET` — 必须修改
- `DB_TYPE` — sqlite / mysql / postgres
- `REDIS_CONN_STRING` — 多节点部署必填
- `STRIPE_*` — 支付集成

## 上游追踪
```bash
git remote add upstream https://github.com/Calcium-Ion/new-api.git
git pull upstream main
```
