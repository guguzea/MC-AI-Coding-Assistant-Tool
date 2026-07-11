# Forge 1.12.2 — Agent 总纲

> 本规则集适用于 **Forge 1.12.2**，使用 `RegistryEvent.Register<T>` 注册模式（`DeferredRegister` 不存在）。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 `AGENTS.md` 重新判断。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Forge |
| Minecraft 版本 | 1.12.2 |
| 注册模式 | `RegistryEvent.Register<T>`（`@EventBusSubscriber` + `RegistryEvent`） |
| Java 版本 | **Java 8**（Forge 1.12.2 要求） |
| Gradle | Gradle 4.9 + ForgeGradle 2.3 |
| Mappings | **MCP SRG**（`minecraft "1.12.2"` 下默认） |
| 构建工具 | ForgeGradle（`build.gradle`，`apply plugin: 'forge'`） |

---

## Decision Flow：确认规则集适用性

```
Decision: 本规则集是否适用？
→ IF 项目中存在 src/main/resources/mcmod.info
    → IF build.gradle 中包含 "forge"
        → IF mc_version = "1.12.2"
            → 继续加载本规则集（Forge 1.12.2）
        → ELSE → 跳转到对应版本的 forge/版本号/AGENTS.md
→ ELSE IF 项目中存在 src/main/resources/mods.toml
    → 这是新版 Forge → 跳转到 forge/1.20.x/AGENTS.md
→ ELSE IF 项目中存在 src/main/resources/fabric.mod.json
    → 跳转到 fabric/ 对应版本
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
| 07 | `07-datagen.mdc` | 手动编写数据包时 |
| 08 | `08-client-server.mdc` | 涉及客户端渲染或服务端逻辑分离时 |
| 09 | `09-anti-patterns.mdc` | 遇到错误或不确定最佳实践时 |
| 10 | `10-gui.mdc` | GUI、Container、Slot 开发时 |

---

## 常见陷阱（必读）

1. **必须使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>`**：DeferredRegister 在 Forge 1.12.2 中不存在
2. **必须使用 `@Init` 方法注册到 FMLInitializationEvent**
3. **不要在 `client` 包里放 `@SideOnly(Side.CLIENT)` 以外的代码**
4. **资源包格式**：1.12.2 的 `pack_format` = **4**
5. **不要在 `FMLInitializationEvent` 里直接执行游戏逻辑**
