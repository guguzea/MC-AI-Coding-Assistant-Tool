# Minecraft Mod 跨平台/跨版本移植指南

> 本文档是 MC_skill AGENTS.md 的第四条平台路径，用于指导 Fabric ↔ NeoForge ↔ Forge 跨平台移植以及 Minecraft 1.14 → 1.20.x 跨版本迁移。

---

## 决策入口（Decision Flow）

```
用户要"跨平台"（Fabric ↔ NeoForge ↔ Forge）
  → 单 Loader → Architectury 多 Loader 重构
  → 已有 Architectury → 添加/移除 Loader

用户要"跨版本"（同 Loader 内升级/降级）
  → 1.x 版本内升级（patch/minor）— 增量修复
  → 跨 major 版本升级 — 三重处理（Java + Mappings + API）
  → 1.14.4 → 1.15 — 大版本迁移（API 变化较大）

用户要"同时跨平台+跨版本"
  → 推荐路线：先平台基座（Architectury），再版本跃迁
```

---

## 1.14.4 特殊注意事项

### 1.14.x 特点

- **Java 版本**：Java 11（1.14.x 是最后一个主要支持 Java 8 的版本）
- **ForgeGradle**：3.x（与 1.18+ 的 6.x 完全不同）
- **Mappings**：MCP snapshot
- **Registry**：DeferredRegister 已可用
- **pack_format**：5

### 1.14.x 与 1.15/1.16 主要差异

| 项目 | 1.14.x | 1.15+ |
|------|---------|--------|
| Java | 8/11 | 11/16 |
| ForgeGradle | 3.x | 4.x+ |
| DataGen | 基本可用 | 更完善 |
| EventBus | 早期版本 | 统一 |

---

## 移植风险分类

| 风险域 | 识别方式 | 影响说明 |
|--------|---------|---------|
| Registry | 搜索 `DeferredRegister`/`Registry.register` | 1.14.x 已支持 |
| 网络层 | 搜索 `SimpleNetworkWrapper`/`NetworkRegistry` | 基本兼容 |
| 事件系统 | 搜索 `@SubscribeEvent`/`EventBus` | 基本兼容 |
| 资源加载 | 搜索 `ResourceLocation`/`Assets` | 基本兼容 |

---

## 版本对照表

| MC 版本 | Forge | Java | Gradle | pack_format |
|---------|-------|------|--------|-------------|
| 1.14.4 | 28.2.x | 11 | 7.x | 5 |
| 1.15.2 | 31.2.x | 11 | 7.x | 6 |
| 1.16.5 | 36.2.x | 11/16 | 7.x | 7 |
| 1.17.1 | 37.1.x | 16 | 7.x | 8 |
| 1.18.2 | 40.2.x | 17 | 7.x | 9 |
| 1.19.4 | 45.x | 17 | 7.x | 12 |
| 1.20.1 | 47.x | 17 | 8.x | 15 |
