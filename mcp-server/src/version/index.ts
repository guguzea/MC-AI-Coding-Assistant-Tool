/**
 * 版本适配信息模块
 *
 * TODO（上线前填充）：
 * - 接入 Forge 官方 Changelog 页面
 * - 建立版本→变更点 索引
 */

export interface VersionQuery {
  version: string;
  action: string;
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
}

const VERSION_DB: Record<string, VersionInfo> = {
  "1.20.4": {
    version: "1.20.4",
    forgeVersion: "47.x",
    note: "Forge 1.20.4 为最后一个官方版本，之后转向 NeoForge",
    recommendation: "Forge 1.20.4 + NeoForge 20.4.237，与 1.20.1 API 基本兼容",
    keyChanges: [
      "Forge 1.20.4 为最后官方版，后续 NeoForge 维护",
      "与 1.20.1 注册 API 相同",
    ],
    gotchas: [
      "1.20.4 之后应使用 NeoForge 而非 Forge",
      "NeoForge 包名从 net.minecraftforge 迁移到 net.neoforged",
    ],
    links: {
      forgeChangelog: "https://maven.minecraftforge.net/net/minecraftforge/forge/index_1.20.4.html",
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
      forgeChangelog: "https://maven.minecraftforge.net/net/minecraftforge/forge/index_1.20.1.html",
      parchmentMappings: "https://mappings.xhyrom.dev/1.20.1/",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.20.1",
    },
  },
  "1.19.4": {
    version: "1.19.4",
    forgeVersion: "45.x",
    recommendation: "RegistryEvent.Register<T> 为主要方式",
    keyChanges: [
      "ForgeGradle 5.x 升级到 6.x",
      "Mojang 映射名称变更",
    ],
    gotchas: [
      "与 1.20.x 的注册 API 有显著差异",
    ],
    links: {
      forgeChangelog: "https://maven.minecraftforge.net/net/minecraftforge/forge/index_1.19.4.html",
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
      "ForgeGradle 7 项目结构稳定",
    ],
    gotchas: [
      "数据生成器（DataGenerator）架构与 1.17.x 有差异",
      "Capability API 基本稳定",
    ],
    links: {
      forgeChangelog: "https://maven.minecraftforge.net/net/minecraftforge/forge/index_1.18.2.html",
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
      "ForgeGradle 7 完全重构",
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
      forgeChangelog: "https://maven.minecraftforge.net/net/minecraftforge/forge/index_1.17.1.html",
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
      forgeChangelog: "https://maven.minecraftforge.net/net/minecraftforge/forge/index_1.16.5.html",
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
      forgeChangelog: "https://maven.minecraftforge.net/net/minecraftforge/forge/index_1.14.4.html",
      parchmentMappings: "",
      minecraftWiki: "https://minecraft.wiki/w/Java Edition 1.14.4",
    },
  },
  "1.12.2": {
    version: "1.12.2",
    forgeVersion: "14.23.x",
    recommendation: "Legacy 版本，使用 @SubscribeEvent + RegistryEvent",
    keyChanges: [
      "mcmod.info → mods.toml",
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
};

export async function getVersionInfo(query: VersionQuery): Promise<VersionInfo> {
  const { version, action } = query;
  const known = VERSION_DB[version];

  if (known) {
    const tailored = suggestBasedOnAction(known, action);
    return tailored;
  }

  return {
    version,
    forgeVersion: "unknown",
    recommendation: `未收录版本 ${version}，请查阅官方文档`,
    keyChanges: [],
    gotchas: [
      `Minecraft ${version} 不在已知版本列表中`,
      `建议查阅：https://docs.minecraftforge.net/en/1.20.x/`,
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
    return {
      ...info,
      recommendation: `${info.recommendation}。注册流程：创建 DeferredRegister → 定义 RegistryObject → register(modEventBus)`,
    };
  }
  if (lower.includes("方块实体") || lower.includes("blockentity")) {
    return {
      ...info,
      recommendation: "方块实体需实现 EntityBlock 接口，重写 newBlockEntity() 和可选的 getTicker()",
    };
  }
  if (lower.includes("属性") || lower.includes("attribute")) {
    return {
      ...info,
      recommendation: `属性通过 ForgeRegistries.Keys.ATTRIBUTES 注册，使用 RangedAttribute 管理范围属性`,
    };
  }

  return info;
}
