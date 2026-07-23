export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens?: number;
  promptTokensDetails?: {
    cachedTokens?: number;
    cacheWriteTokens?: number;
  };
};

export type ToolCallSpec = {
  id: string;
  name: string;
  args: Record<string, any>;
};

export type ToolCallStreamDelta = {
  index: number;
  id?: string;
  name?: string;
  argsChunk?: string;
};

export type ToolDescriptor = {
  name: string;
  description: string;
  parameters?: Record<string, any>;
};

export type ModelSelection = {
  providerId: string;
  modelId: string;
}

/**
 * 模型能力描述，用于多模态附件预处理时判断是否支持某类输入。
 * 不传时视为全支持。
 */
export type ModelCapabilities = {
  input?: {
    image?: boolean;
    pdf?: boolean;
  };
  toolResultMedia?: boolean;
}

export type RequestAsStreamParams = {
  messages: any[];
  emits: {
    write: (chunk: string) => void;
    complete: (value?: string) => void;
    error: (error: any) => void;
    cancel: (fn: () => void) => void;
    onUsage?: (usage: TokenUsage) => void;
    onThinking?: (chunk: string) => void;
    onToolCalls?: (toolCalls: ToolCallSpec[]) => void;
    onToolCallStream?: (delta: ToolCallStreamDelta) => void;
    onFinishReason?: (reason: string) => void;
  };
  aiRole?: string;
  tools?: ToolDescriptor[];
  model?: ModelSelection;
  turnId?: string;
  /**
   * 当前模型的能力描述，用于多模态附件预处理。
   * 不传时视为全支持。
   */
  capabilities?: ModelCapabilities;
};

export type ParsedSSEChunk = {
  content?: string;
  thinking?: string;
  usage?: TokenUsage;
  finishReason?: string | null;
  rawToolCallDeltas?: Array<{
    index: number;
    id?: string;
    name?: string;
    argumentsChunk?: string;
  }>;
};

// ─── WarmupIter（warmup 阶段特殊 iter） ──────────────────────────────────────

/**
 * warmup 阶段的特殊 iter，挂在 TurnRecord.iterations[] 中。
 * 不参与 LLM context 构建（turnsToMessages 会跳过）。
 * 对应事件：warmup:start → warmup:content × N → warmup:complete
 */
export interface WarmupIter {
  /** 固定为 "warmup"，用于区分普通 LLM iter */
  type: "warmup";
  /** 当前状态 */
  status: "loading" | "success" | "error";
  /** 展示给用户的描述文本（streaming 更新，与 LLM iter.content 对齐） */
  content: string;
  /** warmup 开始时间（Unix ms） */
  startTime: number;
  /** warmup 结束时间（Unix ms），进行中为 undefined */
  endTime?: number;
  /**
   * 固定为空数组，与 LLM iter 兼容，避免遍历 toolCalls 时需要 type guard。
   * warmup 没有工具调用。
   */
  toolCalls: [];
}

// ─── TurnSender ───────────────────────────────────────────────────────────────

/**
 * 消息发送者信息，由 formatUserMessage 返回并写入 TurnRecord。
 * UI 渲染时优先使用 sender，兜底使用 ChatPanel 传入的 user prop。
 */
export interface TurnSender {
  userId?: string;
  name?: string;
  avatar?: string;
  [key: string]: any;
}

// ─── TurnRecord（SSE 事件粒度的完整调用记录） ─────────────────────────────────

/**
 * 单次工具调用的记录（对应 tool:call / tool:result / tool:error 三个事件）
 *
 * 时间语义：
 *   execStartTime  工具开始执行的时间（tool:call 触发时）
 *   execEndTime    工具执行完成的时间（tool:result / tool:error 触发时）
 */
export interface ToolCallRecord {
  callId: string;
  name: string;
  /** 工具标题（可选），用于 UI 展示。来源于 Tool.title。 */
  title?: string;
  args: any;
  /** 工具执行结果（包含 output 和 metadata） */
  result?: { output: string; metadata?: any };
  error?: any;
  status: "pending" | "success" | "error";
  /**
   * 工具调用错误类型（仅 status === "error" 时出现）。
   * - "invalid_args"：JSON 参数解析失败或工具参数校验失败（ToolValidationError）
   * - "normal"：工具执行过程中的其他错误
   */
  errorType?: "invalid_args" | "normal";
  /** 工具开始执行的时间（Unix ms） */
  execStartTime: number;
  /** 工具执行完成的时间（Unix ms），执行中为 0 */
  execEndTime: number;
}

/**
 * 一轮完整的 AI 调用记录（turn:start → ... → turn:complete / turn:abort / turn:error）。
 * 存储在 History 里，兼具两个用途：
 *   1. 从中重建 LLM messages（多轮对话上下文）
 *   2. 直接映射到 UI 的 MessageRecord（历史展示 + 审计）
 *
 * ReAct 循环中，一个 turn 对应用户的一次输入，内部可包含多轮 LLM<>Tool 交互。
 * `iterations` 记录每次 LLM 请求的 assistant 文本和工具调用列表，
 * 用于在多轮对话中精确重建 messages（包含 tool_calls / tool 角色消息）。
 */
export interface TurnRecord {
  /** 本轮唯一 ID */
  id: string;
  /** 用户发起本轮的时间（Unix ms） */
  startTime: number;
  /** 本轮结束时间（Unix ms），abort/error 时也记录 */
  endTime?: number;

  /** 用户输入文本（原始，用于 UI 展示） */
  userText: string;
  /** 格式化后的用户消息文本（发给 LLM，含 focus 上下文等注入内容；未格式化时与 userText 相同） */
  userFormattedText?: string;
  /** 用户附件（图片等） */
  userAttachments: Array<{ type: string; content: string }>;
  /**
   * 用户消息的附加元数据（UI 层透传，不参与 LLM 上下文构建）。
   * 可用于存储 focus 快照、mention 信息等，供消息列表渲染使用。
   */
  meta?: Record<string, any>;
  /**
   * 消息发送者信息（由 formatUserMessage 注入，UI 展示时优先使用）。
   * 不传时 UI 兜底使用 ChatPanel 的 user prop。
   */
  sender?: TurnSender;

  /**
   * ReAct 迭代记录：每次 LLM 响应对应一个 iteration，warmup 阶段插入特殊 WarmupIter。
   * WarmupIter 由 type: "warmup" 区分，不参与 LLM context 构建。
   *
   * LLM iter 时间语义：
   *   startTime     本次 LLM 请求发起的时间
   *   responseTime  LLM 首 token 到达的时间（流式开始）
   *   endTime       本次 LLM 请求完成的时间
   */
  iterations: Array<
    | WarmupIter
    | {
        /** 本次迭代 LLM 输出的纯文本 */
        content: string;
        /** 本次迭代的工具调用（若有） */
        toolCalls: ToolCallRecord[];
        /** 本次 LLM 请求发起时间（Unix ms） */
        startTime: number;
        /** LLM 首 token 到达时间（Unix ms），即响应时间 */
        responseTime?: number;
        /** 本次 LLM 请求完成时间（Unix ms） */
        endTime?: number;
        /** 本次 LLM 思考内容 */
        thinkingContent?: string;
        /** 本 step 实际使用的 aiRole（未指定时为空） */
        aiRole?: string;
        /** 本次 LLM 请求的 token 用量 */
        usage?: TokenUsage;
      }
  >;

  /** 本轮状态 */
  status: "success" | "abort" | "error";
  /** 错误信息（status === 'error' 时有值） */
  error?: string;
  /**
   * 是否已被 retry 替代（仅对 iterations 为空的 error turn 有效）。
   * 标记后该 turn 不再参与 LLM 上下文构建，但保留在历史记录中供 UI 展示。
   */
  retried?: boolean;

  /**
   * 本轮的 AI 生成摘要（由 autoSummary fork 异步写入）。
   * 用于版本记录场景。
   */
  summary?: string;
  /**
   * 本轮的可延续对话摘要（由 autoSummary fork 异步写入）。
   * 包含目标、指示、发现、已完成工作、相关文件等结构化内容，
   * 供后续 agent 接手时作为上下文使用。
   */
  handoff?: string;

  /**
   * 本轮的 AI 生成建议选项（由 autoSummary fork 异步写入）。
   * 仅当 AgentOptions.suggestions.enabled 为 true 时生成。
   * 前端只在该 turn 为最后一条时展示，用户发下一轮消息后自然消失。
   */
  suggestions?: {
    /** LLM 对这组建议的说明（可选），如"模型异常结束了" */
    desc?: string;
    /** 可点击的建议列表，点击后作为用户消息发送 */
    options: string[];
  };
  /** 用户是否主动关闭了本轮建议展示。 */
  suggestionsDismissed?: boolean;

}

// ─── VersionRecord ───────────────────────────────────────────────────────────

/**
 * 单个文件的版本快照。只存 decoded source，不存 compiled（回滚时由 sandbox 重新编译）。
 */
export interface VersionFile {
  path: string;
  /** decoded source 文本 */
  content: string;
}

/**
 * 版本元数据记录（不含 files，files 单独存储以避免 listVersions 全量读取大对象）。
 *
 * type 语义：
 *   ai        AI 生成触发（afterTurn diff 驱动）
 *   manual    用户手动保存
 *   rollback  回滚产生的版本（files 内容来源于某个历史版本）
 *
 * turnId 语义：
 *   ai / manual：本次变更对应的 TurnRecord.id
 *   rollback：被恢复的原版本的 turnId（保留关联链）
 */
export interface VersionRecord {
  /** 版本唯一 ID（uuid） */
  id: string;
  /** 关联的 TurnRecord.id */
  turnId: string;
  /** 展示标签，如 "V0" / "V1"，由调用方维护序号 */
  label: string;
  type: 'ai' | 'manual' | 'rollback' | 'init';
  /** 创建时间（Unix ms） */
  createdAt: number;
  /** AI 生成的本轮摘要（由 afterTurnSummary 异步写入） */
  summary?: string;
}

// ─── CompactRecord ────────────────────────────────────────────────────────────

/**
 * Compact 记录，关联到一个 agentKey。
 * 一个 agent 最多只有一条，单独存储在 History 的独立存储槽中（不混入 TurnRecord[]）。
 *
 * 语义：
 *   upToTurnId  压缩游标：该 turnId（含）及之前的所有 turns 已被压缩
 *   summary     由 autoCompact fork 生成的完整对话摘要
 *   createdAt   压缩时间（Unix ms）
 *
 * buildMessages 时：
 *   - 游标之前（含）的 turns → 替换为一条摘要消息对
 *   - 游标之后的 turns → 正常展开
 */
export interface CompactRecord {
  /** 压缩游标：该 turnId（含）及之前的 turns 在 buildMessages 时替换为摘要 */
  upToTurnId: string;
  /** 对话摘要内容 */
  content: string;
  /** 压缩时间（Unix ms） */
  createdAt: number;
}

// ─── History 接口 ─────────────────────────────────────────────────────────────

export interface History {
  // ── 对话记录 ──────────────────────────────────────────────────────────────

  /** 加载历史调用记录列表 */
  load(key: string): Promise<TurnRecord[]>;
  /** 追加一轮记录（完成后调用，避免每帧存储） */
  append(key: string, record: TurnRecord): Promise<void>;
  /**
   * 更新已有记录的部分字段（如异步写入 summary）。
   * 实现应以 turnId 定位记录并合并 patch。
   */
  update(key: string, turnId: string, patch: Partial<TurnRecord>): Promise<void>;
  /** 清空指定 key 的历史（同时应清除对应的 compact 记录） */
  clear(key: string): Promise<void>;
  /**
   * 批量导入历史记录（覆盖写）。
   * 用于调试场景：从导出的 JSON 文件恢复历史。
   */
  import(key: string, turns: TurnRecord[]): Promise<void>;
  /**
   * 加载该 agentKey 的 compact 记录（不存在时返回 null）。
   */
  loadCompact(key: string): Promise<CompactRecord | null>;
  /**
   * 保存（覆盖写）该 agentKey 的 compact 记录。
   * 一个 agent 只保留一条最新的 compact 记录。
   */
  saveCompact(key: string, record: CompactRecord): Promise<void>;

  // ── 版本快照 ──────────────────────────────────────────────────────────────
  //
  // key 参数（出现时）均为 agentKey，用于在同一 History 实例中隔离不同 agent 的版本数据。
  // getVersion / getVersionFiles / updateVersion 以 versionId（uuid）精确定位，不需要 key。

  /**
   * 获取该 agentKey 下所有版本的元数据列表，按 createdAt 升序排列。
   * 不含 files 内容（files 通过 getVersionFiles 单独读取）。
   * 支持分页参数 { pageSize, pageNum }，不传时返回全量数据。
   */
  listVersions(
    key: string,
    params?: { pageSize?: number; pageNum?: number }
  ): Promise<{ total: number; list: VersionRecord[] }>;

  /**
   * 追加一条新版本记录（metadata + files 原子写入）。
   * metadata 和 files 底层分开存储，调用方无需关心。
   */
  addVersion(key: string, record: VersionRecord, files: VersionFile[]): Promise<void>;

  /**
   * 读取指定版本的文件列表。
   * 仅在需要展示文件内容或执行回滚时调用，避免 listVersions 全量加载大对象。
   */
  getVersionFiles(versionId: string): Promise<VersionFile[]>;

  /**
   * 读取指定版本的元数据（不含 files）。不存在时返回 null。
   */
  getVersion(versionId: string): Promise<VersionRecord | null>;

  /**
   * 更新版本的部分字段（支持 summary 和 files 的修改）。
   * 其他字段会触发 console.warn。
   */
  updateVersion(
    versionId: string,
    patch: Partial<Pick<VersionRecord, 'summary'>> & { files?: VersionFile[] }
  ): Promise<void>;
}