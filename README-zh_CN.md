# 项目启动指南

本文档详细说明如何从零开始搭建并运行 `neuralcore-ai-portal` 项目。

## 环境要求

- **Node.js**: v18 或更高版本
- **包管理器**: npm / pnpm / yarn（推荐 pnpm）
- **DeepSeek API Key**: 来自 [DeepSeek 开放平台](https://platform.deepseek.com/)

## 第一步：克隆项目

```bash
git clone https://github.com/fmxs/fmxs.git
cd fmxs
```

## 第二步：安装依赖

```bash
npm install
# 或 pnpm install / yarn install
```

## 第三步：配置环境变量

复制 `.env.local.example` 为 `.env.local`，并填入你的 DeepSeek API Key：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

> 没有 DeepSeek API Key 的话，需要去 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册并申请。

## 第四步：启动开发服务器

```bash
npm run dev
```

启动成功后，打开 [http://localhost:3000](http://localhost:3000) 即可访问项目。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | ESLint 检查 |

## 可能遇到的问题

### 依赖安装失败

如果网络原因导致安装慢，可以使用国内镜像：

```bash
npm install --registry=https://registry.npmmirror.com
```

### API 请求报错

确认 `.env.local` 中的 `DEEPSEEK_API_KEY` 已正确填写，且 Key 有效。