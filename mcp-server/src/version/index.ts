/**
 * 版本适配信息模块（仅 Forge；其它 platform 直接 WRONG_TOOL）
 *
 * 实现现状（不是 TODO）：
 * - 「版本→变更点」索引已存在：下方 VERSION_DB 的 keyChanges / gotchas，为**仓库内手工
 *   维护表**（每档需人工核实后才写入），覆盖 1.7.10 / 1.12.2 / 1.13.2 / 1.14.4 / 1.15.2 /
 *   1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 / 1.21.1 共 12 档。
 * - links.forgeChangelog 指向该档的**构建目录列表页**
 *   `https://files.minecraftforge.net/net/minecraftforge/forge/index_<version>.html`
 *   （实测 maven.minecraftforge.net 同路径 404、files.minecraftforge.net 200，旧值已改），
 *   不是官方 changelog 正文；1.7.10 与 1.12.2 该字段为空串。
 * - 未收录版本（含 1.21.11 / 26.1 / 27.x）走 getVersionInfo 末尾分支：
 *   ok=false + forgeVersion="unknown" + 引导到 search_forge_docs / list_forge_versions。
 *
 * 仍未做（故本表必须人工回补）：没有自动抓取官方发布页/PR 来增量填充 VERSION_DB，
 * 新档位的 keyChanges 只能人工核实后写入；未核实前宁可返回 ok=false，不许猜。
 */

import { ownGet } from "../utils/own-record.js";
import { actionable, ActionCodes, type ActionEnvelope } from "../utils/actionable.js";

export interface VersionQuery {
  version: string;
  action: string;
  platform?: string;
}

export interface VersionInfo {
  version: string;
  forgeVersion: string;
  note?: string;
  recommendation: string;
  keyChanges: string[];
  gotchas: string[];
  links: {
    forgeChangelog: string;
    parchmentMappings: string;
    minecraftWiki: string;
  };
  ok?: boolean;
  action?: ActionEnvelope;
}

/** 注册 hint 用显式模式，避免靠 recommendation 词匹配误导。未列入的版本保持旧 fallback 句。 */
type RegisterMode = "deferred" | "registryEvent" | "docsOnly";

const REGISTER_MODE: Record<string, RegisterMode> = {
  "1.20.4": "deferred",
  "1.20.1": "deferred",
  "1.19.4": "deferred",
  "1.18.2": "deferred",
  "1.17.1": "deferred",
  "1.13.2": "registryEvent",
  "1.12.2": "registryEvent",
  "1.21.1": "docsOnly",
};

const VERSION_DB: Record<string, VersionInfo> = {
  "1.20.4": {
    version: "1.20.4",
    forgeVersion: "49.x",
    note: "Forge 1.20.4 为最后一个官方版本，之后转向 NeoForge",
    recommendation: "使用 DeferredRegister 作为主要注册方式；Forge 1.20.4 为最后官方版",
    keyChanges: [
      "Forge 1.20.4 为最后官方版，后续 NeoForge 维护",
      "与 1.20.1 注册 API 相同",
    ],
    gotchas: [
      "1.20.4 之后应使用 NeoForge 而非 Forge",
      "NeoForge 包名从 net.minecraftforge 迁移到 net.neoforged",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.20.4.html",
      parchmentMappings: "https://mappings.xhyrom.dev/1.20.4/",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.20.4",
    },
  },
  "1.20.1": {
    version: "1.20.1",
    forgeVersion: "47.x",
    recommendation: "使用 DeferredRegister 作为主要注册方式",
    keyChanges: [
      "DeferredRegister 支持 Vanilla Registry（通过 ResourceKey）",
      "BlockBehaviour.Properties 推荐使用 .of() 静态工厂",
      "CreativeModeTab 使用 DeferredRegister 注册",
    ],
    gotchas: [
      "EntityType.Builder.build() 接受 String 参数，不是 Direction",
      "属性注册使用 ForgeRegistries.Keys.ATTRIBUTES",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.20.1.html",
      parchmentMappings: "https://mappings.xhyrom.dev/1.20.1/",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.20.1",
    },
  },
  "1.19.4": {
    version: "1.19.4",
    forgeVersion: "45.x",
    recommendation: "使用 DeferredRegister 作为主要注册方式；RegisterEvent 仍可用但不推荐",
    keyChanges: [
      "ForgeGradle 5.x 升级到 6.x",
      "Mojang 映射名称变更",
    ],
    gotchas: [
      "RegisterEvent 仍可用，但不推荐（DeferredRegister 封装了它）",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.19.4.html",
      parchmentMappings: "https://mappings.xhyrom.dev/1.19.4/",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.19.4",
    },
  },
  "1.18.2": {
    version: "1.18.2",
    forgeVersion: "40.x",
    recommendation: "DeferredRegister 成为主流写法，但 RegistryEvent.Register<T> 仍可用",
    keyChanges: [
      "Java 16 → Java 17",
      "DeferredRegister 广泛使用",
      "ForgeGradle 5 项目结构（不是 ForgeGradle 7）",
    ],
    gotchas: [
      "数据生成器（DataGenerator）架构与 1.17.x 有差异",
      "Capability API 基本稳定",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.18.2.html",
      parchmentMappings: "https://mappings.xhyrom.dev/1.18.2/",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.18.2",
    },
  },
  "1.17.1": {
    version: "1.17.1",
    forgeVersion: "37.x",
    recommendation: "DeferredRegister 正式引入，推荐使用",
    keyChanges: [
      "Java 8 → Java 16（必须）",
      "ForgeGradle 5 重构（不是 ForgeGradle 7）",
      "DeferredRegister 正式引入",
      "数据生成器完全重构",
      "包名从 net.minecraftforge 保持，但结构变化大",
    ],
    gotchas: [
      "项目结构与 1.16.x 完全不兼容",
      "必须使用 Java 16+ 编译",
      "推荐使用 Parchment mappings 获取参数名",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.17.1.html",
      parchmentMappings: "https://mappings.xhyrom.dev/1.17.1/",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.17.1",
    },
  },
  "1.16.5": {
    version: "1.16.5",
    forgeVersion: "36.x",
    recommendation: "RegistryEvent.Register<T> + 旧版注册方式",
    keyChanges: [
      "MCP 可选切换为 MojMaps",
      "包名使用混淆前的 SRG 名称",
    ],
    gotchas: [
      "使用 MCP mappings 时类名与方法名与 Mojang 名不同",
      "切换为 MojMaps 后需重新理解混淆名",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.16.5.html",
      parchmentMappings: "",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.16.5",
    },
  },
  "1.14.4": {
    version: "1.14.4",
    forgeVersion: "26.x",
    recommendation: "ForgeGradle 3 项目结构，资源加载 API 完全重构",
    keyChanges: [
      "项目结构完全重写（ForgeGradle 2.x → 3.x）",
      "资源加载 API 完全重构",
      "新注册方式引入",
    ],
    gotchas: [
      "与 1.12.x 的代码完全不兼容",
      "需要从头创建项目",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.14.4.html",
      parchmentMappings: "",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.14.4",
    },
  },
  "1.12.2": {
    version: "1.12.2",
    forgeVersion: "14.23.x",
    recommendation: "Legacy 版本，使用 @SubscribeEvent + RegistryEvent",
    keyChanges: [
      "@ForgeSubscribe → @SubscribeEvent",
      "Legacy 注册方式",
    ],
    gotchas: [
      "ForgeGradle 1.x/2.x 项目结构",
      "Java 8",
      "不支持 DeferredRegister",
    ],
    links: {
      forgeChangelog: "",
      parchmentMappings: "",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.12.2",
    },
  },
  "1.21.1": {
    version: "1.21.1",
    forgeVersion: "52.x",
    recommendation: "用 search_forge_docs + list_forge_versions；本仓库规则包可能仍为 draft，禁止用 Neo 1.21.1 00–10 顶上",
    keyChanges: [
      "Forge 1.21.x 与 NeoForge 并行；不要把 Neo 文档当 Forge 教程",
    ],
    gotchas: [
      "规则树若 pack-status=draft 则 session/write 禁止",
      "请用 search_forge_docs，不要假设 1.20.1 DeferredRegister 文档 URL",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.21.1.html",
      parchmentMappings: "",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.21.1",
    },
  },
  "1.15.2": {
    version: "1.15.2",
    forgeVersion: "31.x",
    recommendation: "ForgeGradle 3 结构，注册以该版 search_forge_docs 为准",
    keyChanges: [
      "1.14–1.15 资源与注册已与 1.12 不兼容",
    ],
    gotchas: [
      "不要套用 1.20 DeferredRegister 记忆",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.15.2.html",
      parchmentMappings: "",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.15.2",
    },
  },
  "1.13.2": {
    version: "1.13.2",
    forgeVersion: "25.x",
    recommendation: "扁平化与 1.13 注册；用 search_forge_docs，不要套 1.12 或 1.16 记忆",
    keyChanges: [
      "1.13 扁平化，数字 ID 移除",
    ],
    gotchas: [
      "不支持 DeferredRegister",
    ],
    links: {
      forgeChangelog: "https://files.minecraftforge.net/net/minecraftforge/forge/index_1.13.2.html",
      parchmentMappings: "",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.13.2",
    },
  },
  "1.7.10": {
    version: "1.7.10",
    forgeVersion: "10.13.x",
    recommendation: "仅 javadoc / 核实表；无完整 00–10 教程树时不要发明 API",
    keyChanges: [
      "Java 7/8，ForgeGradle 1.x",
    ],
    gotchas: [
      "官方 MDK 可能 MDK_NOT_PINNED / 404，禁止伪造 pin",
      "不要用 1.12+ RegistryEvent 或 DeferredRegister",
    ],
    links: {
      forgeChangelog: "",
      parchmentMappings: "",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.7.10",
    },
  },
};

export async function getVersionInfo(query: VersionQuery): Promise<VersionInfo> {
  const platform = (query.platform ?? "").trim().toLowerCase();
  if (platform !== "forge") {
    return {
      ok: false,
      version: query.version,
      forgeVersion: "unknown",
      recommendation:
        "本工具仅 Forge；Fabric/Neo 请用 search_*_docs。不要把 get_version_info 当跨平台顾问。",
      keyChanges: [],
      gotchas: ["WRONG_TOOL：platform 必须显式为 forge"],
      links: {
        forgeChangelog: "",
        parchmentMappings: "",
        minecraftWiki: "",
      },
      action: actionable(
        ActionCodes.WRONG_TOOL,
        "本工具仅 Forge；Fabric/Neo 请用 search_*_docs。不要把 get_version_info 当跨平台顾问。",
        [
          "传入 platform=forge 后再查 Forge 版本建议",
          "Fabric 用 search_fabric_docs",
          "NeoForge 用 search_neoforge_docs",
          "Quilt / 基岩不要调本工具",
        ],
        ["search_forge_docs", "search_fabric_docs", "search_neoforge_docs", "list_neoforge_versions"],
      ),
    };
  }
  const { version, action } = query;
  const known = ownGet(VERSION_DB, version);

  if (known) {
    const tailored = suggestBasedOnAction(known, action);
    return tailored;
  }

  return {
    ok: false,
    version,
    forgeVersion: "unknown",
    recommendation: `未收录版本 ${version}，请查阅官方文档`,
    keyChanges: [],
    gotchas: [
      `Minecraft ${version} 不在已知版本列表中`,
      "请用 search_forge_docs + list_forge_versions，不要假设 1.20.x 文档 URL",
    ],
    links: {
      forgeChangelog: "",
      parchmentMappings: `https://mappings.xhyrom.dev/${version}/`,
      minecraftWiki: `https://minecraft.wiki/w/Java Edition ${version}`,
    },
  };
}

function suggestBasedOnAction(info: VersionInfo, action: string): VersionInfo {
  const lower = action.toLowerCase();

  if (lower.includes("注册") || lower.includes("register")) {
    const mode = ownGet(REGISTER_MODE, info.version);
    const registerHint =
      mode === "deferred"
        ? "注册流程：创建 DeferredRegister → 定义 RegistryObject → register(modEventBus)"
        : mode === "registryEvent"
          ? "注册流程：@SubscribeEvent + RegistryEvent.Register<T>"
          : mode === "docsOnly"
            ? "请用 search_forge_docs / list_forge_versions 查本版注册 API，不要套用邻版注册写法"
            : "注册请按本版 recommendation，不要套用 1.20 DeferredRegister";
    return {
      ...info,
      recommendation: `${info.recommendation}。${registerHint}`,
    };
  }
  if (lower.includes("方块实体") || lower.includes("blockentity")) {
    const v = info.version;
    if (/^1\.(7|8|9|10|11|12|13|14|15|16)(\.|$)/.test(v)) {
      return {
        ...info,
        recommendation:
          "方块实体需实现 ITileEntityProvider 或继承 BlockContainer；不要使用 EntityBlock / getTicker（那是 1.17+ API）",
      };
    }
    const mode = ownGet(REGISTER_MODE, v);
    if (mode === "docsOnly") {
      return {
        ...info,
        recommendation: "请用 search_forge_docs 查本版方块实体 API，不要套用邻版 EntityBlock/getTicker 或具体注册键",
      };
    }
    return {
      ...info,
      recommendation: "方块实体需实现 EntityBlock 接口，重写 newBlockEntity() 和可选的 getTicker()",
    };
  }
  if (lower.includes("属性") || lower.includes("attribute")) {
    const mode = ownGet(REGISTER_MODE, info.version);
    if (mode === "docsOnly") {
      return {
        ...info,
        recommendation: "请用 search_forge_docs 查本版属性注册 API，不要套用邻版属性注册键与具体类名",
      };
    }
    const usesDeferred = ownGet(REGISTER_MODE, info.version) === "deferred";
    const is117plus = (() => {
      const m = info.version.match(/^(\d+)\.(\d+)/);
      if (!m) return false;
      const maj = Number(m[1]);
      const min = Number(m[2]);
      return maj > 1 || (maj === 1 && min >= 17);
    })();
    if (usesDeferred || is117plus) {
      return {
        ...info,
        recommendation: `属性通过 ForgeRegistries.Keys.ATTRIBUTES 注册，使用 RangedAttribute 管理范围属性`,
      };
    }
    return info;
  }

  return info;
}
