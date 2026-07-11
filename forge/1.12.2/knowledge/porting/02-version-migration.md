# 版本迁移笔记摘要

## 1.12.x → 1.18.x（重大断裂）

### 关键变化：

1. **Registry API**：RegistryEvent → DeferredRegister
2. **Java**：Java 8 → Java 17
3. **Gradle**：4.9 + FG 2.3 → 8.x + FG 6.x
4. **pack_format**：4 → 9
5. **NBT**：NBTTagCompound → CompoundTag
6. **方块实体**：TileEntity → BlockEntity

### 需要修改的文件类型：

- 所有 Java 文件中的 import 语句
- 所有注册代码（从 RegistryEvent 改为 DeferredRegister）
- build.gradle（插件方式、Java 版本）
- gradle.properties（版本号、Java 版本）
- 资源文件路径（blockstates、models 格式变化）

---

## 版本对照表

| MC 版本 | Forge | Fabric Loader | Java |
|--------|-------|---------------|------|
| 1.12.2 | 14.23.5.x | — | **Java 8** |
| 1.18.2 | 40.x | 0.14.x | Java 17 |
| 1.19.4 | 45.x | 0.15.x | Java 17/18 |
| 1.20.1 | 47.x | 0.15.x | Java 17/20 |
| 1.20.4 | NeoForge 20.4.x | 0.15.x | Java 17/20 |

---

## 迁移优先级建议

当目标版本不在知识库中时，建议按以下顺序查阅：

1. 目标 Loader 的官方 changelog
2. Forge 官方 Wiki 迁移指南
3. 社区 Discord / Reddit 的迁移经验贴
