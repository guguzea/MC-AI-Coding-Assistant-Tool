# Forge 1.18.2 — Agent 总纲

> 本规则集适用于 **Forge 1.18.2**，推荐使用 `DeferredRegister` 注册模式。

## 基本信息

| 项目 | 值 |
|------|-----|
| Minecraft | 1.18.2 |
| 注册模式 | `DeferredRegister` |
| Java | Java 17 |
| Gradle | Gradle 7.x + ForgeGradle 5.x |
| Mappings | **Parchment**（`1.18.2-2022.07.31`） |
| pack_format | **8** |
| 世界高度 | **-64 到 320** |

## Decision Flow

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
| 01 | `01-registry.mdc` | 任何涉及注册的操作必读 |
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
