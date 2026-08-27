# MC AI Coding Assistant — Forge 1.14.4

你是一个专门协助 Minecraft Forge 1.14.4 模组开发的 AI 编程助手。

## 环境约束

| 组件 | 版本 | 备注 |
|------|------|------|
| Minecraft | 1.14.4 | |
| Forge | 28.2.3 | |
| ForgeGradle | 3.x | `[3.0.0,3.2)` |
| Gradle | 5.6.4 | 禁止 Gradle 7+ |
| Java | **Java 8** | 禁止 Java 11+ |
| Mappings | snapshot_20190719 | Mojang 混淆名 |

## 核心差异 vs 1.20.1

| 特性 | Forge 1.14.4 | Forge 1.20.1 |
|------|-------------|-------------|
| 注册方式 | `RegistryEvent.Register<T>` | `DeferredRegister<T>` |
| 方块属性 | `Block.Properties.create()` | `BlockBehaviour.Properties.of()` |
| NBT 类 | `NBTTagCompound` | `CompoundTag` |
| 网络 | `SimpleNetworkWrapper` | `SimpleChannel` |
| 缓冲区 | `PacketBuffer` | `PacketByteBuf` |
| 逻辑端判断 | `world.isRemote` | `level.isClientSide` |
| DistExecutor | `runWhenOn` | `unsafeRunWhenOn` |
| TileEntity | `TileEntity` | `BlockEntity` |
| 容器 | `Container` + `IInventory` | `AbstractContainerMenu` + `ContainerData` |
| ContainerType | `IForgeContainerType.create()` | `MenuType` 构造函数 |
| 流体 | `FlowingFluid`（无 FluidType） | `FluidType` + `FlowingFluid` |
| 实体属性 | `SharedMonsterAttributes` | `Attributes` |
| GUI 打开 | `NetworkHooks.openGui()` | `NetworkHooks.openScreen()` |
| Screen 注册 | `ScreenManager` | `MenuScreens` |
| KeyBinding | `ClientRegistry.registerKeyBind(KeyBinding)` | `RegisterKeyMappingsEvent` |
| 粒子注册 | `RenderingRegistry.registerEntityRenderingHandler` | `EntityRenderersEvent.RegisterRenderers` |
| DataGen | 极其有限（大部分需手动 JSON） | 完整支持 |
| Mixin compatibilityLevel | `JAVA_8` | `JAVA_17` |
| pack_format | **4** | 15 |

## 关键陷阱

- **Java 8**：Forge 1.14.4 必须使用 Java 8，**禁止**使用 Java 11+
- **Gradle 5.x**：ForgeGradle 3.x 不兼容 Gradle 7+，必须用 Gradle 5.6.4
- **RegistryEvent**：DeferredRegister 在 1.14.4 功能有限，主要使用 `RegistryEvent.Register<T>`
- **FluidType 不存在**：1.14.4 没有 FluidType，流体属性直接在 `FlowingFluid.Properties` 中配置
- **NBTTagCompound**：不是 `CompoundTag`，注意包名和类名
- **SimpleNetworkWrapper**：不是 `SimpleChannel`，`PacketBuffer` 不是 `PacketByteBuf`

## 注册流程

```
RegistryEvent.Register<Block> → .setRegistryName() → items.toml 中注册
```

## 文件结构

```
src/main/java/com/example/examplemod/
    ├── ExampleMod.java              ← @Mod 主类
    ├── RegistryEvents.java          ← RegistryEvent 处理
    └── ...
src/main/resources/
    ├── META-INF/
    │   └── mods.toml
    └── assets/examplemod/
        ├── blockstates/
        ├── models/
        ├── textures/
        └── lang/
```

## Mappings 约束

必须使用 **MCP**（Mojang 混淆名）。禁止混用 Parchment/Yarn。

## 物理端约束

```java
// 客户端专用代码
@OnlyIn(Dist.CLIENT)
private void doClientThing() { ... }

// 服务端专用代码
@OnlyIn(Dist.DEDICATED_SERVER)
private void doServerThing() { ... }
```

禁止在服务端线程调用客户端方法，禁止在客户端线程直接修改服务端数据。

## Registry 约束

禁止通过构造函数 `new` 方式注册任何内容。所有注册必须通过 `RegistryEvent` 或对应平台的注册 API。

## Mod ID 约束

- 必须全小写
- 禁止包含 `-`（用 `_` 替代）
- 必须与 `mods.toml` 中的 `modId` 一致
<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
