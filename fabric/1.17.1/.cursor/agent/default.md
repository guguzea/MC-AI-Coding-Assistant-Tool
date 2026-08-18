# Fabric 1.17.1 — Agent 总纲

> 本规则集适用于 **Fabric 1.17.1**，推荐使用 `Registry.register()` 注册模式。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 `AGENTS.md` 重新判断。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Fabric |
| Minecraft 版本 | 1.17.1 |
| 注册方式 | `Registry.register()` 在 `onInitialize()` 中执行 |
| Java 版本 | **Java 17**（Fabric 1.17.1 最低要求） |
| Gradle | Gradle 7.x + Loom |
| Mappings | **Yarn**（`net.fabricmc:yarn:1.17.1+build.65:v2`）|
| Build 工具 | Loom（`fabric-loom` 插件） |
| Mod 元数据 | `fabric.mod.json` |
| Mixin 支持 | **Loom 一流支持**（无需额外插件）|

---

## ⚠️ 1.17.x 特殊注意事项

1. **没有 `Registries` 类！** 使用 `Registry.BLOCK`、`Registry.ITEM` 等静态字段
2. **没有 `RegistrySupplier`！** 直接用静态字段持有注册后的对象
3. **没有 `ModInitializer` 接口！** 使用 `ModInitializer` 接口
4. **Loom 版本必须是 `0.11-SNAPSHOT`**（不是 `1.4-SNAPSHOT`）
5. **Fabric API maven 是 `net.fabricmc.fabric-api`**（不是 `net.fabric.sdk`）
6. **Fabric API 版本是 `0.31.x`**（如 `0.46.1+1.17`）

---

## Decision Flow：确认规则集适用性

```
Decision: 本规则集是否适用？
→ IF 项目中存在 src/main/resources/fabric.mod.json
    → IF fabric.mod.json 中 id 字段存在
        → 检查 build.gradle 中 Loom 配置
        → 继续加载本规则集（Fabric 1.17.1）
    → ELSE → fabric.mod.json schema 版本不匹配，跳转根目录 AGENTS.md
→ ELSE IF 项目中存在 src/main/resources/META-INF/mods.toml
    → 这是 Forge 项目，跳转到 ../forge/1.17.1/AGENTS.md
→ ELSE → 无法判断，询问用户确认平台和版本
```

---

## 与 Forge 的核心差异

| 维度 | Forge | Fabric |
|------|-------|--------|
| 注册时机 | modEventBus + `RegisterEvent` | `onInitialize()` 中直接调用 |
| 注册 API | `DeferredRegister.create(...)` | `Registry.register(Registry.ITEM, id, item)` |
| Mod 入口 | `@Mod` 注解 + `FMLJavaModLoadingContext` | `ModInitializer` 接口 + `fabric.mod.json` entrypoints |
| Mixin | 需配置 `org.spongepowered.mixin` 插件 | **Loom 原生支持** |
| Mappings | MCP（方法名如 `func_12345_a`） | **Yarn**（方法名如 `getHealth`）|
| API 生态 | Forge 内置 | **Fabric API 模块化**（按需引入）|
| 事件系统 | Forge 事件总线（`@SubscribeEvent`） | **Fabric 事件回调** |

---

## 注册系统速查（1.17.x）

```java
// ✅ 正确：使用 Registry.ITEM 静态字段
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"), new Item(...));

// ❌ 错误：1.17.x 没有 Registries 类！
Registry.register(Registry.ITEM, ...);

// ❌ 错误：1.17.x 没有 RegistrySupplier！
Item MY_ITEM = Registry.register(...);
```

---

## 约束

### 禁止混用

- ❌ 不要在 Fabric 项目中使用 Forge 的 `DeferredRegister`
- ❌ 不要在 Fabric 项目中使用 `@Mod` 或 `mods.toml`
- ❌ 不要混用 Yarn 和 MCP 映射
- ❌ 不要在 `onInitialize()` 之外注册内容（Mixin 初始化除外）
- ❌ 不要使用 `Registry.ITEM` — 应使用 `Registry.ITEM`

### 命名规范

- `id`：全小写；允许下划线与连字符（须与 fabric.mod.json 一致）
- 注册名称：`Identifier(MOD_ID, "registry_name")`
- 资源路径：`assets/{modid}/...` 全小写

### Minecraft 版本兼容性

- Fabric 1.17.1 支持 Minecraft 1.17.1
- Fabric Loader 0.11.x（推荐 0.11.7）
- Fabric API 0.46.x for 1.17.1
- Java 17+

---

## 规则文件索引

按编号顺序加载（建议）：

```
00-project-setup.mdc    → 项目结构与构建（Loom 0.11-SNAPSHOT）
01-registry.mdc         → 注册系统（Registry.XXX 静态字段）
02-block.mdc            → 方块开发
03-item.mdc             → 物品开发
04-entity.mdc           → 实体开发
05-events.mdc           → 事件系统
06-networking.mdc       → 网络通信
07-datagen.mdc          → 数据生成（推荐手写 JSON）
08-client-server.mdc    → 客户端/服务端分离
09-anti-patterns.mdc   → 反模式库
10-gui.mdc              → GUI / Screen 开发
```

---

## MCP Server 工具

当 `mcp-server/` 存在时，可使用以下工具：

| 工具 | 功能 |
|------|------|
| `search_fabric_docs` | 搜索 Fabric Docs + Wiki |
| `get_fabric_doc_summary` | 获取文档摘要 |
| `get_fabric_doc_full` | 获取文档全文 |
| `query_api` | 按类名查询 Yarn API 签名 |
| `get_method_params` | 查询方法参数名 |
| `convert_mapping` | Yarn ↔ Parchment ↔ Mojang 映射互转 |
| `diagnose_gradle` | 诊断 Gradle/Loom 构建问题 |

---

## 参考资料

- [Fabric Wiki](https://fabricmc.net/wiki/) — 官方教程
- [Fabric API](https://fabricmc.net/wiki/documentation:fabric_api) — 模块化 API 文档
- [Mixin](https://github.com/SpongePowered/Mixin) — 字节码注入框架
- [Yarn](https://github.com/FabricMC/yarn) — 社区维护映射
