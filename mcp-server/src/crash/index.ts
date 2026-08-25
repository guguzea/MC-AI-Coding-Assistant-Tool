import { existsSync, readFileSync, statSync } from "fs";
import { actionable, versionRequiredAction, missingMcVersion, type ActionEnvelope } from "../utils/actionable.js";
import { lookupObfuscated } from "../mappings/lookup-obfuscated.js";
import { lineBounded } from "../utils/regex.js";
import { ownGet } from "../utils/own-record.js";

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
  | "vanilla"
  | "unknown";

/** 认不出典型 loader 指纹时引导对照的 Wiki */
export const CRASH_REPORT_WIKI = "https://minecraft.wiki/w/Crash_report";

export interface CrashQuery {
  crashReport?: string;
  crashReportPath?: string;
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
  ok?: boolean;
  action?: ActionEnvelope;
  /** 无 version 时为 false：IO/模式库成功，反混淆未跑 */
  analysisComplete?: boolean;
  relatedTools?: string[];
}

// 已知的常见崩溃原因模式（从 8 种扩展至 16 种 + 加载期）
const KNOWN_PATTERNS: Array<{
  pattern: RegExp;
  cause: string;
  fix: string[];
  relatedMistakes: string[];
}> = [
  {
    pattern: /CapabilityProvider|CapabilityNotPresent|capability.{0,80}null/i,
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
    pattern: new RegExp(lineBounded("ClassCastException.*LivingEntity|LivingEntity.*cast", 200), "i"),
    cause: "实体类型强制转换错误",
    fix: [
      "使用 instanceof 检查实体类型再强制转换",
      "检查 EntityType 是否正确注册",
    ],
    relatedMistakes: [],
  },
  {
    pattern: new RegExp(lineBounded("OnlyIn.*CLIENT|Dist.*CLIENT.*server", 80), "i"),
    cause: "在错误的物理端执行了代码",
    fix: [
      "使用 DistExecutor 或 @OnlyIn(Dist.CLIENT) 限定客户端代码",
      "检查是否在服务端调用了客户端特有 API（如 Minecraft.getInstance()）",
    ],
    relatedMistakes: ["mc-client-server: 在服务端调用客户端代码"],
  },
  {
    // F-E202：裸 "Mixin" 会命中 Mod List 里的 MixinExtras 字样，抢答无关崩溃；
    // 收紧为失败语义锚定（应用失败/目标缺失/非法注入等）。
    // A-4：不设反向通配段（(apply|failed|error).*mixin 会让每个 error 词触发全文回扫），
    // 正向通配全部换成行内有界量词，保证线性。
    pattern:
      /MixinApplyError|MixinTargetNotFound|InvalidInjectionException|InjectionError|CriticalInjectionFailure|mixin[^\n]{0,200}(?:apply|failed|error)|@Shadow[^\n]{0,120}error|inject[^\n]{0,120}(?:failed|error)/i,
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
    pattern: new RegExp(lineBounded("DeferredRegister|RegistryObject.*null|register.*before", 200), "i"),
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
    pattern: /mods\.toml|ModFileLocator|mod.{0,40}loading.{0,40}failed/i,
    cause: "mods.toml 配置错误导致 mod 加载失败",
    fix: [
      "检查 modId 是否全小写",
      "检查 loaderVersion 是否匹配当前 Forge 版本",
      "检查 mandatory 依赖是否存在",
    ],
    relatedMistakes: [],
  },
  {
    pattern: new RegExp(lineBounded("BlockItem.*null|BlockItem.*NPE|BlockItem.*NullPointer", 120), "i"),
    cause: "Block 未注册对应的 BlockItem",
    fix: [
      "检查是否用 ITEMS.register() 注册了同名物品",
      "如果不需要物品形态，确保代码中不会调用 block.asItem() 或 getItemFromBlock()",
      "Forge 不会自动为方块注册 BlockItem，必须显式注册",
    ],
    relatedMistakes: ["mc-block: 方块注册了但 BlockItem 未注册"],
  },
  {
    pattern: new RegExp(lineBounded("BuildCreativeModeTabContentsEvent|CreativeModeTab.*null", 120), "i"),
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
    pattern: new RegExp(lineBounded("Packet.*discId|IMessage.*id|messageType.*conflict", 120), "i"),
    cause: "网络包 ID 冲突或序列化错误",
    fix: [
      "按加载器选择网络 API：NeoForge 1.20.1 用 SimpleChannel 形态（与 Forge 1.20.1 兼容）；1.20.4+ 用 Payload + PayloadRegistrar",
      "Forge 1.20.1 / NeoForge 1.20.1 才检查 SimpleChannel 各消息 discId 是否唯一",
      "检查 PacketBuffer 是否溢出（写入过多数据）",
    ],
    relatedMistakes: ["mc-networking: 消息 ID 重复"],
  },
  {
    pattern: new RegExp(lineBounded("SpawnPlacement.*null|SpawnPlacements.*register", 120), "i"),
    cause: "实体放置逻辑未正确实现",
    fix: [
      "检查是否调用了 SpawnPlacements.register()",
      "确保 PlacementType 与实体注册顺序匹配",
      "检查 level.isValidSpawn() 逻辑是否阻塞了放置",
    ],
    relatedMistakes: ["mc-entity: 实体无法在世界中生成"],
  },
  {
    pattern: new RegExp(lineBounded("BlockState.*getValue.*null|getProperty.*null.*BlockState|properties.*empty.*block", 200), "i"),
    cause: "访问了不存在的 BlockState 属性",
    fix: [
      "检查方块类中 properties {} 块是否定义了该属性",
      "确保使用 getValue() 前先用 hasProperty() 检查属性存在",
      "检查属性名拼写是否与 BlockState 定义一致",
    ],
    relatedMistakes: ["mc-block: 访问了方块未定义的属性"],
  },
  {
    pattern: new RegExp(lineBounded("SoundEvent.*null|SoundType.*null|missing.*sound.*registry", 120), "i"),
    cause: "声音事件未注册或 SoundType 引用了未注册的声音",
    fix: [
      "检查 SOUND_EVENTS.register() 是否在 mod 构造函数中调用",
      "确保 SoundType 构造函数中的 ResourceLocation 与已注册的 SoundEvent 一致",
      "检查 resources/assets/{modId}/sounds.json 是否存在且格式正确",
    ],
    relatedMistakes: ["mc-sound: 声音事件未注册"],
  },
  {
    pattern: new RegExp(lineBounded("LootTable.*null|loot_table.*missing|getLootTable.*null", 120), "i"),
    cause: "loot table JSON 缺失或路径不正确",
    fix: [
      "检查 src/data/{modId}/loot_tables/ 目录下是否存在对应的 JSON 文件",
      "确保 JSON 文件路径与方块的 ResourceLocation 匹配（如 block/my_block.json）",
      "使用 DataGen LootTableProvider 生成，避免手动编写 JSON",
    ],
    relatedMistakes: ["mc-loot: loot table 文件缺失"],
  },
  {
    pattern: new RegExp(lineBounded("setRegistryName.*duplicate|duplicate.*registry.*name|ResourceLocation.*already.*registered", 200), "i"),
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
    pattern: new RegExp(
      lineBounded(
        "Missing or unsupported mandatory dependencies|MissingModException|ModLoadingException.*missing|required.*mod.*not.*found|ModNotFoundException",
        200,
      ),
      "i",
    ),
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
    // A-4：`requires.*\[.*\].*but` 的顺序 .* 量化在 [ 密集输入下是多项式回溯，
    // 收紧为行内否定字符类 + 有界量词。
    pattern:
      /ModResolutionException|Incompatible mods found|version range|VersionConstraint|ModLoadingException[^\n]{0,200}version|requires[^\n]{0,400}\[[^\]\n]{0,300}\][^\n]{0,200}\bbut\b/i,
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

  if (kindFromName === "fml") return ownGet(map, kindFromName) ?? "unknown";
  if (kindFromName === "server" || kindFromName === "client" || kindFromName === "integrated-server") {
    return ownGet(map, kindFromName) ?? "unknown";
  }
  if (kindFromName === "opengl" || kindFromName === "rendering" || kindFromName === "memory" || kindFromName === "java") {
    return ownGet(map, kindFromName) ?? "unknown";
  }

  // 先取 forgeLike：Quilt/LiteLoader/Rift 正文指纹必须先过 Forge/FML 强指纹排除（混合报告防误判，审计 B18）
  const forgeLike =
    /FMLModContainer|cpw\.mods\.modlauncher|net\.minecraftforge|net\.neoforged/i.test(crashReport);

  if (!forgeLike && /org\.quiltmc|QuiltLoader|quilt\.mod\.json/i.test(crashReport)) return "quilt";
  if (!forgeLike && /com\.mumfrey\.liteloader/i.test(crashReport)) return "liteloader";
  if (!forgeLike && /org\.dimdev\.riftloader|RiftLoaderClientTweaker/i.test(crashReport)) return "rift";
  if (
    /net\.minecraft\.src\.ModLoader|\bat ModLoader\.|class\s+mod_[A-Za-z0-9_]+\s+extends\s+BaseMod/i.test(crashReport) &&
    !/cpw\.mods\.fml|net\.minecraftforge|FMLModContainer/i.test(crashReport)
  ) {
    return "modloader";
  }

  // Forgified Fabric API（NeoForge/Forge 上跑 Fabric 模组的事实标准）保留 net.fabricmc.fabric.api.* 包名：
  // fabric 判定必须排除 Forge/FML 强指纹，否则 NeoForge/Forge 报告会被误判为 fabric（镜像 modloader 分支的负排除写法）

  if (kindFromName === "fabric") {
    if (!forgeLike) return "fabric";
  } else if (kindFromName && ownGet(map, kindFromName) && hasLoaderFingerprint) {
    return ownGet(map, kindFromName)!;
  }

  if (/net\.fabricmc|fabric loader|fabric-loader/i.test(crashReport) && !forgeLike) return "fabric";
  if (/OutOfMemoryError|Java heap space|GC overhead/i.test(crashReport)) return "memory";
  if (/OpenGL|GLError|GLFW error|LWJGL/i.test(crashReport)) return "openGL";
  if (/\bRenderSystem\b/i.test(crashReport) && /GLError|GLFW|OpenGL|lwjgl/i.test(crashReport)) return "openGL";
  if (
    /FMLModContainer|cpw\.mods\.modlauncher|net\.minecraftforge\.fml|net\.neoforged|Missing or unsupported mandatory/i.test(
      crashReport,
    )
  ) {
    return "fml";
  }
  if (hasLoaderFingerprint && /DedicatedServer|net\.minecraft\.server\.dedicated/i.test(crashReport)) return "server";
  if (!hasLoaderFingerprint && /DedicatedServer|net\.minecraft\.server\.dedicated|-server\.(txt|log)/i.test(crashReport)) {
    return "vanilla";
  }
  if (hasLoaderFingerprint && /IntegratedServer/i.test(crashReport)) return "integrated-server";
  if (hasLoaderFingerprint && /Minecraft\.getInstance|net\.minecraft\.client/i.test(crashReport)) return "client";
  return "unknown";
}

function rewriteFixesForLoader(
  fixes: string[],
  crashReport: string,
  crashKind: CrashKind,
  version?: string,
): string[] {
  const neo = /net\.neoforged/i.test(crashReport);
  const forgeOnly = /net\.minecraftforge/i.test(crashReport) && !neo;
  // Forgified Fabric API 保留 net.fabricmc.* 栈帧：NeoForge/Forge 报告不得按 fabric 丢弃 FML/SimpleChannel 建议
  const fabric =
    (/net\.fabricmc|fabric-loader/i.test(crashReport) && !/org\.quiltmc/i.test(crashReport) && !neo && !forgeOnly) ||
    crashKind === "fabric";
  const quilt = /org\.quiltmc/i.test(crashReport) || crashKind === "quilt";
  const known = neo || forgeOnly || fabric || quilt || crashKind === "liteloader" || crashKind === "rift" || crashKind === "modloader";
  const v = version?.trim() ?? "";
  const neoNoDistExecutor = neo && (/^26\.1/.test(v) || v === "1.21.1");

  const mapFix = (s: string): string | null => {
    if (/DistExecutor|@OnlyIn\(Dist\.CLIENT\)/.test(s)) {
      if (neoNoDistExecutor) {
        return "客户端专用代码放 @Mod(dist = Dist.CLIENT) 模组或 client 子包（@EventBusSubscriber(value = Dist.CLIENT)），不要用 DistExecutor";
      }
    }
    if (neo) {
      if (/FMLJavaModLoadingContext/i.test(s)) {
        return "NeoForge：CreativeModeTab / DeferredRegister 接到模组构造函数注入的 IEventBus，不要 FMLJavaModLoadingContext";
      }
      if (/SimpleChannel/i.test(s)) {
        if (v === "1.20.1") {
          return "NeoForge 1.20.1 网络是 SimpleChannel 形态（与 Forge 1.20.1 兼容）；检查 discId 是否唯一。禁止 1.20.4+ Payload";
        }
        return "NeoForge 1.20.4+ 网络用 Payload（RegisterPayloadHandler(s)Event），不要 SimpleChannel";
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

function relatedToolsForCrashVersion(version: string): string[] {
  if (/^26\.|^1\.21/.test(version.trim())) {
    return ["search_neoforge_docs", "search_fabric_docs", "lookup_obfuscated"];
  }
  return ["lookup_obfuscated", "convert_mapping", "search_forge_docs"];
}

function lookupCrashTokens(crashReport: string, version: string): string[] {
  const tokens = new Set<string>();
  const named = /\b((?:func|method|field)_[0-9A-Za-z_]+)\b/g;
  let m: RegExpExecArray | null;
  while ((m = named.exec(crashReport))) {
    tokens.add(m[1]);
    if (tokens.size >= 16) break;
  }
  const shortRe = /\.([a-z]{1,3})\(/g;
  const skipShort = new Set(["get", "of", "run", "set", "is", "to", "as", "eq", "add", "put"]);
  while (tokens.size < 20 && (m = shortRe.exec(crashReport))) {
    if (skipShort.has(m[1])) continue;
    tokens.add(m[1]);
  }
  const lines: string[] = [];
  for (const t of tokens) {
    const r = lookupObfuscated({ name: t, version });
    if (r.found) {
      lines.push(`${t} → ${r.yarn ?? r.mojang ?? "?"}`);
    }
  }
  return lines;
}

function finishCrash(partial: CrashResult, version: string | undefined, crashReport: string): CrashResult {
  const deobfuscated = [...(partial.deobfuscated ?? [])];
  if (missingMcVersion(version)) {
    return {
      ...partial,
      deobfuscated,
      ok: true,
      analysisComplete: false,
      action: versionRequiredAction(),
    };
  }
  const v = version!.trim();
  deobfuscated.push(...lookupCrashTokens(crashReport, v));
  return {
    ...partial,
    deobfuscated,
    ok: true,
    analysisComplete: true,
    relatedTools: relatedToolsForCrashVersion(v),
  };
}

export function analyzeCrash(query: CrashQuery): CrashResult {
  let crashReport = query.crashReport;
  if (!crashReport?.trim() && query.crashReportPath) {
    const p = query.crashReportPath;
    try {
      if (!existsSync(p) || !statSync(p).isFile()) {
        const action = actionable("INVALID_INPUT", `无法读取 crashReportPath：${p}`, [
          "传入崩溃报告全文 crashReport，或有效的 crashReportPath",
        ]);
        return {
          ok: false,
          probableCause: action.message,
          fixSuggestions: action.nextSteps,
          deobfuscated: [],
          relatedMistakes: [],
          crashKind: "unknown",
          logHints: [],
          action,
        };
      }
      const st = statSync(p);
      if (st.size > 512_000) {
        const action = actionable("INVALID_INPUT", "崩溃报告过长（超过 512KB），已拒绝分析以避免阻塞 MCP", [
          "请裁剪为相关堆栈段落后再试",
        ]);
        return {
          ok: false,
          probableCause: action.message,
          fixSuggestions: action.nextSteps,
          deobfuscated: [],
          relatedMistakes: [],
          crashKind: "unknown",
          logHints: ["logs/latest.log"],
          action,
        };
      }
      crashReport = readFileSync(p, "utf8");
    } catch (err) {
      const action = actionable("INVALID_INPUT", `读取 crashReportPath 失败：${(err as Error).message}`, [
        "检查路径是否存在且可读",
      ]);
      return {
        ok: false,
        probableCause: action.message,
        fixSuggestions: action.nextSteps,
        deobfuscated: [],
        relatedMistakes: [],
        crashKind: "unknown",
        logHints: [],
        action,
      };
    }
  }
  if (!crashReport?.trim()) {
    const action = actionable("INVALID_INPUT", "需要 crashReport 或 crashReportPath", [
      "传入崩溃报告全文，或 CLI 使用 --crashReport @./crash-reports/latest.txt",
    ]);
    return {
      ok: false,
      probableCause: action.message,
      fixSuggestions: action.nextSteps,
      deobfuscated: [],
      relatedMistakes: [],
      crashKind: "unknown",
      logHints: [],
      action,
    };
  }
  if (typeof crashReport === "string" && crashReport.length > 512_000) {
    const action = actionable("INVALID_INPUT", "崩溃报告过长（超过 512KB），已拒绝分析以避免阻塞 MCP", [
      "请裁剪为相关堆栈段落后再试",
    ]);
    return {
      ok: false,
      probableCause: action.message,
      fixSuggestions: action.nextSteps,
      deobfuscated: [],
      relatedMistakes: [],
      crashKind: "unknown",
      logHints: ["logs/latest.log"],
      action,
    };
  }
  const deobfuscated: string[] = [];
  const crashKind = detectCrashKind(crashReport);

  for (const line of crashReport.split("\n")) {
    const m = line.match(/([a-z][a-z0-9_]*(\$[a-z0-9_]+)+)/gi);
    if (m) {
      for (const name of m) {
        if (/^lambda\$/i.test(name)) continue;
        if (/\$Properties$/i.test(name)) continue;
        deobfuscated.push(name);
      }
    }
  }

  for (const { pattern, cause, fix, relatedMistakes } of KNOWN_PATTERNS) {
    if (pattern.test(crashReport)) {
      return finishCrash(
        {
          probableCause: cause,
          fixSuggestions: rewriteFixesForLoader(fix, crashReport, crashKind, query.version),
          deobfuscated,
          relatedMistakes,
          crashKind,
          logHints: buildLogHints(crashKind, true),
        },
        query.version,
        crashReport,
      );
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

  return finishCrash(
    {
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
        query.version,
      ),
      deobfuscated,
      relatedMistakes: [],
      crashKind,
      logHints: buildLogHints(crashKind, false),
    },
    query.version,
    crashReport,
  );
}
