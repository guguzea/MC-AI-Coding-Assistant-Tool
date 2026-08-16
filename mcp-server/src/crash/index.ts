/**
 * 崩溃日志分析模块
 *
 * 功能：
 * 1. 解析崩溃堆栈 / 文件名后缀
 * 2. 通过映射表反混淆类名
 * 3. 返回可能成因和修复建议（含 crashKind、logHints）
 */

export type CrashKind =
  | "fml"
  | "client"
  | "server"
  | "integrated-server"
  | "openGL"
  | "memory"
  | "fabric"
  | "quilt"
  | "liteloader"
  | "rift"
  | "modloader"
  | "java"
  | "unknown";

/** 认不出典型 loader 指纹时引导对照的 Wiki */
export const CRASH_REPORT_WIKI = "https://minecraft.wiki/w/Crash_report";

export interface CrashQuery {
  crashReport: string;
  version?: string;
}

export interface CrashResult {
  probableCause: string;
  fixSuggestions: string[];
  deobfuscated?: string[];
  relatedMistakes: string[];
  /** 从文件名或正文推断的崩溃类型 */
  crashKind?: CrashKind;
  /** 建议同时查看的日志 */
  logHints?: string[];
}

// 已知的常见崩溃原因模式（从 8 种扩展至 16 种 + 加载期）
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
    // BE 引用本身为 null（常见于 getBlockEntity 未判空）— 须排在 world 模式前，避免包名 world.level 误伤
    pattern:
      /because\s+"[^"]+"\s+is\s+null[\s\S]{0,80}BlockEntity|Cannot invoke "[^"]*BlockEntity[^"]*" because "[^"]+" is null/i,
    cause: "BlockEntity 引用为 null（未取到 BE，或过早使用）",
    fix: [
      "调用 level.getBlockEntity(pos) 后先判空再使用",
      "确认方块已实现 EntityBlock / newBlockEntity，且 BlockEntityType 已注册",
      "勿在方块尚未放置完成或区块未加载时假定 BE 存在",
    ],
    relatedMistakes: ["mc-blockentity: getBlockEntity 未判空"],
  },
  {
    // level/world 字段为 null（构造期或未就绪）— 匹配 because "level"/"world" is null，避免匹配包名
    pattern:
      /because\s+"(?:this\.)?(?:level|world)"\s+is\s+null|(?:getLevel\(\)|this\.level|this\.world)\s*(?:==|!=)\s*null/i,
    cause: "BlockEntity/方块逻辑访问了 level/world，但其仍为 null",
    fix: [
      "在 BlockEntity 构造函数中不要访问 level/world",
      "在 load() 中先检查 level != null 且 level.hasChunkAt(blockPos)",
      "使用 @Nullable 标注可能为 null 的 level 引用",
    ],
    relatedMistakes: ["mc-block: 在 BlockEntity 构造函数中访问 world"],
  },
  {
    // 兜底：仍含 BlockEntity + NPE，但原因不够具体
    pattern: /NullPointerException[\s\S]{0,200}BlockEntity/i,
    cause: "与 BlockEntity 相关的空指针（需结合堆栈确认是 BE 引用还是 level）",
    fix: [
      "检查 getBlockEntity 是否判空",
      "检查是否在构造/load 过早访问 level",
      "对照 authored/blockentity-persist-ticker 与 09-anti-patterns",
    ],
    relatedMistakes: ["mc-blockentity: NPE 排查"],
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
      "在 mod 构造函数中把 CREATIVE_TABS.register 接到注入的 IEventBus（NeoForge）或该平台等价入口",
      "通过 BuildCreativeModeTabContentsEvent 的 event.accept() 添加物品",
      "不要在 CreativeModeTab.builder().displayItems 中引用尚未注册的对象",
    ],
    relatedMistakes: ["mc-item: CreativeModeTab 未注册导致物品无法显示"],
  },
  {
    pattern: /Packet.*discId|IMessage.*id|messageType.*conflict/i,
    cause: "网络包 ID 冲突或序列化错误",
    fix: [
      "按加载器选择网络 API：NeoForge 用 Payload + PayloadRegistrar，不要 SimpleChannel",
      "Forge 1.20.1 才检查 SimpleChannel 各消息 discId 是否唯一",
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
  // ── 加载期：缺前置 / 版本不兼容 ──────────────────────────────────────────
  {
    pattern:
      /Missing or unsupported mandatory dependencies|MissingModException|ModLoadingException.*missing|required.*mod.*not.*found|ModNotFoundException/i,
    cause: "缺少强制依赖（前置模组未安装或不在 mods 目录）",
    fix: [
      "对照 mods.toml / fabric.mod.json 的 mandatory 依赖安装对应 jar",
      "确认依赖的 modId 拼写与对方 mods.toml 一致",
      "客户端与服务端 mods 列表保持一致",
      "可配合 search_community_docs 查阅「软依赖 / 发布」实务要点",
    ],
    relatedMistakes: ["mc-project-setup: 强制依赖未声明或未安装"],
  },
  {
    pattern:
      /ModResolutionException|Incompatible mods found|version range|VersionConstraint|ModLoadingException.*version|requires.*\[.*\].*but/i,
    cause: "模组或 loader 版本范围不兼容",
    fix: [
      "核对 Minecraft / Forge|Fabric|NeoForge 版本是否在依赖声明范围内",
      "升级或降级冲突模组到兼容构建",
      "检查 loaderVersion / depends 与当前安装是否一致",
    ],
    relatedMistakes: ["mc-project-setup: 版本范围写错"],
  },
  {
    pattern: /com\.mumfrey\.liteloader/i,
    cause: "LiteLoader 相关崩溃（客户端回调或混合映射不一致）",
    fix: [
      "混合工程必须在 build.gradle 显式钉死双方兼容的 MCP 映射（例如 mappings = 'stable_39'）",
      "NoSuchMethodError / AbstractMethodError 常因 LiteLoader API 与 Forge jar 映射不一致",
      "聊天/Tick/渲染钩子走 LiteLoader 接口（Tickable / OutboundChatListener 等），不要只写 Forge 事件",
    ],
    relatedMistakes: ["liteloader: 映射未钉死"],
  },
  {
    pattern: /org\.dimdev\.riftloader|RiftLoaderClientTweaker|org\.dimdev\.rift\.listener/i,
    cause: "Rift Loader 崩溃",
    fix: [
      "对照 rift/1.13.2/knowledge/common/ 已核实 Listener，禁止用 Fabric ModInitializer / onInitialize 记忆改入口",
      "元数据官方拼写是 riftmod.json；listeners 类须有 public 无参构造",
    ],
    relatedMistakes: ["rift: 未核实方法名"],
  },
  {
    pattern: /org\.quiltmc\.loader|QuiltLoader|quilt\.mod\.json/i,
    cause: "Quilt Loader 崩溃",
    fix: [
      "QSL 与 Fabric API 不要混用已弃用的 Registry 同步 API（QuiltRegistry ≠ Fabric Registry）",
      "检查 quilt.mod.json 的 quilt_loader.depends 与 QSL 模块是否匹配",
    ],
    relatedMistakes: ["quilt: 误用 FAPI Registry"],
  },
];

/** 从报告正文 / 路径推断 crashKind */
export function detectCrashKind(crashReport: string): CrashKind {
  const name =
    crashReport.match(/crash-\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.\d{2}-([a-zA-Z0-9-]+)\.txt/i)?.[1] ??
    crashReport.match(/File:\s*.*crash-.*-([a-zA-Z0-9-]+)\.txt/i)?.[1] ??
    "";
  const kindFromName = name.toLowerCase();
  const map: Record<string, CrashKind> = {
    fml: "fml",
    client: "client",
    server: "server",
    "integrated-server": "integrated-server",
    opengl: "openGL",
    rendering: "openGL",
    memory: "memory",
    fabric: "fabric",
    quilt: "quilt",
    liteloader: "liteloader",
    rift: "rift",
    java: "java",
  };
  const hasLoaderFingerprint =
    /Minecraft Forge|Forge Mod Loader|Fabric Loader|fabric-loader|NeoForge|net\.minecraftforge|net\.fabricmc|net\.neoforged|cpw\.mods\.modlauncher|FMLModContainer|org\.quiltmc|com\.mumfrey\.liteloader|org\.dimdev\.riftloader/i.test(
      crashReport,
    );

  // 文件名里的 fml/opengl/memory/java 可信；fabric 须先排除 Quilt 正文指纹
  if (kindFromName === "fml") return map[kindFromName];
  if (kindFromName === "opengl" || kindFromName === "rendering" || kindFromName === "memory" || kindFromName === "java") {
    return map[kindFromName];
  }

  if (/org\.quiltmc|QuiltLoader|quilt\.mod\.json/i.test(crashReport)) return "quilt";
  if (/com\.mumfrey\.liteloader/i.test(crashReport)) return "liteloader";
  if (/org\.dimdev\.riftloader|RiftLoaderClientTweaker/i.test(crashReport)) return "rift";
  if (
    /net\.minecraft\.src\.ModLoader|\bat ModLoader\.|class\s+mod_[A-Za-z0-9_]+\s+extends\s+BaseMod/i.test(crashReport) &&
    !/cpw\.mods\.fml|net\.minecraftforge|FMLModContainer/i.test(crashReport)
  ) {
    return "modloader";
  }

  if (kindFromName === "fabric") return "fabric";
  if (kindFromName && map[kindFromName] && hasLoaderFingerprint) return map[kindFromName];

  if (/net\.fabricmc|fabric loader|fabric-loader/i.test(crashReport)) return "fabric";
  if (/OutOfMemoryError|Java heap space|GC overhead/i.test(crashReport)) return "memory";
  if (/OpenGL|GLError|GLFW|RenderSystem/i.test(crashReport)) return "openGL";
  if (
    /FMLModContainer|cpw\.mods\.modlauncher|net\.minecraftforge\.fml|net\.neoforged|Missing or unsupported mandatory/i.test(
      crashReport,
    )
  ) {
    return "fml";
  }
  if (hasLoaderFingerprint && /DedicatedServer|net\.minecraft\.server\.dedicated/i.test(crashReport)) return "server";
  if (hasLoaderFingerprint && /IntegratedServer/i.test(crashReport)) return "integrated-server";
  if (hasLoaderFingerprint && /Minecraft\.getInstance|net\.minecraft\.client/i.test(crashReport)) return "client";
  return "unknown";
}

function rewriteFixesForLoader(fixes: string[], crashReport: string, crashKind: CrashKind): string[] {
  const neo = /net\.neoforged/i.test(crashReport);
  const forgeOnly = /net\.minecraftforge/i.test(crashReport) && !neo;
  const fabric = (/net\.fabricmc|fabric-loader/i.test(crashReport) && !/org\.quiltmc/i.test(crashReport)) || crashKind === "fabric";
  const quilt = /org\.quiltmc/i.test(crashReport) || crashKind === "quilt";
  const known = neo || forgeOnly || fabric || quilt || crashKind === "liteloader" || crashKind === "rift" || crashKind === "modloader";

  const mapFix = (s: string): string | null => {
    if (neo) {
      if (/FMLJavaModLoadingContext/i.test(s)) {
        return "NeoForge：CreativeModeTab / DeferredRegister 接到模组构造函数注入的 IEventBus，不要 FMLJavaModLoadingContext";
      }
      if (/SimpleChannel/i.test(s)) {
        return "NeoForge 网络用 Payload（RegisterPayloadHandler(s)Event），不要 SimpleChannel";
      }
    }
    if (fabric || quilt) {
      if (/FMLJavaModLoadingContext|SimpleChannel/i.test(s)) return null;
    }
    if (!known && crashKind === "unknown") {
      if (/FMLJavaModLoadingContext|SimpleChannel/i.test(s)) return null;
    }
    return s;
  };

  const out: string[] = [];
  for (const f of fixes) {
    const n = mapFix(f);
    if (n && !out.includes(n)) out.push(n);
  }
  if (!known && crashKind === "unknown" && out.length === 0) {
    out.push("检查注册与日志（latest.log）；不要默认输出 SimpleChannel 或 FMLJavaModLoadingContext");
  }
  return out;
}

function buildLogHints(kind: CrashKind, matchedKnown: boolean): string[] {
  const hints = ["logs/latest.log", "logs/debug.log"];
  if (kind === "fml" || kind === "fabric" || kind === "quilt" || kind === "liteloader" || kind === "rift" || kind === "modloader" || !matchedKnown) {
    return [
      "优先核对崩溃报告开头的异常与 Mod List",
      ...hints,
      "社区实务：search_community_docs 查询「崩溃」或 authored/crash-reports",
    ];
  }
  return hints;
}

export function analyzeCrash(query: CrashQuery): CrashResult {
  const { crashReport } = query;
  if (typeof crashReport === "string" && crashReport.length > 512_000) {
    return {
      probableCause: "崩溃报告过长（超过 512KB），已拒绝分析以避免阻塞 MCP",
      fixSuggestions: ["请裁剪为相关堆栈段落后再试"],
      deobfuscated: [],
      relatedMistakes: [],
      crashKind: "unknown",
      logHints: ["logs/latest.log"],
    };
  }
  const deobfuscated: string[] = [];
  const crashKind = detectCrashKind(crashReport);

  for (const line of crashReport.split("\n")) {
    const m = line.match(/([a-z][a-z0-9_]*(\\\$[a-z0-9_]+)+)/gi);
    if (m) {
      deobfuscated.push(...m);
    }
  }

  for (const { pattern, cause, fix, relatedMistakes } of KNOWN_PATTERNS) {
    if (pattern.test(crashReport)) {
      return {
        probableCause: cause,
        fixSuggestions: rewriteFixesForLoader(fix, crashReport, crashKind),
        deobfuscated,
        relatedMistakes,
        crashKind,
        logHints: buildLogHints(crashKind, true),
      };
    }
  }

  const hasModLoader = /Minecraft Forge|Forge Mod Loader|Fabric Loader|NeoForge|net\.neoforged|org\.quiltmc|com\.mumfrey\.liteloader|org\.dimdev\.riftloader/i.test(crashReport);
  const unknownHint = `未能识别为典型 Forge / Fabric / NeoForge / Quilt / LiteLoader / Rift / ModLoader 崩溃指纹（crashKind=unknown）。请打开 Minecraft Wiki 对照完整报告结构：${CRASH_REPORT_WIKI}`;
  const fmlHint =
    crashKind === "fml"
      ? "此报告疑似加载期（-fml）失败：优先查缺前置、版本范围与 mods.toml"
      : crashKind === "unknown" || !hasModLoader
        ? unknownHint
        : "崩溃原因不明确，请将堆栈信息与 Forge/Fabric 文档对照分析";

  return {
    probableCause: fmlHint,
    fixSuggestions: rewriteFixesForLoader(
      [
        `将崩溃堆栈的完整内容粘贴到 ${CRASH_REPORT_WIKI} 对照 Description / Stacktrace / System Details`,
        "检查是否涉及自定义模组内容",
        "尝试使用 parchment 映射以获得更清晰的可读堆栈",
        ...(crashKind === "fml"
          ? ["核对立即失败的 mandatory 依赖与 loader 版本", "同时打开 logs/latest.log 同时间戳段落"]
          : crashKind === "unknown"
            ? ["确认粘贴的是完整 crash-*.txt（含 ---- Minecraft Crash Report ---- 标题），而不是 latest.log 片段"]
            : []),
      ],
      crashReport,
      crashKind,
    ),
    deobfuscated,
    relatedMistakes: [],
    crashKind,
    logHints: buildLogHints(crashKind, false),
  };
}
