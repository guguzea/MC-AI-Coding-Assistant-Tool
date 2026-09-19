# 术语表

## 核心概念

### DeferredRegister
: NeoForge 1.18+ 推荐的注册方式。延迟注册到 `RegistryEvent`，避免在 mod 构造函数执行前引用未注册的内容。

### RegistryObject / DeferredHolder
: 持有注册表条目的懒引用。`.get()` 在注册完成后才返回实际对象，可在 lambda 内部安全使用。

### Mixin
: SpongePowered Mixin 框架，通过字节码注入修改 Minecraft / NeoForge 类的行为。需在 `neoforge.mods.toml` 中声明。

### Capability
: NeoForge 的跨对象数据共享机制。通过 `IItemHandler`、`IFluidHandler`、`IEnergyStorage` 等接口附加到 Entity / BlockEntity / ItemStack。

### DataGen（数据生成器）
: Gradle 任务，自动化生成 `src/generated/resources/` 中的 JSON 数据文件（配方、战利品表、模型等）。

### pack_format
: 数据包 / 资源包的版本标识。不同 Minecraft 版本有不同的 pack_format 值，错误会导致加载失败。

### ParchmentMC
: 社区维护的 Minecraft 映射项目，提供带参数名和 javadoc 的非官方映射层。

---

## 注册表

### Registries / BuiltInRegistries
: Vanilla 注册表键（`Registries.BLOCK`、`Registries.ITEM` 等）。NeoForge 的 `DeferredRegister.create(Registries.BLOCK, modId)` 注册方块/物品；扩展注册表用 `DeferredRegister.createBlocks(modId)` / `createItems(modId)`。

### ResourceKey
: Vanilla 注册表的键（如 `Registries.BIOME`），用于 `DeferredRegister.create(ResourceKey, modId)`。

### NeoForgeRegistries.Keys（历史）
: 旧文档中的 `NeoForgeRegistries.Keys.XXX` 已弃用；方块/物品请用 `Registries.BLOCK` / `Registries.ITEM`，或 `DeferredRegister.createBlocks(modId)` / `createItems(modId)`。

---

## 构建系统

### ModDevGradle（MDG）
: NeoForge 官方 Gradle 插件之一，插件 id `net.neoforged.moddev`，DSL 入口 `neoForge { version = project.neo_version }` + `parchment { }` + `runs { }`。本仓 9 份 `neoforge/<ver>/scaffold/build.gradle` 用它（`1.20.4` 钉 `2.0.143`，其余 8 份钉 `2.0.144`）。

### NeoGradle
: 官方 Mod Generator 对同版另提供的另一套插件，插件 id `net.neoforged.gradle.userdev`（maven.neoforged.net 最新 `7.1.38`，2026-09-11 实测）。DSL 与 MDG 不同名，两套不能同工程混上。
: 注意：裸 `net.neoforged.gradle` 是 **旧 Forge 时代**的 NeoGradle，插件门户上最新只到 `6.0.21`；`net.minecraftforge.gradle` 则是 ForgeGradle，只属于 Forge 档。

### Foojay Toolchains
: Gradle 插件，通过 `org.gradle.toolchains.foojay-resolver-convention` 自动下载正确的 Java JDK。本仓 8 份 `neoforge/<ver>/scaffold/settings.gradle` 钉 `1.0.0`（`26.1` 档 scaffold 只有 `README.md` / `build.gradle` / `src`，没有 settings.gradle）。

### userdev
: NeoGradle 的特殊分类器 artifact，包含开发环境所需的 MCP 配置和反编译工具。

---

## 事件系统

### FMLCommonSetupEvent
: 所有 mod 构造函数执行完毕后的初始化事件，用于跨 mod 交互。

### FMLClientSetupEvent
: 客户端专用初始化，在客户端物理端启动时触发。

### AttachCapabilitiesEvent
: 在实体 / 方块实体上附加 Capability Provider 的事件。

### RegisterEvent
: 每个注册表触发一次的通知事件。`DeferredRegister` 内部封装了对 `RegisterEvent` 的订阅。

---

## 数据包

### ResourceLocation
: Minecraft 的资源标识符，格式为 `namespace:path`，如 `minecraft:stone`。

### pack.mcmeta
: 数据包 / 资源包的元数据文件，包含 `pack_format` 和 `description` 字段。

### loot_table
: 战利品表 JSON，定义方块实体、实体、容器的掉落物。

### advancements
: 进度 JSON，定义玩家达成的条件和奖励。

---

## 映射

| 映射层 | 说明 |
|--------|------|
| **mojang** | Mojang 官方可读映射名（**不是** SRG/混淆名） |
| **mcp** | Forge/NeoForge 维护的中间映射（已废弃，由 official 取代） |
| **official** | Mojang 官方发布的可读映射（即 mojmap，**不是** SRG/混淆名） |
| **yarn** | Fabric 社区的映射，与 MCP 类似 |
| **parchment** | 基于 mojang 的社区映射，补充了参数名和 javadoc |

> 注：NeoForge 1.20.4 主要使用 **official**（即 mojmap/官方可读名）和 **parchment** 两种映射通道。
