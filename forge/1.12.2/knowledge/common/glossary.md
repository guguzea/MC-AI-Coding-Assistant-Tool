# 术语表

## 核心概念

### RegistryEvent
: Forge 1.12.2 及以前的注册事件。通过 `@EventBusSubscriber` + `@SubscribeEvent` 监听。

### @EventBusSubscriber
: 注解在类上，声明该类监听 Forge 事件总线。所有 `@SubscribeEvent` 方法都会被自动注册。

### TileEntity
: Forge 1.12.2 的方块实体。用于存储方块的持久数据。

### SimpleNetworkWrapper
: Forge 1.12.2 的网络通信类。用于发送/接收网络数据包。

### @SideOnly
: 注解类或方法，使其只在特定物理端（CLIENT 或 SERVER）运行。

---

## 注册表

### IForgeRegistry
: Forge 注册表的接口。通过 `event.getRegistry()` 获取。

### GameRegistry.registerTileEntity
: 注册 TileEntity。必须在初始化阶段调用；没有 `TileEntity.register` 静态方法。

---

## 构建系统

### ForgeGradle
: Forge 官方的 Gradle 插件（1.12.x 使用 FG 2.3）。

### reobfJar
: ForgeGradle 任务，在打包前将混淆的类名重新映射为原始映射名。

---

## 事件系统

### FMLInitializationEvent
: 所有 mod constructor 执行完毕后的初始化事件。

### FMLPreInitializationEvent
: 早期初始化事件，用于配置文件。

### FMLPostInitializationEvent
: 后期初始化事件，用于模组交互。

### RegistryEvent.Register<T>
: 每个注册表触发一次的通知事件。

---

## 映射

| 映射层 | 说明 |
|--------|------|
| **SRG** | Minecraft 的混淆名，如 `b_`, `aqm` |
| **MCP** | Forge 维护的中间映射，带参数名 |
| **Yarn** | Fabric 社区的映射 |
| **Parchment** | 基于 MCP 的社区映射 |

> 注：Forge 1.12.2 主要使用 **MCP SRG** 格式。
