# 术语表

## 核心概念

### DeferredRegister
: Forge 1.18+ 推荐的注册方式。延迟注册到 `RegistryEvent`，避免在 mod 构造函数执行前引用未注册的 content。

### RegistryObject
: 持有注册表条目的懒引用。`.get()` 在注册完成后才返回实际对象，可在 lambda 内部安全使用。

### Mixin
: SpongePowered Mixin 框架，通过字节码注入修改 Minecraft / Forge 类的行为。需在 `mixins.json` 中声明。

### Capability
: Forge 的跨对象数据共享机制。通过 `IItemHandler`、`IFluidHandler`、`IEnergyStorage` 等接口附加到 Entity / BlockEntity / ItemStack。

### DataGen（数据生成器）
: Gradle 任务，自动化生成 `src/generated/resources/` 中的 JSON 数据文件（配方、战利品表、模型等）。

### pack_format
: 数据包 / 资源包的版本标识。不同 Minecraft 版本有不同的 pack_format 值，错误会导致加载失败。

### ParchmentMC
: 社区维护的 Minecraft 映射项目，提供带参数名和 javadoc 的非官方映射层。

---

## 注册表

### ForgeRegistries
: Forge 所有内置注册表的静态持有类。通过 `ForgeRegistries.BLOCKS`、`ForgeRegistries.ITEMS` 等字段访问。

### ResourceKey
: Vanilla 注册表的键（如 `Registries.BIOME`），用于 `DeferredRegister.create(ResourceKey, modId)`。

### IForgeRegistry
: Forge 注册表的接口，可通过 `ForgeRegistries.Keys.XXX` 访问 `ResourceKey`。

---

## 构建系统

### ForgeGradle
: Forge 官方的 Gradle 插件，处理 Minecraft 反编译、映射、应用补丁等。

### Foojay Toolchains
: Gradle 插件，通过 `org.gradle.toolchains.foojay-resolver-convention` 自动下载正确的 Java JDK。

### userdev
: ForgeGradle 的特殊分类器artifact，包含开发环境所需的 MCP 配置和反编译工具。

### reobfJar
: ForgeGradle 任务，在打包前将混淆的类名重新映射为原始映射名。

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
| **mojang** | Minecraft 的原始混淆名（srg），如 `aqm`、`b_` |
| **mcp** | Forge 维护的中间映射（已废弃） |
| **yarn** | Fabric 社区的映射，与 MCP 类似 |
| **parchment** | 基于 mojang 的社区映射，补充了参数名和 javadoc |

> 注：Forge 1.20.1 主要使用 **official**（即 mojang）和 **parchment** 两种映射通道。
