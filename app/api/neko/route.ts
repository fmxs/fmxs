/**
 * ============================================================
 * Neko AI 助手 - 后端 API 路由
 * ============================================================
 *
 * 文件路径：app/api/neko/route.ts
 *
 * 功能概述：
 *   这是一个 Next.js App Router 的 API 路由文件。
 *   负责接收前端聊天消息，通过 DeepSeek AI 进行意图分类，
 *   然后根据分类结果使用状态机模式分发到不同的处理器。
 *
 * 数据流向：
 *   前端 POST 请求
 *     → route.ts 接收用户消息
 *     → 调用 DeepSeek 进行意图分类（JSON 格式返回）
 *     → 解析分类结果，切换状态机状态
 *     → 执行对应的 Handler 函数
 *     → 返回统一格式的 JSON 响应
 *
 * ============================================================
 */

// ========== 1. 导入依赖 ==========
import { NextRequest, NextResponse } from 'next/server';  // Next.js 14 App Router 的请求/响应类型
import OpenAI from 'openai';                              // OpenAI 官方 SDK（支持 DeepSeek 等兼容 API）

// ========== 2. 环境变量配置 ==========
// Next.js 14 中，.env.local 文件中的变量可以在服务器端通过 process.env 访问
// 这些密钥应该放在 .env.local 中（已添加到 .gitignore），不要提交到代码库
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

// ========== 3. TypeScript 类型定义 ==========

/**
 * Neko AI 的对话状态枚举
 *
 * 为什么用 Enum？
 * - 相比字符串字面量，Enum 提供更好的类型安全和自动补全
 * - 可以在编译时检查遗漏的 case，避免运行时错误
 * - 便于后续扩展新状态（如 IMAGE_GENERATE, VIDEO_EDIT 等）
 */
enum NekoIntent {
  /** 工具推荐：当用户想找公司内部 AI 工具、视频工具等 */
  TOOL_RECOMMEND = 'TOOL_RECOMMEND',
  /** 使用指引：当用户询问某个工具怎么用、怎么生成角色图等 */
  USAGE_GUIDE = 'USAGE_GUIDE',
  /** 日常闲聊：兜底状态，处理不符合前两种的情况 */
  GENERAL_CHAT = 'GENERAL_CHAT',
}

/**
 * DeepSeek 返回的意图分类结果
 * 注意：这里的 intent 是字符串类型，对应上面的 NekoIntent 枚举值
 */
interface IntentResult {
  intent: string;        // 意图分类：'TOOL_RECOMMEND' | 'USAGE_GUIDE' | 'GENERAL_CHAT'
  confidence: number;    // 置信度：0~1 之间的小数，越高表示越确定
  reason?: string;      // 可选：分类理由，用于调试或日志
}

/**
 * 前端发送的消息格式
 * 只接收 user 的输入内容，角色固定为 'user'
 */
interface ChatMessage {
  role: 'user';
  content: string;
}

/**
 * 统一的 API 响应格式
 * 所有 Handler 处理完后，都返回这个格式，保证前端有一致的处理逻辑
 */
interface NekoResponse {
  role: 'assistant';
  content: string;
  intent?: string;      // 可选：将本次处理的状态带回前端，用于日志或分析
}

// ========== 4. 状态机 Handler 函数 ==========

/**
 * 工具推荐处理器
 *
 * 触发场景：
 *   - 用户说"我想找公司内部 AI 工具"
 *   - 用户说"推荐视频工具"
 *   - 用户说"有什么 AI 工具可以用"
 *
 * 处理逻辑：
 *   根据用户描述的具体需求，返回相应的工具推荐列表
 */
function handleToolRecommend(userMessage: string): NekoResponse {
  // 业务逻辑：根据关键词匹配，返回推荐的工具
  // 这里用简单的关键词匹配演示，实际可以接知识库或数据库

  const msg = userMessage.toLowerCase();

  // 注意：这里是简单的演示逻辑，实际项目中建议接内部知识库或 RAG 系统
  if (msg.includes('视频') || msg.includes('video')) {
    return {
      role: 'assistant',
      content: '🎬 视频制作相关工具推荐：\n\n1. **即梦/可灵** - 字节跳动 AI 作图与视频生成工具，支持多镜头叙事能力\n2. **ComfyUI 内部版** - 司内定制的 AI 图像生成工作流，支持视频脚本生成\n3. **GPT-4o** - 支持多模态内容生成，可以辅助视频脚本创作',
      intent: NekoIntent.TOOL_RECOMMEND,
    };
  } else if (msg.includes('代码') || msg.includes('code')) {
    return {
      role: 'assistant',
      content: '💻 代码相关工具推荐：\n\n1. **Cursor 企业版** - AI 代码编辑器，支持智能补全和代码审查\n2. **GPT-4o** - 代码生成和调试辅助\n3. **Claude 3.5** - 代码审查和架构建议',
      intent: NekoIntent.TOOL_RECOMMEND,
    };
  } else if (msg.includes('翻译') || msg.includes('翻译')) {
    return {
      role: 'assistant',
      content: '🌐 翻译相关工具推荐：\n\n1. **低成本模型批量翻译** - 适合大规模翻译任务，性价比高\n2. **GPT-4o** - 高质量翻译，支持多语言\n3. **Gemini 1.5** - 支持长文本翻译和术语一致性',
      intent: NekoIntent.TOOL_RECOMMEND,
    };
  } else if (msg.includes('图片') || msg.includes('图像') || msg.includes('角色')) {
    return {
      role: 'assistant',
      content: '🖼️ 图像生成工具推荐：\n\n1. **ComfyUI 内部版** - 司内定制，支持角色一致性测试\n2. **Stable Diffusion 内部版** - 司内部署，支持批量生成\n3. **即梦** - 字节跳动 AI 作图，支持多风格',
      intent: NekoIntent.TOOL_RECOMMEND,
    };
  } else {
    // 默认工具推荐
    return {
      role: 'assistant',
      content: '🛠️ 公司内部 AI 工具推荐：\n\n1. **ComfyUI 内部版** - AI 图像生成（需登录）\n2. **内部知识库 Agent** - 基于内部文档的 RAG 问答\n3. **公司采购模型门户** - 统一采购的 AI 模型访问入口\n\n想了解更多某个类别的工具吗？',
      intent: NekoIntent.TOOL_RECOMMEND,
    };
  }
}

/**
 * 使用指引处理器
 *
 * 触发场景：
 *   - 用户问"ComfyUI 怎么用"
 *   - 用户问"怎么生成角色概念图"
 *   - 用户问"GPT 怎么帮我写代码"
 */
function handleUsageGuide(userMessage: string): NekoResponse {
  const msg = userMessage.toLowerCase();

  if (msg.includes('comfyui')) {
    return {
      role: 'assistant',
      content: '📖 **ComfyUI 使用指引**：\n\n1. 访问 **ComfyUI 内部版**（需登录）\n2. 选择工作流模板：图像生成 / 角色概念 / 视频脚本\n3. 上传参考图或输入 Prompt\n4. 调整参数（步数、采样器、尺寸）\n5. 点击生成，等待结果\n\n需要我帮你写一个具体的 Prompt 吗？',
      intent: NekoIntent.USAGE_GUIDE,
    };
  } else if (msg.includes('角色') || msg.includes('概念图')) {
    return {
      role: 'assistant',
      content: '🎨 **角色概念图生成指引**：\n\n1. 确定角色描述：外观、服装、表情、姿势、背景\n2. 打开 **ComfyUI 内部版** 或 **即梦**\n3. 输入 Prompt，例如：\n   "a young female warrior with silver hair, red eyes, wearing gothic armor, dramatic lighting, 8k, detailed"\n4. 调整负面 Prompt，避免变形\n5. 生成后可用 **Stable Diffusion** 进行放大\n\n需要我帮你优化具体的描述词吗？',
      intent: NekoIntent.USAGE_GUIDE,
    };
  } else if (msg.includes('视频')) {
    return {
      role: 'assistant',
      content: '🎬 **AI 视频制作指引**：\n\n1. **脚本创作**：使用 GPT-4o 生成视频脚本\n2. **素材生成**：用即梦/可灵生成概念图和片段\n3. **后期处理**：ComfyUI 进行风格化处理\n4. **多镜头叙事**：最新图像模型支持角色一致性测试\n\n想从哪个步骤开始？',
      intent: NekoIntent.USAGE_GUIDE,
    };
  } else {
    return {
      role: 'assistant',
      content: '📖 **通用使用指引**：\n\n我可以帮助你了解：\n- 图片生成工具的使用方法\n- 视频制作 AI 工具的操作流程\n- 代码辅助 AI 的使用技巧\n- 知识库检索的使用方式\n\n请具体描述你想了解的工具或功能，我会给出详细指引。',
      intent: NekoIntent.USAGE_GUIDE,
    };
  }
}

/**
 * 日常闲聊处理器（兜底状态）
 *
 * 触发场景：
 *   - 打招呼、问候
 *   - 闲聊、开玩笑
 *   - 不符合 TOOL_RECOMMEND 或 USAGE_GUIDE 的其他内容
 */
function handleGeneralChat(userMessage: string): NekoResponse {
  const msg = userMessage.toLowerCase().trim();

  // 简单的意图匹配
  if (msg.includes('你好') || msg.includes('hi') || msg.includes('hello')) {
    return {
      role: 'assistant',
      content: '👋 你好！我是 Neko AI 助手，司内 AI 门户的小帮手。\n\n我可以帮你：\n- 推荐 AI 工具 🚀\n- 解答工具使用方法 📖\n- 辅助图片、视频、代码生成 🎨\n\n有什么想了解的？',
      intent: NekoIntent.GENERAL_CHAT,
    };
  } else if (msg.includes('你是谁') || msg.includes('什么')) {
    return {
      role: 'assistant',
      content: '🤖 我是 **Neko AI 助手**，公司内部 AI 门户的助手。\n\n我的职责是：\n1. 推荐公司内部 AI 工具\n2. 解答工具使用方法\n3. 辅助完成图片、视频、翻译、代码等任务\n\n有什么需要帮忙的？',
      intent: NekoIntent.GENERAL_CHAT,
    };
  } else if (msg.includes('谢谢') || msg.includes('thank')) {
    return {
      role: 'assistant',
      content: '😊 不客气！还有其他问题随时问我～',
      intent: NekoIntent.GENERAL_CHAT,
    };
  } else {
    // 兜底回复
    return {
      role: 'assistant',
      content: '🤔 我理解你的意思了，但这个问题我可能帮不上忙。\n\n你可以尝试问我：\n- "我想找公司内部 AI 工具"\n- "ComfyUI 怎么用"\n- "怎么生成角色概念图"\n\n或者试试快捷按钮，我会有更准确的回答！',
      intent: NekoIntent.GENERAL_CHAT,
    };
  }
}

// ========== 5. 意图分类函数 ==========

/**
 * 通过 DeepSeek AI 进行意图分类
 *
 * 工作原理：
 *   1. 构造一个 System Prompt，要求 DeepSeek 以 JSON 格式返回分类结果
 *   2. 将用户消息发送给 DeepSeek
 *   3. 解析返回的 JSON，提取意图和置信度
 *
 * 为什么先分类再处理？
 *   - 避免用一个大 Prompt 处理所有场景，导致 Prompt 过于复杂
 *   - 便于后续扩展，每个状态有独立的 Handler
 *   - 可以针对不同意图做定制化回复
 */
async function classifyIntent(userMessage: string): Promise<IntentResult> {
  // 初始化 OpenAI 客户端
  // 注意：DeepSeek API 兼容 OpenAI SDK，只需要修改 baseURL 和 apiKey
  const client = new OpenAI({
    apiKey: DEEPSEEK_API_KEY,
    baseURL: DEEPSEEK_BASE_URL,
  });

  // 构造分类用的 System Prompt
  // 注意：强制要求返回 JSON 格式，便于程序解析
  const systemPrompt = `你是 Neko AI 助手，一个意图分类器。
请分析用户输入，并将其分类为以下三种意图之一：

- TOOL_RECOMMEND：当用户想找/推荐 AI 工具时（如"推荐视频工具"、"有什么 AI 工具"）
- USAGE_GUIDE：当用户询问某个工具/功能怎么使用时（如"ComfyUI 怎么用"、"怎么生成角色图"）
- GENERAL_CHAT：日常闲聊、问候、或不符合前两种的情况

请以 JSON 格式返回，不要包含任何其他内容：
{"intent": "意图类型", "confidence": 0.0~1.0, "reason": "分类理由"}

示例：
输入：我想要生成角色概念图
输出：{"intent": "USAGE_GUIDE", "confidence": 0.85, "reason": "用户在询问如何生成角色概念图，属于使用指引"}`;

  try {
    // 调用 DeepSeek API
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',  // DeepSeek 的模型名称
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.1,  // 低温度确保分类结果稳定
    });

    // 解析返回的 JSON
    const content = response.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content) as IntentResult;

    // 验证 intent 是否为有效值
    if (!Object.values(NekoIntent).includes(result.intent as NekoIntent)) {
      // 如果返回的意图不在枚举中，默认设为 GENERAL_CHAT
      console.warn(`[Neko] Unknown intent: ${result.intent}, defaulting to GENERAL_CHAT`);
      return { intent: NekoIntent.GENERAL_CHAT, confidence: 0 };
    }

    return result;
  } catch (error) {
    // 如果 API 调用失败，记录错误并返回默认状态
    console.error('[Neko] Intent classification failed:', error);
    return { intent: NekoIntent.GENERAL_CHAT, confidence: 0 };
  }
}

// ========== 6. 状态机分发函数 ==========

/**
 * 状态机入口函数
 *
 * 为什么用状态机？
 *   - 清晰的职责划分：每个状态有独立的 Handler
 *   - 易于扩展：新状态只需添加新的 Handler，不影响现有逻辑
 *   - 避免嵌套 if-else：所有状态在同一个层面处理
 *   - 便于测试：每个 Handler 可以独立单元测试
 */
function dispatchByIntent(intent: NekoIntent, userMessage: string): NekoResponse {
  // 使用 switch 语句分发到对应的 Handler
  // 注意：这里没有 default 分支，因为我们在 classifyIntent 中已经保证了 intent 的有效性
  switch (intent) {
    case NekoIntent.TOOL_RECOMMEND:
      return handleToolRecommend(userMessage);
    case NekoIntent.USAGE_GUIDE:
      return handleUsageGuide(userMessage);
    case NekoIntent.GENERAL_CHAT:
      return handleGeneralChat(userMessage);
    // 防御性编程：如果枚举被扩展但忘记处理，TS 会在编译时报错
  }
}

// ========== 7. API 路由处理 ==========

/**
 * POST 请求处理器
 *
 * Next.js App Router 中，route.ts 导出 HTTP 方法对应的函数。
 * 这里导出 POST 函数来处理聊天请求。
 */
export async function POST(request: NextRequest) {
  try {
    // 第 1 步：解析请求体，获取用户消息
    const body = await request.json() as { message?: string };
    const userMessage = body.message?.trim();

    // 防御性检查：如果没有消息内容，返回错误
    if (!userMessage) {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      );
    }

    // 第 2 步：检查环境变量
    // 如果没有配置 API Key，返回提示（不要泄露具体信息）
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: '后端未配置 DeepSeek API Key，请联系管理员' },
        { status: 500 }
      );
    }

    // 第 3 步：意图分类
    const intentResult = await classifyIntent(userMessage);
    const intent = intentResult.intent as NekoIntent;

    // 第 4 步：状态机分发处理
    const response = dispatchByIntent(intent, userMessage);

    // 第 5 步：返回统一格式的 JSON 响应
    return NextResponse.json(response);
  } catch (error) {
    // 错误处理：记录错误详情，但不要返回给前端
    console.error('[Neko] POST handler error:', error);
    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}

/**
 * 学术讲解：为什么需要意图分类？
 * ============================================================
 *
 * 1. **让 AI 模型专注单一任务，提高准确性**
 *    - 如果用一个 Prompt 处理所有场景，AI 需要同时理解"工具推荐"和"使用指引"
 *    - 分类后，每个 Prompt 只关注一个领域，准确率更高
 *
 * 2. **便于后续扩展和维护**
 *    - 新增功能（如 IMAGE_GENERATE）只需添加新状态和 Handler
 *    - 不需要修改其他状态的代码，降低引入 bug 的风险
 *
 * 3. **状态机模式的优势**
 *    - 明确的入口和出口：所有请求都经过 classifyIntent -> dispatchByIntent
 *    - 单一职责：每个 Handler 只处理一种意图
 *    - 可测试：每个 Handler 可以独立测试
 *    - 可观察：每个状态的转换都有日志，便于排查问题
 *
 * ============================================================
 * 学术讲解：Next.js 14 中如何读取 .env 环境变量？
 * ============================================================
 *
 * 1. **环境变量文件种类**
 *    - .env.local（推荐，用于敏感信息，如 API Key）
 *    - .env.development / .env.production（Git 提交，用于非敏感配置）
 *    - .env（不推荐，会被提交到代码库）
 *
 * 2. **文件命名规则**
 *    - .env.local：本地覆盖，优先级最高，不会被提交到 Git
 *    - .env.development：开发环境专用
 *    - .env.production：生产环境专用
 *
 * 3. **读取方式**
 *    - 服务器端（route.ts）：直接使用 process.env.DEPLOY_KEY
 *    - 客户端（组件）：需要加 NEXT_PUBLIC_ 前缀，如 NEXT_PUBLIC_API_URL
 *    - 重要：.env.local 中的变量在客户端不可见，除非加了 NEXT_PUBLIC_ 前缀
 *
 * 4. **类型安全**
 *    - process.env 返回的是 string | undefined
 *    - 建议在使用前做类型守卫或默认值处理
 *
 * ============================================================
 */