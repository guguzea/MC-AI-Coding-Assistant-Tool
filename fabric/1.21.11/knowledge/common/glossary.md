# 术语表（Fabric 1.21.11）

> 本文件定义 Fabric 开发中常用的术语和 Yarn 命名约定。

## 核心概念

| 术语 | 含义 |
|------|------|
| Loom | Fabric 的 Gradle 插件，处理映射和 mixin 编译 |
| Yarn | Fabric 社区维护的 Minecraft 映射，提供可读的类/方法/字段名 |
| Parchment | 叠加在 **Mojang 官方映射（mojmap）** 之上的参数名 + Javadoc 数据；**不是 Yarn 的扩展**，不能单独当 `mappings`。用法：手动加 `https://maven.parchmentmc.org` 仓库后走 `loom.layered { officialMojangMappings(); parchment("org.parchmentmc.data:parchment-<MC 版本>:<发布日期>@zip") }`（详见 `knowledge/antipatterns/yarn-mappings.md` §可选） |
| Mixin | 字节码注入框架，用于修改 Minecraft 行为 |
| Fabric API | Fabric 官方模块化 API 库，提供各种扩展功能 |
| Registry | Minecraft 的注册表系统，管理所有游戏内对象 |
| Identifier | `namespace:id` 格式的资源标识符 |
| Registry.register 返回值 | 已注册对象；不要用 Architectury 的 RegistrySupplier |

## Identifier 格式

```
namespace:id

例：
- fabric:diamond          → namespace=fabric, id=diamond
- minecraft:stone         → namespace=minecraft, id=stone
- examplemod:my_item      → namespace=examplemod, id=my_item
```

**规则：**
- `namespace` 必须是 mod ID（Fabric / Quilt 允许小写字母、数字、下划线与连字符，官方示例 `example-mod`）
- `id` 必须是全小写（下划线分隔）
- 连字符 `-`：**Fabric / Quilt 允许**（官方 `fabric-docs` 正文即用 `example-mod`）；Forge / NeoForge / LiteLoader / Rift / ModLoader **禁止**，须改用 `_`（本仓 scaffold 示例统一写无连字符的 `examplemod`）

## Yarn 命名约定

### 已解析的成员（正常可读）

| 类型 | 格式 | 示例 |
|------|------|------|
| 类名 | PascalCase | `MinecraftClient`、`ItemStack` |
| 方法名 | camelCase | `getHealth()`、`sendMessage()` |
| 字段名 | camelCase | `inventory`、`health` |
| 参数名 | camelCase | `player`、`world` |

### 未解析的成员（混淆残留）

| 类型 | 格式 | 示例 |
|------|------|------|
| 未解析类 | `class_NNNNN` | `class_12345` |
| 未解析方法 | `method_NNNNN[_suffix]` | `method_12345_a` |
| 未解析字段 | `field_NNNNN` | `field_12345` |

> 只有升级 **Yarn** 版本才可能减少未解析成员；Parchment 叠在 mojmap 上，**补不了 Yarn 未解析的名字**（同档 `antipatterns/yarn-mappings.md:53` 已定案）。

## Registry 类型参考

| Registries 枚举 | 注册内容 | 示例 |
|----------------|---------|------|
| `Registries.BLOCK` | 方块 | `Blocks.STONE` |
| `Registries.ITEM` | 物品 | `Items.DIAMOND` |
| `Registries.ENTITY_TYPE` | 实体类型 | `EntityType.PIG` |
| `Registries.PARTICLE_TYPE` | 粒子类型 | `ParticleTypes.AMBIENT_ENTITY_EFFECT` |
| `Registries.SCREEN_HANDLER` | 菜单类型 | `GenericContainerScreenHandler` |
| `Registries.SOUND_EVENT` | 声音事件 | `SoundEvents.ITEM_PICKUP` |

## Mod Entrypoints

| entrypoint | 用途 |
|-----------|------|
| `main` | 主入口，服务端和共享逻辑 |
| `client` | 客户端专用（渲染器、快捷键） |
| `fabric-datagen` | DataGen 入口（`DataGeneratorEntrypoint`） |

## 文件约定

| 文件 | 用途 |
|------|------|
| `fabric.mod.json` | Mod 元数据配置 |
| `fabric.mixins.json` | Mixin 配置 |
| `*.accesswidener` | Access Widener 规则 |
| `pack.mcmeta` | 资源包标识 |
