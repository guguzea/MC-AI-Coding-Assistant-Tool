# Forge 1.20.1 — Agent 总纲

> 本规则集适用于 **Forge 1.20.1**，推荐使用 `DeferredRegister` 注册模式。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 `AGENTS.md` 重新判断。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Forge |
| Minecraft 版本 | 1.20.1 |
| 注册模式 | `DeferredRegister`（推荐）/ `RegisterEvent`（备选） |
| Java 版本 | **Java 17**（Forge 1.20.1 最低要求） |
| Gradle | Gradle 8.x + ForgeGradle 14.x |
| Mappings | **MCP**（`minecraft "1.20.1"` 下默认） |
| 构建工具 | ForgeGradle（`build.gradle`） |

---

## Decision Flow：确认规则集适用性

在加载本规则集之前，先确认以下条件：

```
Decision: 本规则集是否适用？
→ IF 项目中存在 src/main/resources/META-INF/mods.toml
    → IF mods.toml 中 modLoader = "javafml"
        → IF build.gradle 中 minecraft = "1.20.1"
            → 继续加载本规则集
        → ELSE → 跳转到对应版本的 forge/版本号/AGENTS.md
    → ELSE → 不是 Forge，跳转到 fabric/ 或 neoforge/ 对应版本
→ ELSE IF 项目中存在 src/main/resources/fabric.mod.json
    → 跳转到 fabric/对应版本/AGENTS.md
→ ELSE → 询问用户确认平台和版本
```

---

## 规则文件索引

按以下顺序加载，编号越大越专精：

| 编号 | 文件 | 何时阅读 |
|------|------|----------|
| 00 | `00-project-setup.mdc` | 首次接触项目时必读 |
| 01 | `01-registry.mdc` | 任何涉及注册的操作必读（**最重要**） |
| 02 | `02-block.mdc` | 创建或修改方块时 |
| 03 | `03-item.mdc` | 创建或修改物品时 |
| 04 | `04-entity.mdc` | 创建或修改实体时 |
| 05 | `05-events.mdc` | 监听游戏事件时 |
| 06 | `06-networking.mdc` | 实现客户端/服务端通信时 |
| 07 | `07-datagen.mdc` | 生成数据包时 |
| 08 | `08-client-server.mdc` | 涉及客户端渲染或服务端逻辑分离时 |
| 09 | `09-anti-patterns.mdc` | 遇到错误或不确定最佳实践时 |

---

## Mod ID 规范

本规则集强制约束：

- **必须**与 `mods.toml` 中的 `modId` 完全一致
- 全部**小写**
- 仅使用字母和下划线（`[a-z0-9_]`）
- 禁止使用 `-`，否则 Forge 会拒绝加载
- 推荐格式：`yourmodid` 或 `your_mod_id`

---

## 目录结构约定

Forge 1.20.1 标准项目的包结构：

```
src/main/java/
└── com/example/mod/
    ├── ExampleMod.java        # @Mod 入口类
    ├── registry/              # 注册相关
    │   ├── ModBlocks.java
    │   ├── ModItems.java
    │   ├── ModEntities.java
    │   └── ModMessages.java   # 网络包
    ├── blocks/                 # 方块
    │   └── MyBlock.java
    ├── items/                  # 物品
    │   └── MyItem.java
    ├── entities/               # 实体
    │   └── MyEntity.java
    ├── init/                   # 事件订阅
    │   └── ModEvents.java
    └── client/                  # 客户端专用
        ├── ClientSetup.java
        └── rendering/
            └── MyBlockRenderer.java
```

---

## 常见陷阱（必读）

1. **推荐使用 DeferredRegister**：`DeferredRegister` 是 Forge 官方推荐的注册方式，自 Forge 1.18 起即可用于所有注册表，1.20.1 完全支持
2. **不要用 Mixin 的 `@Inject` 在构造函数里修改 final 字段**：会导致游戏崩溃
3. **不要在 `server` 包里放 `@OnlyIn(Dist.CLIENT)` 的代码**：客户端类会被服务端打包进 jar，导致混淆问题
4. **不要忘记 `mods.toml` 中的 `dependencies`**：任何对 Forge API 的依赖必须声明
5. **不要在 `FMLClientSetupEvent` 里直接执行游戏逻辑**：只用于注册 KeyBinding 和渲染器

---

## 扩展新内容时的流程

1. 先读 `01-registry.mdc` 确认注册方式
2. 再读对应主题的规则文件（如 `02-block.mdc`）
3. 检查 `09-anti-patterns.mdc` 确认没有踩坑
4. 最后运行 `validate_project` 自查（Phase 1.5 CLI 工具）

---

## 关于 1.20.1 与其他版本的差异

| 功能 | 1.20.1 Forge | 1.20.4+ NeoForge | 备注 |
|------|---------------|-------------------|------|
| 注册方式 | `DeferredRegister` | `DeferredRegister` | 一致（均推荐） |
| Fluid 注册 | `FluidType` | 有 Breaking Changes，参考 NeoForge 文档 | 1.20.1 有 FluidType |
| BlockEntity | 旧版签名 | 相同 | - |
| DataGen | `DataGenerators` | 相同 | - |

如果你发现用户的代码与本规则集描述不符，先询问 Minecraft 版本。
