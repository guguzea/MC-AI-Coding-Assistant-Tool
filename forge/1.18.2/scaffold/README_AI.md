# Forge 1.18.2 模组项目骨架说明

> 本文件供 AI 编程助手阅读，描述每个文件的职责、修改注意事项和扩展位置。
> 当 AI 开始一个新的 Forge 1.18.2 项目时，先读本文件。

---

## 文件清单与职责

```
forge-1.18.2-mod/
├── build.gradle              # Gradle 构建配置（ForgeGradle 5.x + Parchment）
├── settings.gradle           # 项目名称和插件管理
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
        │   └── mods.toml         # Forge 元数据
        └── pack.mcmeta          # 资源包标识（pack_format = 8 for 1.18.2）
```

---

## 优先修改：`gradle.properties`

所有版本号集中在此文件，**禁止在 `build.gradle` 中硬编码版本号**：

```properties
# ---- Minecraft / Forge 版本（Forge 1.18.2）----
minecraft_version=1.18.2
forge_version=40.1.80
forge_version_range=[40,)

# ---- Mappings（Parchment for 1.18.2）----
mapping_channel=parchment
mapping_version=1.18.2-2022.07.31

# ---- Mod 元数据 ----
mod_id=examplemod
mod_name=Example Mod
mod_version=1.0.0
mod_group_id=com.example.examplemod
mod_authors=YourNameHere
mod_description=Example mod description.\nAdd lines as needed.
```

---

## Forge 1.18.2 关键配置

| 配置项 | 值 |
|--------|-----|
| Minecraft | 1.18.2 |
| Forge | 40.1.x |
| Java | **Java 17** |
| Gradle | 7.x |
| ForgeGradle | **5.x** |
| Mappings | **Parchment** |
| pack_format | **8** |
| 世界高度 | **-64 到 320** |

---

## 扩展骨架：添加新内容

### 添加新方块

在 `ExampleMod.java` 中添加：

```java
// 在 RegistryObject 声明区域添加：
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(BlockBehaviour.Properties.of()
        .mapColor(MapColor.WOOD)
        .strength(2.0f)
    )
);
```

### 添加新物品

```java
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties().tab(CreativeModeTab.TAB_MISC))
);
```

### 添加自定义实体

```java
// 在 DeferredRegister 声明区域添加：
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITYTYPES, MOD_ID);

// 注册实体类型
public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register("my_entity",
    () -> EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
        .sized(0.6f, 1.8f)
        .build("my_entity")
);

// 在构造函数中注册到 modEventBus：
ENTITY_TYPES.register(modEventBus);
```

### 添加方块实体（BlockEntity）

```java
// 方块实现 EntityBlock 接口
public class MyBlock extends Block implements EntityBlock {
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new MyBlockEntity(pos, state);
    }
}

// 注册方块实体类型
public static final DeferredRegister<BlockEntityType<?>> BLOCKENTITIES =
    DeferredRegister.create(ForgeRegistries.BLOCKENTITIES, MOD_ID);
```

---

## 关键规则

### 禁止在 lambda 表达式之外引用 RegistryObject

```java
// ❌ 错误
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item", () -> new Item());
public static final ItemStack STACK = new ItemStack(MY_ITEM.get()); // NPE! 未初始化
```

### 禁止硬编码版本号

```properties
# ❌ 错误
forge_version=40.1.80

# build.gradle 中
minecraft "net.minecraftforge:forge:1.18.2-40.1.80"  # ❌ 硬编码

# ✅ 正确：引用 gradle.properties 属性
minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
```

---

## 目录约定

| 目录 | 内容 |
|------|------|
| `src/main/java/` | 所有 Java 源码 |
| `src/main/resources/` | 所有资源文件 |
| `src/generated/resources/` | DataGen 生成的文件（自动创建，不要手动编辑） |
| `src/main/resources/assets/{modid}/` | 资源包内容 |
| `src/main/resources/data/{modid}/` | 数据包内容 |

---

## 常用 Gradle 命令

```bash
# 首次构建（下载依赖，耗时较长）
./gradlew build

# 启动游戏（开发用）
./gradlew runClient    # 启动客户端
./gradlew runServer    # 启动专用服务端
./gradlew runData     # 运行数据生成器
```

---

## ForgeRegistries 字段（Forge 1.18.2）

| 注册内容 | ForgeRegistries 字段 |
|----------|---------------------|
| 方块 | `BLOCKS` |
| 物品 | `ITEMS` |
| 方块实体 | `BLOCKENTITIES` |
| 实体类型 | `ENTITYTYPES` |
| 菜单类型 | `CONTAINERS` |
| 流体类型 | `FLUIDTYPES` |
| 声音事件 | `SOUNDEVENTS` |
| 粒子类型 | `PARTICLETYPES` |
| 属性 | `ATTRIBUTES` |
