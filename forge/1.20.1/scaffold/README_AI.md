# Forge 1.20.1 模组项目骨架说明

> 本文件供 AI 编程助手阅读，描述每个文件的职责、修改注意事项和扩展位置。
> 当 AI 开始一个新的 Forge 1.20.1 项目时，先读本文件。

---

## 文件清单与职责

```
forge-1.20.1-mod/
├── build.gradle              # Gradle 构建配置，定义依赖和任务
├── settings.gradle           # 项目名称和插件管理（通常不改）
├── gradle.properties         # 版本号集中管理（优先修改这里）
├── .gitignore               # Git 忽略配置
│
└── src/main/
    ├── java/
    │   └── com/example/examplemod/
    │       └── ExampleMod.java   # @Mod 入口类，所有注册的起点
    │
    └── resources/
        ├── META-INF/
        │   └── mods.toml         # Forge 元数据（modId / 版本 / 依赖声明）
        └── pack.mcmeta          # 资源包标识（description 会替换为 mod_name）
```

---

## 优先修改：`gradle.properties`

所有版本号集中在此文件，**禁止在 `build.gradle` 中硬编码版本号**：

```properties
# ---- Minecraft / Forge 版本（必须与 Forge 版本匹配）----
minecraft_version=1.20.1
forge_version=47.2.0

# ---- Mappings ----
# official: MCP（默认，无参数名）
# parchment: 社区映射（有参数名和 javadoc，推荐用于开发）
mapping_channel=official
mapping_version=20231030.163645

# ---- Mod 元数据 ----
mod_id=examplemod          # 全部小写，禁止含 `-`
mod_name=Example Mod
mod_version=1.0.0
mod_group_id=com.example.examplemod   # Java 包名前缀
mod_authors=YourNameHere
mod_description=Example mod description.\nAdd lines as needed.
```

> **AI 注意**：修改 `mod_id` 后，必须同步修改 `mods.toml`、`ExampleMod.java` 中的 `MOD_ID` 常量和所有 `RegistryObject` 注册名。

---

## 扩展骨架：添加新内容

### 添加新方块

在 `ExampleMod.java` 中添加：

```java
// 在文件顶部 DeferredRegister 声明区域添加：
public static final DeferredRegister<Block> BLOCKS = ...;  // 已存在

// 在 RegistryObject 声明区域添加：
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(BlockBehaviour.Properties.of()
        .mapColor(MapColor.WOOD)
        .strength(2.0f)
    )
);
```

> **AI 注意**：
> - `"my_block"` 即 registry name，全小写下划线
> - `BLOCKS.register()` 在 modEventBus 注册后才执行，不要在 lambda 之外使用 `MY_BLOCK`
> - 如果方块需要有物品形态，在 `ITEMS.register()` 中添加同名 `BlockItem`

### 添加新物品

```java
// 在 DeferredRegister 声明区域添加：
public static final DeferredRegister<Item> ITEMS = ...;  // 已存在

// 在 RegistryObject 声明区域添加：
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties().tab(CreativeModeTab.TAB_MISC))
);
```

### 添加自定义实体

```java
// 在 DeferredRegister 声明区域添加：
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITY_TYPES, MOD_ID);

// 注册实体类型
public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
        .sized(0.6f, 1.8f)
        .clientTrackingRange(8)
        .build(...)
);

// 在构造函数中注册到 modEventBus：
ENTITY_TYPES.register(modEventBus);
```

### 添加方块实体（BlockEntity）

```java
// 方块实现 EntityBlock 接口：
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyBlockEntity(pos, state);
    }
}

// 注册方块实体类型
public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.BLOCK_ENTITY_TYPES, MOD_ID);
```

---

## 关键规则

### 禁止在 lambda 表达式之外引用 RegistryObject

```java
// ✅ 正确：lambda 内使用 .get() 获取实例
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new BlockItem(MY_BLOCK.get(), ...)  // 错误！MY_BLOCK 尚未初始化
);

// ✅ 正确：lambda 内创建关联的 ItemBlock
public static final RegistryObject<Item> MY_BLOCK_ITEM = ITEMS.register("my_block",
    () -> new BlockItem(EXAMPLE_BLOCK.get(), ...)  // EXAMPLE_BLOCK 在另一个 DeferredRegister 中，已完成注册
);
```

### 禁止硬编码版本号

```properties
# ❌ 错误：在 gradle.properties 中
forge_version=47.2.0

# build.gradle 中
minecraft "net.minecraftforge:forge:1.20.1-47.2.0"  # ❌ 硬编码

# ✅ 正确：引用 gradle.properties 属性
minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
```

### 禁止修改 settings.gradle

`spring.gradle` 中的插件仓库配置由 ForgeGradle 管理，修改会导致构建失败。

---

## 目录约定

| 目录 | 内容 |
|------|------|
| `src/main/java/` | 所有 Java 源码 |
| `src/main/resources/` | 所有资源文件 |
| `src/generated/resources/` | DataGen 生成的文件（自动创建，不要手动编辑） |
| `src/main/resources/assets/{modid}/` | 资源包内容（textures、models、lang 等） |
| `src/main/resources/data/{modid}/` | 数据包内容（recipes、loot_tables、tags 等） |

---

## 常用 Gradle 命令

```bash
# 首次构建（下载依赖，耗时较长）
./gradlew build

# 仅编译（跳过测试和 jar 打包）
./gradlew compileJava

# 启动游戏（开发用）
./gradlew runClient    # 启动客户端
./gradlew runServer    # 启动专用服务端
./gradlew runData     # 运行数据生成器

# 重新生成 IDE 项目文件
./gradlew eclipse      # Eclipse
./gradlew --refresh-dependencies  # 清除缓存重新下载
```

---

## mods.toml 关键字段

```toml
[[mods]]
modId="${mod_id}"           # 必须与 Java 代码中的 MOD_ID 一致
version="${mod_version}"     # 建议使用 ${mod_version} 占位符
displayName="${mod_name}"   # 显示名称
description='''多行描述'''  # 模组描述

[[dependencies.${mod_id}]]
modId="forge"               # 必须依赖 Forge
mandatory=true              # 是否强制依赖
versionRange="${forge_version_range}"
ordering="NONE"             # 加载顺序：NONE / BEFORE / AFTER
side="BOTH"                 # 加载侧：BOTH / CLIENT / SERVER
```

> **AI 注意**：`mods.toml` 中的 `modId`（如 `${mod_id}`）会在 Gradle 构建时替换为 `gradle.properties` 中的值。不要手动修改 `mods.toml` 中的 `modId`，修改 `gradle.properties` 即可。
