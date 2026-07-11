# Forge 1.16.5 — Agent 总纲

> 本规则集适用于 **Forge 1.16.5**，推荐使用 `DeferredRegister` 注册模式。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 `AGENTS.md` 重新判断。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Forge |
| Minecraft 版本 | 1.16.5 |
| 注册模式 | `DeferredRegister`（推荐）/ `RegisterEvent`（备选） |
| Java 版本 | **Java 11**（Forge 1.16.5 最低要求，推荐 Java 16） |
| Gradle | Gradle 7.x + ForgeGradle 4.x |
| Mappings | **Parchment**（`1.16.5-2021.06.09-18`） |
| 构建工具 | ForgeGradle（`build.gradle`） |

---

## Decision Flow：确认规则集适用性

在加载本规则集之前，先确认以下条件：

```
Decision: 本规则集是否适用？
→ IF 项目中存在 src/main/resources/META-INF/mods.toml
    → IF mods.toml 中 modLoader = "javafml"
        → IF build.gradle 中 minecraft = "1.16.5"
            → 继续加载本规则集（Forge 1.16.5）
        → ELSE → 跳转到对应版本的 forge/版本号/AGENTS.md
    → ELSE → 不是 Forge，跳转到 fabric/ 或 neoforge/ 对应版本
→ ELSE IF 项目中存在 src/main/resources/fabric.mod.json
    → 跳转到 fabric/对应版本/AGENTS.md
→ ELSE → 询问用户确认平台和版本
```

---

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

---

## Mod ID 规范

- **必须**与 `mods.toml` 中的 `modId` 完全一致
- 全部**小写**
- 仅使用字母和下划线（`[a-z0-9_]`）
- 禁止使用 `-`

---

## 常见陷阱（必读）

1. **推荐使用 DeferredRegister**
2. **不要在 TileEntity 构造函数中访问 world**
3. **CompoundNBT** 用于 NBT 数据（1.17+ 改名为 CompoundTag）
4. **不要在 `FMLClientSetupEvent` 里直接执行游戏逻辑**
5. **Item.Properties.tab(ItemGroup)** 方式（1.17+ 无 .tab() 方法）
