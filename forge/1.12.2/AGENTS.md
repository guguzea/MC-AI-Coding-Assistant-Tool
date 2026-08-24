# Forge 1.12.2 — Agent 总纲

> 本规则集适用于 **Forge 1.12.2**，使用传统 `@Init` + `RegistryEvent` 注册模式。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 `AGENTS.md` 重新判断。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Forge |
| Minecraft 版本 | 1.12.2 |
| 注册模式 | `@EventBusSubscriber` + `RegistryEvent.Register<T>` |
| Java 版本 | **Java 8**（Forge 1.12.2 要求） |
| Gradle | Gradle 4.9 + ForgeGradle 2.3 |
| Mappings | **MCP SRG**（1.12.2 SRG 格式） |
| 构建工具 | ForgeGradle（`build.gradle`，使用 `forge` 插件） |

---

## Decision Flow：确认规则集适用性

在加载本规则集之前，先确认以下条件：

```
Decision: 本规则集是否适用？
→ IF 项目中存在 src/main/resources/mcmod.info 或 build.gradle
    → IF build.gradle 中包含 'net.minecraftforge.gradle'
        → IF build.gradle 中 minecraft_version = "1.12.2"
            → 继续加载本规则集（Forge 1.12.2）
        → ELSE → 跳转到对应版本的 forge/版本号/AGENTS.md
    → ELSE → 不是 Forge，跳转到 fabric/ 或 neoforge/ 对应版本
→ ELSE → 询问用户确认平台和版本
```

### 本规则集的 IDE 加载优先级

各 AI 助手会优先读取自己对应的配置目录（零修改复刻自 Cursor）：

| AI 助手 | 读取路径 |
|---------|---------|
| Cursor | `.cursor/rules/*.mdc` + `.cursor/skills/` |
| Claude Desktop | `.claude/rules/*.mdc` + `.claude/commands/` |
| Continue.dev | `.continue/rules/*.mdc` + `.continue/skills/` |
| Trae AI | `.trae/rules/*.mdc` + `.trae/skills/` |
| OpenCode | `AGENTS.md` + `.opencode/skills/` |
| Codex | `AGENTS.md` + `.agents/skills/` |
| ZCode | `AGENTS.md` + `.zcode/skills/` |
| Pi | `.pi/rules/*.md`（+ `AGENTS.md`） |

当上述路径不存在时，会降级读取本文件（`AGENTS.md`）和 `.cursor/` 目录。


---

## 规则文件索引

按以下顺序加载：

| 编号 | 文件 | 何时阅读 |
|------|------|----------|
| 00 | `00-project-setup.mdc` | 首次接触项目时必读 |
| 01 | `01-registry.mdc` | 任何涉及注册的操作必读（**最重要**） |
| 02 | `02-block.mdc` | 创建或修改方块时 |
| 03 | `03-item.mdc` | 创建或修改物品时 |
| 04 | `04-entity.mdc` | 创建或修改实体时 |
| 05 | `05-events.mdc` | 监听游戏事件时 |
| 06 | `06-networking.mdc` | 实现客户端/服务端通信时 |
| 07 | `07-datagen.mdc` | 生成数据包时（1.12.2 使用 JSON 手动编写） |
| 08 | `08-client-server.mdc` | 涉及客户端渲染或服务端逻辑分离时 |
| 09 | `09-anti-patterns.mdc` | 遇到错误或不确定最佳实践时 |
| 10 | `10-gui.mdc` | GUI、Container、GuiScreen 开发时 |

---

## Mod ID 规范

本规则集强制约束：

- **必须**与 `mcmod.info` 中的 `modid` 完全一致
- 全部**小写**
- 仅使用字母和下划线（`[a-z0-9_]`）
- 禁止使用 `-`，否则 Forge 会拒绝加载
- 推荐格式：`yourmodid` 或 `your_mod_id`

---

## 目录结构约定

Forge 1.12.2 标准项目的包结构：

```
src/main/java/
└── com/example/mod/
    ├── ExampleMod.java        # @Mod 入口类
    ├── registry/              # 注册相关
    │   ├── ModBlocks.java
    │   ├── ModItems.java
    │   └── ModRecipes.java
    ├── blocks/               # 方块
    │   └── MyBlock.java
    ├── items/                # 物品
    │   └── MyItem.java
    ├── entities/             # 实体
    │   └── MyEntity.java
    ├── init/                 # 事件订阅（使用 @EventBusSubscriber）
    │   └── ModEventSubscriber.java
    └── client/               # 客户端专用
        └── ClientProxy.java
```

---

## 常见陷阱（必读）

1. **使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>`**：Forge 1.12.2 没有 `DeferredRegister`，必须使用事件订阅方式
2. **使用 `@Init` 方法**：在 `@Mod` 类中定义 `@Init` 方法处理初始化
> 兼容说明：`@Init` 与 `@EventHandler(FMLPreInitializationEvent)` 均为合法初始化入口；事件订阅仍用 `@SubscribeEvent`（见 05-events），两者混用时勿重复执行一次性注册。
3. **不要用 Mixin 的 `@Inject` 在构造函数里修改 final 字段**：会导致游戏崩溃
4. **不要在 `proxy` 包里放客户端代码**：代理类设计是 1.12.2 的标准模式
5. **资源文件路径**：`assets/{modid}/textures/` 等路径必须全小写

---

## 扩展新内容时的流程

1. 先读 `01-registry.mdc` 确认注册方式
2. 再读对应主题的规则文件（如 `02-block.mdc`）
3. 检查 `09-anti-patterns.mdc` 确认没有踩坑

---

## 关于 1.12.2 与其他版本的差异

| 功能 | 1.12.2 Forge | 1.20.1 Forge | 备注 |
|------|---------------|---------------|------|
| 注册方式 | `RegistryEvent` | `DeferredRegister` | 1.12.2 更繁琐 |
| 初始化 | `@Init` | 构造函数 | 1.12.2 使用 @Init |
| 事件总线 | `@EventBusSubscriber` | `@SubscribeEvent` | 基本相同 |
| 网络 | `SimpleNetworkWrapper` | `SimpleChannel` | API 略有不同 |
| 数据生成 | JSON 手动编写 | DataGenerator | 1.12.2 无 DataGen |
| 物理端分离 | Proxy 模式 | DistExecutor | 1.12.2 用 Proxy |

---

## MCP 文档与 API 工具（本档）

打开 Forge 1.12.2 工程后：`activate_platform_pack action=session --platform=forge --minecraftVersion=1.12.2`。

| 需求 | 用 | 不要用 |
|------|-----|--------|
| 官方教程（方块/注册/网络…） | 先 `list_forge_versions`，再 `search_forge_docs` 或 `search_docs({platform:"forge", version:"1.12.2"})`，`id` 取自结果后 `get_forge_doc_full` | `query_api`（类名空壳：`found:true` + `methods:[]`，不是 javadoc）；不要搜邻版 1.20.1 文档 |
| Forge 类（`IForgeRegistry`、Capability…） | `query_loader_api` / `search_loader_api`（`platform=forge`，`minecraftVersion=1.12.2`） | `query_api` |
| Vanilla / MCP 方法名 | `convert_mapping`（MCP SRG）或反编译 | Yarn / 把 `query_api` 空 methods 当签名 |
| 版本建议 | `get_version_info version=1.12.2`（注册是 RegistryEvent，无 DeferredRegister） | 不要套 1.20 注册流程 |
| DataGen | 手写 JSON | `generate_datagen`（仅覆盖 Forge 1.20.1） |

查询用类名或短词（如 `Block`、`RegistryEvent`）。数据在 `data/forge_1.12.2/forge-docs/`。
