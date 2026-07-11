# Forge 1.18.2 — Agent 总纲

> 本规则集适用于 **Forge 1.18.2**，推荐使用 `DeferredRegister` 注册模式。

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Forge |
| Minecraft 版本 | 1.18.2 |
| 注册模式 | `DeferredRegister`（推荐） |
| Java 版本 | Java 17 |
| Gradle | Gradle 7.x + ForgeGradle 5.x |
| Mappings | **Parchment**（`1.18.2-2022.07.31`） |
| pack_format | **8** |
| 世界高度 | **-64 到 320**（Caves & Cliffs） |

## Decision Flow：确认规则集适用性

```
IF 项目中存在 src/main/resources/META-INF/mods.toml AND build.gradle 包含 "forge"
  → IF build.gradle 包含 "1.18.2"
    → 继续加载本规则集（Forge 1.18.2）
  → ELSE → 跳转到对应版本的 forge/版本号/AGENTS.md
```

## 规则文件索引

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
| 10 | `10-gui.mdc` | GUI、Menu、Screen 开发时 |

## Mod ID 规范

- **必须**与 `mods.toml` 中的 `modId` 完全一致
- 全部**小写**
- 仅使用字母和下划线（`[a-z0-9_]`）
- 禁止使用 `-`

## 常见陷阱（必读）

1. **推荐使用 DeferredRegister**：自 Forge 1.18 起可用
2. **不要用 Mixin 的 `@Inject` 在构造函数里修改 final 字段**
3. **不要在 `server` 包里放 `@OnlyIn(Dist.CLIENT)` 的代码**
4. **世界高度变化**：1.18.2 世界高度为 -64 到 320

## 关于 1.18.2 与其他版本的差异

| 功能 | 1.18.2 Forge | 1.20.1 Forge | 备注 |
|------|---------------|---------------|------|
| pack_format | **8** | 15 | 差异较大 |
| 世界高度 | **-64~320** | 0~320 | 1.18.2 有深层 |
| Gradle | Gradle 7.x | Gradle 8.x | 1.18.2 用 FG5 |
