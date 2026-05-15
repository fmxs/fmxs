/**
 * ============================================================
 * Neko AI 助手 - 后端 API 路由（Agent Loop 架构）
 * ============================================================
 *
 * 文件路径：app/api/neko/route.ts
 *
 * 功能概述：
 *   这是一个 Next.js App Router 的 API 路由文件。
 *   采用 Agent Loop 架构：模型思考 → 调用工具 → 执行工具 → 返回结果
 *   循环直到模型返回最终回复或达到最大步数限制。
 *
 * 数据流向：
 *   前端 POST 请求
 *     → route.ts 接收消息数组
 *     → 加入 System Prompt 构建完整上下文
 *     → ========== Agent Loop 开始 ==========
 *     → 模型思考（Think）：调用 DeepSeek，携带 Tools 定义
 *     → 若模型调用工具 → 执行工具（Execute）→ 将结果加入上下文 → 继续循环
 *     → 若模型返回内容 → 直接返回给前端
 *     → ========== Agent Loop 结束 ==========
 *
 * ============================================================
 */

// ========== 1. 导入依赖 ==========
import { NextRequest, NextResponse } from 'next/server';  // Next.js 14 App Router 的请求/响应类型
import OpenAI from 'openai';                              // OpenAI 官方 SDK（支持 DeepSeek 等兼容 API）
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';

// ========== 2. 环境变量配置 ==========
// Next.js 14 中，.env.local 文件中的变量可以在服务器端通过 process.env 访问
// 这些密钥应该放在 .env.local 中（已添加到 .gitignore），不要提交到代码库
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

// ========== 3. TypeScript 类型定义 ==========

/**
 * 对话消息格式
 * 使用 ChatCompletionMessageParam 类型以确保与 OpenAI API 兼容
 */
type ChatMessage = ChatCompletionMessageParam;

// ========== 4. 定义 3 个 Tools（ChatCompletionTool[]）==========

/**
 * Neko AI 可调用的工具列表
 *
 * 工具设计原则：
 * - recommend_tools：当用户想找/推荐 AI 工具时调用
 * - provide_usage_guide：当用户询问某个工具/功能怎么使用时调用
 * - general_chat：日常闲聊、问候，或不符合前两个工具的场景
 */
const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'recommend_tools',
      description: '当用户想找/推荐 AI 工具时调用，如视频工具、代码工具、翻译工具、图片工具等',
      parameters: {
        type: 'object',
        properties: {
          category: { type: 'string', description: '工具类别：video/code/translation/image 等' }
        },
        required: ['category']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'provide_usage_guide',
      description: '当用户询问某个工具/功能怎么使用时调用，如 ComfyUI、角色概念图、视频制作等',
      parameters: {
        type: 'object',
        properties: {
          tool: { type: 'string', description: '工具名称或功能描述' }
        },
        required: ['tool']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'general_chat',
      description: '日常闲聊、问候、感谢，或不符合前两个工具的场景',
      parameters: {
        type: 'object',
        properties: {
          greeting: { type: 'boolean', description: '是否为问候语' }
        }
      }
    }
  }
]

// ========== 5. 实现工具执行函数 ==========

/**
 * 执行工具调用的核心函数
 *
 * 工作原理：
 *   根据工具名称和参数，返回预设的业务逻辑回复。
 *   这里使用硬编码的回复内容，实际项目中可替换为知识库查询、API 调用等。
 *
 * @param name - 工具名称
 * @param args - 工具参数（从模型生成的 JSON 中解析而来）
 * @returns 工具执行结果字符串
 */
function executeTool(name: string, args: Record<string, unknown>): string {
  switch (name) {
    case 'recommend_tools':
      const category = (args.category as string || '').toLowerCase()
      if (category.includes('视频') || category.includes('video')) {
        return '🎬 视频制作相关工具推荐：\n\n1. **即梦/可灵** - 字节跳动 AI 作图与视频生成工具，支持多镜头叙事能力\n2. **ComfyUI 内部版** - 司内定制的 AI 图像生成工作流，支持视频脚本生成\n3. **GPT-4o** - 支持多模态内容生成，可以辅助视频脚本创作'
      }
      if (category.includes('代码') || category.includes('code')) {
        return '💻 代码相关工具推荐：\n\n1. **Cursor 企业版** - AI 代码编辑器，支持智能补全和代码审查\n2. **GPT-4o** - 代码生成和调试辅助\n3. **Claude 3.5** - 代码审查和架构建议'
      }
      if (category.includes('翻译') || category.includes('translation')) {
        return '🌐 翻译相关工具推荐：\n\n1. **低成本模型批量翻译** - 适合大规模翻译任务，性价比高\n2. **GPT-4o** - 高质量翻译，支持多语言\n3. **Gemini 1.5** - 支持长文本翻译和术语一致性'
      }
      if (category.includes('图片') || category.includes('图像') || category.includes('image')) {
        return '🖼️ 图像生成工具推荐：\n\n1. **ComfyUI 内部版** - 司内定制，支持角色一致性测试\n2. **Stable Diffusion 内部版** - 司内部署，支持批量生成\n3. **即梦** - 字节跳动 AI 作图，支持多风格'
      }
      return '🛠️ 公司内部 AI 工具推荐：\n\n1. **ComfyUI 内部版** - AI 图像生成（需登录）\n2. **内部知识库 Agent** - 基于内部文档的 RAG 问答\n3. **公司采购模型门户** - 统一采购的 AI 模型访问入口'

    case 'provide_usage_guide':
      const tool = (args.tool as string || '').toLowerCase()
      if (tool.includes('comfyui')) {
        return '📖 **ComfyUI 使用指引**：\n\n1. 访问 **ComfyUI 内部版**（需登录）\n2. 选择工作流模板：图像生成 / 角色概念 / 视频脚本\n3. 上传参考图或输入 Prompt\n4. 调整参数（步数、采样器、尺寸）\n5. 点击生成，等待结果\n\n需要我帮你写一个具体的 Prompt 吗？'
      }
      if (tool.includes('角色') || tool.includes('概念图')) {
        return '🎨 **角色概念图生成指引**：\n\n1. 确定角色描述：外观、服装、表情、姿势、背景\n2. 打开 **ComfyUI 内部版** 或 **即梦**\n3. 输入 Prompt，例如：\n   "a young female warrior with silver hair, red eyes, wearing gothic armor, dramatic lighting, 8k, detailed"\n4. 调整负面 Prompt，避免变形\n5. 生成后可用 **Stable Diffusion** 进行放大\n\n需要我帮你优化具体的描述词吗？'
      }
      if (tool.includes('视频')) {
        return '🎬 **AI 视频制作指引**：\n\n1. **脚本创作**：使用 GPT-4o 生成视频脚本\n2. **素材生成**：用即梦/可灵生成概念图和片段\n3. **后期处理**：ComfyUI 进行风格化处理\n4. **多镜头叙事**：最新图像模型支持角色一致性测试\n\n想从哪个步骤开始？'
      }
      return '📖 **通用使用指引**：\n\n我可以帮助你了解：\n- 图片生成工具的使用方法\n- 视频制作 AI 工具的操作流程\n- 代码辅助 AI 的使用技巧\n- 知识库检索的使用方式\n\n请具体描述你想了解的工具或功能，我会给出详细指引。'

    case 'general_chat':
      return '👋 你好！我是 Neko AI 助手，司内 AI 门户的小帮手。\n\n我可以帮你：\n- 推荐 AI 工具 🚀\n- 解答工具使用方法 📖\n- 辅助图片、视频、翻译、代码生成 🎨\n\n有什么想了解的？'

    default:
      return '抱歉，我没有这个工具的详细信息。'
  }
}

// ========== 6. Agent Loop 核心逻辑 ==========

/**
 * Agent Loop 的最大步数限制
 * 防止无限循环，保护服务器资源
 */
const MAX_STEPS = 50

// ========== 7. API 路由处理 ==========

/**
 * POST 请求处理器
 *
 * Next.js App Router 中，route.ts 导出 HTTP 方法对应的函数。
 * 这里导出 POST 函数来处理聊天请求。
 *
 * Agent Loop 流程：
 *   1. 解析请求体，获取消息数组
 *   2. 检查环境变量（API Key）
 *   3. 构建完整消息上下文（加入 System Prompt）
 *   4. ========== Agent Loop 开始 ==========
 *      a. Think：调用 DeepSeek 模型，让模型思考是否需要调用工具
 *      b. Execute：若模型调用了工具，执行工具并将结果加入上下文，继续循环
 *      c. 若模型返回了文本内容，直接返回给前端
 *   5. ========== Agent Loop 结束 ==========
 */
export async function POST(request: NextRequest) {
  try {
    // ---------- 第 1 步：解析请求体 ----------
    const body = await request.json() as { messages?: ChatMessage[] }
    const messages = body.messages

    // 防御性检查：如果没有消息内容，返回错误
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: '消息内容不能为空' }, { status: 400 })
    }

    // ---------- 第 2 步：检查环境变量 ----------
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: '后端未配置 DeepSeek API Key，请联系管理员' }, { status: 500 })
    }

    // ---------- 第 3 步：初始化客户端 ----------
    const client = new OpenAI({ apiKey: DEEPSEEK_API_KEY, baseURL: DEEPSEEK_BASE_URL })

    // ---------- 第 4 步：构建完整消息上下文 ----------
    // System Prompt 定义 Neko AI 助手的角色和能力
    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `你是 Neko AI 助手，司内 AI 门户的猫形象助手。你的职责是：
1. 推荐公司内部 AI 工具
2. 解答工具使用方法
3. 辅助完成图片、视频、翻译、代码等任务

当用户请求推荐工具时，调用 recommend_tools 工具。
当用户询问如何使用某个工具时，调用 provide_usage_guide 工具。
当用户只是闲聊、问候或感谢时，调用 general_chat 工具。`
    }

    // 将 System Prompt 和用户消息合并，构建完整的对话上下文
    const chatMessages: ChatMessage[] = [systemPrompt, ...messages]

    // ========== Agent Loop 开始 ==========
    /**
     * Agent Loop 的核心是一个 while 循环或 for 循环
     * 每次循环中：
     *   1. 调用模型，让它思考是否需要调用工具
     *   2. 若调用了工具，执行工具并将结果加入上下文，继续下一轮
     *   3. 若返回了文本内容，结束循环并返回
     *
     * 这样设计的优点：
     *   - 模型自己决定是否需要调用工具，而非预先分类
     *   - 可以多次调用工具（Tool Chain），适应复杂任务
     *   - 代码结构简洁，逻辑清晰
     */
    for (let step = 0; step < MAX_STEPS; step++) {
      // ---------- Think：调用模型，让模型思考 ----------
      /**
       * 调用 DeepSeek 的 chat.completions.create 接口
       * - model：指定使用的模型
       * - messages：完整的对话上下文
       * - tools：可用的工具列表
       * - tool_choice：'auto' 表示让模型自己决定是否调用工具
       * - temperature：0.7，适度随机性，保持回答的自然感
       */
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: chatMessages,
        tools,
        tool_choice: 'auto',
        temperature: 0.7
      })

      // 获取模型的回复
      const assistantMsg = response.choices[0].message

      // ---------- Execute：处理工具调用 ----------
      /**
       * 检查模型是否调用了工具
       * assistantMsg.tool_calls 是一个数组，可能包含多个工具调用
       */
      if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
        // 必须将 assistant 的 tool_calls 消息加入上下文
        // 这样下一轮循环时，模型能看到自己之前的工具调用
        chatMessages.push(assistantMsg as ChatMessage)

        // 遍历模型调用的所有工具，逐个执行
        for (const toolCall of assistantMsg.tool_calls) {
          // 工具调用类型断言：我们只使用 function 类型工具
          const fn = toolCall as unknown as { function: { name: string; arguments: string } }
          const name = fn.function.name
          const argsStr = fn.function.arguments
          // 解析工具参数（模型生成的是 JSON 字符串）
          const args = JSON.parse(argsStr)

          // 执行工具，获取结果
          const result = executeTool(name, args)

          // 将工具结果以 tool role 形式加入消息数组
          // - role: 'tool' 表示这是工具调用的结果
          // - tool_call_id: 关联到具体的工具调用
          const toolMessage: ChatMessage = {
            role: 'tool',
            content: result,
            tool_call_id: toolCall.id
          }
          chatMessages.push(toolMessage)
        }

        // 工具执行完毕，继续下一轮循环，让模型基于新的上下文继续思考
        continue
      }

      // ---------- 返回最终回复 ----------
      /**
       * 若模型没有调用工具，说明它已经生成了最终回复
       * 此时直接将回复返回给前端
       */
      if (assistantMsg.content) {
        return NextResponse.json({
          role: 'assistant',
          content: assistantMsg.content
        })
      }
    }
    // ========== Agent Loop 结束 ==========

    // ---------- 防御：超过最大步骤限制 ----------
    /**
     * 如果循环了 MAX_STEPS 次还没有返回内容，
     * 说明模型陷入了死循环或任务过于复杂
     * 此时返回一个友好的错误提示
     */
    return NextResponse.json({
      role: 'assistant',
      content: '抱歉，处理的步数超过了限制，请简化您的问题。'
    }, { status: 500 })

  } catch (error) {
    // 错误处理：记录错误详情，但不要返回给前端（避免泄露内部信息）
    console.error('[Neko] Agent Loop error:', error)
    return NextResponse.json({ error: '服务器内部错误，请稍后重试' }, { status: 500 })
  }
}

/**
 * ============================================================
 * 学术讲解：Agent Loop 架构相比状态机的优势
 * ============================================================
 *
 * 1. **模型自主决策**
 *    - 状态机：预先分类，再分发到 Handler（两阶段）
 *    - Agent Loop：模型自己决定是否调用工具、调用哪个工具（端到端）
 *
 * 2. **支持多工具链**
 *    - 状态机：每个请求只处理一个意图
 *    - Agent Loop：可以连续调用多个工具，处理复杂任务
 *
 * 3. **代码简洁易维护**
 *    - 状态机：Intent 分类器 + dispatch 函数 + 多个 Handler
 *    - Agent Loop：Tools 定义 + executeTool 函数 + Loop 主体
 *
 * 4. **更好的扩展性**
 *    - 新增工具：只需在 tools 数组中添加定义，在 executeTool 中添加 case
 *    - 不需要修改模型调用逻辑
 *
 * ============================================================
 * 学术讲解：Tool Calling 的工作原理
 * ============================================================
 *
 * 1. **模型视角**
 *    - 模型根据上下文判断是否需要调用工具
 *    - 如果需要，生成符合 Tool Schema 的 JSON 输出
 *
 * 2. **我们的视角**
 *    - 解析模型输出的 tool_calls
 *    - 执行对应的工具函数
 *    - 将结果以 tool role 加入上下文
 *    - 继续循环，让模型基于结果继续思考
 *
 * 3. **多工具调用**
 *    - 如果任务复杂，模型可以连续调用多个工具
 *    - 每个工具的结果都会加入上下文
 *    - 模型可以看到完整的工具调用链
 *
 * ============================================================
 */