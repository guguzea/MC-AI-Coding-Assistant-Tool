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
  "1.20.1": {
    version: "1.20.1",
    forgeVersion: "47.x",
    recommendation: "使用 DeferredRegister 作为主要注册方式",
    keyChanges: [
      "DeferredRegister 支持 Vanilla Registry（通过 ResourceKey）",
      "BlockBehaviour.Properties 推荐使用 .of() 静态工厂",
      "CreativeModeTab 使用 DeferredRegister 注册",
      "SwordItem 构造函数（来源：MCP 层，非 Yarn）：new SwordItem(Tier tier, int attackDamageModifier, float attackSpeedModifier, Item.Properties)",
      "  最终攻击伤害 = attackDamageModifier + 3.0f（剑类内置固定加成）",
    ],
    gotchas: [
      "1.20.1 的 DeferredRegister vs 1.20.5+ DeferredRegister：API 完全一致，无需区分",
      "EntityType.Builder.build() 接受 String 参数，不是 Direction",
      "属性注册使用 ForgeRegistries.Keys.ATTRIBUTES，不是 ForgeRegistries.ATTRIBUTES",
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
