/**
 * 崩溃日志分析模块
 *
 * 功能：
 * 1. 解析崩溃堆栈
 * 2. 通过映射表反混淆类名
 * 3. 返回可能成因和修复建议
 */

export interface CrashQuery {
  crashReport: string;
  version?: string;
}

export interface CrashResult {
  probableCause: string;
  fixSuggestions: string[];
  deobfuscated?: string[];
  relatedMistakes: string[];
}

// 已知的常见崩溃原因模式（从 8 种扩展至 16 种）
const KNOWN_PATTERNS: Array<{
  pattern: RegExp;
  cause: string;
  fix: string[];
  relatedMistakes: string[];
}> = [
  {
    pattern: /CapabilityProvider|CapabilityNotPresent|capability.*null/i,
    cause: "Capability 未正确注册或查询方式错误",
    fix: [
      "检查是否在 AttachCapabilitiesEvent 中正确注册了 Capability Provider",
      "使用 player.getCapability().ifPresent() 而不是直接调用 .get()",
      "确保 LazyOptional 未被 invalidate",
    ],
    relatedMistakes: ["mc-capability: getCapability 返回 null"],
  },
  {
    pattern: /NullPointerException.*BlockEntity|BlockEntity.*null/i,
    cause: "BlockEntity 访问了 world 数据但 world 为 null",
    fix: [
      "在 BlockEntity 构造函数中不要访问 world",
      "在 load() 中先检查 level.hasChunkAt(blockPos)",
      "使用 @Nullable 标注可能为 null 的 world 引用",
    ],
    relatedMistakes: ["mc-block: 在 BlockEntity 构造函数中访问 world"],
  },
  {
    pattern: /ClassCastException.*LivingEntity|LivingEntity.*cast/i,
    cause: "实体类型强制转换错误",
    fix: [
      "使用 instanceof 检查实体类型再强制转换",
      "检查 EntityType 是否正确注册",
    ],
    relatedMistakes: [],
  },
  {
    pattern: /OnlyIn.*CLIENT|Dist.*CLIENT.*server/i,
    cause: "在错误的物理端执行了代码",
    fix: [
      "使用 DistExecutor 或 @OnlyIn(Dist.CLIENT) 限定客户端代码",
      "检查是否在服务端调用了客户端特有 API（如 Minecraft.getInstance()）",
    ],
    relatedMistakes: ["mc-client-server: 在服务端调用客户端代码"],
  },
  {
    pattern: /Mixin|@Inject|@Shadow.*error|inject.*failed/i,
    cause: "Mixin 注入失败",
    fix: [
      "检查 @At 注解是否正确（HEAD/RETURN/INVOKE）",
      "确保 mixin 类名与 mixins.json 中配置一致",
      "检查 @Shadow 字段是否存在于目标类中",
      "确认 javadoc 没有被混淆破坏",
    ],
    relatedMistakes: ["mc-mixin: @Inject 参数错误"],
  },
  {
    pattern: /DeferredRegister|RegistryObject.*null|register.*before/i,
    cause: "DeferredRegister 使用时机错误",
    fix: [
      "不要在 lambda 表达式外部引用 RegistryObject",
      "确保在 mod 构造函数中调用了 register(modEventBus)",
    ],
    relatedMistakes: ["mc-registry: 在 lambda 外引用 RegistryObject"],
  },
  {
    pattern: /RecipeProvider|DataGenerator|gatherData|datagen/i,
    cause: "DataGen 相关问题",
    fix: [
      "检查 GatherDataEvent 是否正确注册",
      "确保 src/generated/resources/ 目录存在且未被手动编辑",
      "检查 Provider 构造函数参数是否正确",
    ],
    relatedMistakes: [],
  },
  {
    pattern: /mods\.toml|ModFileLocator|mod.*loading.*failed/i,
    cause: "mods.toml 配置错误导致 mod 加载失败",
    fix: [
      "检查 modId 是否全小写",
      "检查 loaderVersion 是否匹配当前 Forge 版本",
      "检查 mandatory 依赖是否存在",
    ],
    relatedMistakes: [],
  },
  // ── 新增 #9 ~ #16 ──────────────────────────────────────────────────
  {
    pattern: /BlockItem.*null|BlockItem.*NPE|BlockItem.*NullPointer/i,
    cause: "Block 未注册对应的 BlockItem",
    fix: [
      "检查是否用 ITEMS.register() 注册了同名物品",
      "如果不需要物品形态，确保代码中不会调用 block.asItem() 或 getItemFromBlock()",
      "Forge 不会自动为方块注册 BlockItem，必须显式注册",
    ],
    relatedMistakes: ["mc-block: 方块注册了但 BlockItem 未注册"],
  },
  {
    pattern: /BuildCreativeModeTabContentsEvent|CreativeModeTab.*null/i,
    cause: "CreativeModeTab 未正确注册，或物品未添加到 Tab",
    fix: [
      "使用 DeferredRegister<CreativeModeTab> 注册 CreativeModeTab",
      "在 mod 构造函数中调用 CREATIVE_TABS.register(FMLJavaModLoadingContext.get().getModEventBus())",
      "通过 BuildCreativeModeTabContentsEvent 的 event.accept() 添加物品",
      "不要在 CreativeModeTab.builder().displayItems 中引用尚未注册的对象",
    ],
    relatedMistakes: ["mc-item: CreativeModeTab 未注册导致物品无法显示"],
  },
  {
    pattern: /Packet.*discId|IMessage.*id|messageType.*conflict/i,
    cause: "网络包 ID 冲突或序列化错误",
    fix: [
      "检查 SimpleChannel 中各消息的 discId() 返回值是否唯一",
      "确保 @Nullable 参数在 toBytes/fromBytes 中正确处理",
      "检查 PacketBuffer 是否溢出（写入过多数据）",
    ],
    relatedMistakes: ["mc-networking: 消息 ID 重复"],
  },
  {
    pattern: /SpawnPlacement.*null|SpawnPlacements.*register/i,
    cause: "实体放置逻辑未正确实现",
    fix: [
      "检查是否调用了 SpawnPlacements.register()",
      "确保 PlacementType 与实体注册顺序匹配",
      "检查 level.isValidSpawn() 逻辑是否阻塞了放置",
    ],
    relatedMistakes: ["mc-entity: 实体无法在世界中生成"],
  },
  {
    pattern: /BlockState.*getValue.*null|getProperty.*null.*BlockState|properties.*empty.*block/i,
    cause: "访问了不存在的 BlockState 属性",
    fix: [
      "检查方块类中 properties {} 块是否定义了该属性",
      "确保使用 getValue() 前先用 hasProperty() 检查属性存在",
      "检查属性名拼写是否与 BlockState 定义一致",
    ],
    relatedMistakes: ["mc-block: 访问了方块未定义的属性"],
  },
  {
    pattern: /SoundEvent.*null|SoundType.*null|missing.*sound.*registry/i,
    cause: "声音事件未注册或 SoundType 引用了未注册的声音",
    fix: [
      "检查 SOUND_EVENTS.register() 是否在 mod 构造函数中调用",
      "确保 SoundType 构造函数中的 ResourceLocation 与已注册的 SoundEvent 一致",
      "检查 resources/assets/{modId}/sounds.json 是否存在且格式正确",
    ],
    relatedMistakes: ["mc-sound: 声音事件未注册"],
  },
  {
    pattern: /LootTable.*null|loot_table.*missing|getLootTable.*null/i,
    cause: "loot table JSON 缺失或路径不正确",
    fix: [
      "检查 src/data/{modId}/loot_tables/ 目录下是否存在对应的 JSON 文件",
      "确保 JSON 文件路径与方块的 ResourceLocation 匹配（如 block/my_block.json）",
      "使用 DataGen LootTableProvider 生成，避免手动编写 JSON",
    ],
    relatedMistakes: ["mc-loot: loot table 文件缺失"],
  },
  {
    pattern: /setRegistryName.*duplicate|duplicate.*registry.*name|ResourceLocation.*already.*registered/i,
    cause: "同一注册表中注册名重复",
    fix: [
      "检查所有 setRegistryName() 调用，确保没有同名注册",
      "使用 DeferredRegister 避免手动 setRegistryName",
      "检查不同注册表（Block/Item）之间是否有意外冲突",
    ],
    relatedMistakes: ["mc-registry: 注册名重复导致覆盖"],
  },
];

export function analyzeCrash(query: CrashQuery): CrashResult {
  const { crashReport } = query;
  const deobfuscated: string[] = [];

  // 反混淆处理（去除混淆名称中的 $ 内部类引用）
  for (const line of crashReport.split("\n")) {
    const m = line.match(/([a-z][a-z0-9_]*(\\\$[a-z0-9_]+)+)/gi);
    if (m) {
      deobfuscated.push(...m);
    }
  }

  // 匹配已知模式
  for (const { pattern, cause, fix, relatedMistakes } of KNOWN_PATTERNS) {
    if (pattern.test(crashReport)) {
      return { probableCause: cause, fixSuggestions: fix, deobfuscated, relatedMistakes };
    }
  }

  // 默认响应
  const hasModLoader = /Minecraft Forge|Forge Mod Loader/i.test(crashReport);
  return {
    probableCause: hasModLoader
      ? "崩溃原因不明确，请将堆栈信息与 Forge 文档对照分析"
      : "这不是一个 Forge 崩溃报告",
    fixSuggestions: [
      "将崩溃堆栈的完整内容粘贴到 https://minecraft.wiki/w/Crash_report",
      "检查是否涉及自定义模组内容",
      "尝试使用 parchment 映射以获得更清晰的可读堆栈",
    ],
    deobfuscated,
    relatedMistakes: [],
  };
}
