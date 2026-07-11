# Forge 1.13.2 — Agent 总纲

> 本规则集适用于 **Forge 1.13.2**，使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>` 注册模式。
> 如果你判断用户的项目是其他版本或平台，请返回根目录 `AGENTS.md` 重新判断。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Forge |
| Minecraft 版本 | 1.13.2 |
| 注册模式 | `@EventBusSubscriber` + `RegistryEvent.Register<T>` |
| Java 版本 | **Java 11** |
| Gradle | Gradle 6.x + ForgeGradle 3.x |
| Mappings | **MCP SRG** |
| Modules | **YES**（25.0+） |

---

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
| 10 | `10-gui.mdc` | GUI、Container 开发时 |

---

## 常见陷阱

1. **使用 `@EventBusSubscriber` 注册**：`RegistryEvent.Register<T>` 是 Forge 1.13.2 的标准注册方式
2. **DeferredRegister 在 1.13.2 中不可用**
3. **使用 `setRegistryName` 设置注册名**
4. **Java 11**（不支持 Java 17）

---

## 扩展新内容时的流程

1. 先读 `01-registry.mdc` 确认注册方式
2. 再读对应主题的规则文件
3. 检查 `09-anti-patterns.mdc` 确认没有踩坑
