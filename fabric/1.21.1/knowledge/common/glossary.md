# Fabric 术语表

## 核心概念

### Yarn

Minecraft 官方服务端使用 Mojang 名称（混淆名），但模组需要可读的命名。
Fabric 社区维护的 **Yarn** 项目提供官方名称到可读名称的映射。

**格式**：`class_XXXXX` / `method_XXXXX` / `field_XXXXX`
- `class_XXXXX` 表示未解析的类
- `method_XXXXX` 表示未解析的方法
- `field_XXXXX` 表示未解析的字段

### Loom

Fabric 的 Gradle 插件，负责：
- 下载 Minecraft 源码和 Yarn 映射
- 应用 mappings 并生成可读的 JAR
- 管理 Mixin 配置
- 生成 IDE 项目文件

### Registry

Minecraft 的注册表系统，所有游戏内容（方块、物品、实体等）都在这里注册。

**常用 Registry**：
- `Registries.BLOCK` — 方块
- `Registries.ITEM` — 物品
- `Registries.ENTITY_TYPE` — 实体类型
- `Registries.BLOCK_ENTITY_TYPE` — 方块实体类型
- `Registries.PARTICLE_TYPE` — 粒子类型
- `Registries.SOUND_EVENT` — 声音事件
- `Registries.ENCHANTMENT` — 附魔
- `Registries.MOB_EFFECT` — 状态效果

### Identifier

Fabric 的资源定位符，格式为 `mod_id:registry_name`。

**示例**：
- `minecraft:stone` — 原版石头
- `examplemod:my_item` — 模组的物品

### Mixin

字节码注入框架，允许在运行时修改 Minecraft 类。

**注意**：
- Mixin 不是 Java 代码，不能直接 `new` 实例
- Mixin 类需要在 `fabric.mixins.json` 中声明
- 包名必须与 `fabric.mixins.json` 中的 `package` 一致

## 常用类

### Item

物品基类。

```java
// 基本物品
new Item(new Item.Settings())

// 设置最大堆叠
new Item(new Item.Settings().maxCount(64))

// 设置耐久
new Item(new Item.Settings().maxDamage(100))
```

### Block

方块基类。

```java
// 基本方块
new Block(FabricBlockSettings.copyOf(Blocks.STONE))

// 自定义属性
new Block(FabricBlockSettings.create().strength(1.5f).requiresTool())
```

### FabricBlockSettings

方块属性构建器。

```java
FabricBlockSettings.create()
    .strength(1.5f)                    // 硬度和抗爆性
    .strength(1.5f, 6.0f)             // hardness, resistance
    .breakByTool(FabricToolTags.PICKAXES)
    .requiresTool()
    .dropsLike(Blocks.STONE)
    .mapColor(MapColor.STONE)
    .noCollision()
```

### EntityType

实体类型，注册实体时使用。

```java
EntityType.Builder.create(MyEntity::new, MobCategory.CREATURE)
    .dimensions(EntityDimensions.changing(0.9f, 1.4f))
    .maxTrackOffset(10)
    .trackRangeBlocks(10)
    .build()
```

## 版本术语

### MCP

Mod Coder Pack，Forge 使用的映射系统。与 Yarn 不兼容。

### Parchment

MCP 的带文档版本，为方法参数提供名称。

### Yarn vs MCP

| 特性 | Yarn | MCP |
|------|------|-----|
| 维护者 | Fabric 社区 | MCP 团队 |
| 命名风格 | `method_name` | `func_12345_methodName` |
| 兼容性 | 仅 Fabric | 仅 Forge |
| 文档 | 部分 | 无 |
