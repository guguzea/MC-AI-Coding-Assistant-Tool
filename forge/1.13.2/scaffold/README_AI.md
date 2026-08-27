# Forge 1.13.2 模组项目骨架说明

> 本文件供 AI 编程助手阅读，描述每个文件的职责、修改注意事项和扩展位置。
> 当 AI 开始一个新的 Forge 1.13.2 项目时，先读本文件。

---

## 文件清单与职责

```
forge-1.13.2-mod/
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
minecraft_version=1.13.2
forge_version=25.0.219

# ---- Mappings（MCP SRG 格式）----
mapping_channel=mcp
mapping_version=1.13.2

# ---- Mod 元数据 ----
mod_id=examplemod          # 全部小写，禁止含 `-`
mod_name=Example Mod
mod_version=1.0.0
mod_group_id=com.example.examplemod   # Java 包名前缀
mod_authors=YourNameHere
mod_description=Example mod description.
```

> **AI 注意**：修改 `mod_id` 后，必须同步修改 `mods.toml`、`ExampleMod.java` 中的 `MOD_ID` 常量和所有 `setRegistryName` 注册名。

---

## 扩展骨架：添加新内容

### 添加新方块

在 `ExampleMod.java` 中添加：

```java
// 定义方块（静态字段）
public static final Block MY_BLOCK = new Block(
    Block.Properties.create(Material.WOOD)
        .hardnessAndResistance(2.0f)
);

// 注册（在 RegistryEvent.Register<Block> 回调中添加）
@SubscribeEvent
public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
    event.getRegistry().register(MY_BLOCK.setRegistryName(
        new ResourceLocation(MOD_ID, "my_block")
    ));
}
```

> **AI 注意**：
> - 方块使用 `Block.Properties.create(Material)` 而非 1.14+ 的 `BlockBehaviour.Properties.of()`
> - 必须调用 `setRegistryName()` 设置注册名
> - 注册通过 `@SubscribeEvent` 在 `RegistryEvent.Register<Block>` 时机执行

### 添加新物品

```java
// 定义物品（静态字段）
public static final Item MY_ITEM = new Item(
    new Item.Properties()
        .group(ItemGroup.TAB_MISC)
        .maxStackSize(64)
);

// 注册（在 RegistryEvent.Register<Item> 回调中添加）
@SubscribeEvent
public void onItemsRegistry(RegistryEvent.Register<Item> event) {
    event.getRegistry().register(MY_ITEM.setRegistryName(
        new ResourceLocation(MOD_ID, "my_item")
    ));
}
```

---

## 关键规则

### 必须使用 @EventBusSubscriber 注册

Forge 1.13.2 使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>` 模式：

```java
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    // 静态字段定义内容
    public static final Block EXAMPLE_BLOCK = new Block(...);

    // 在构造函数中注册到事件总线
    public ExampleMod() {
        MinecraftForge.EVENT_BUS.register(this);
    }

    // 使用 @SubscribeEvent 处理注册事件
    @SubscribeEvent
    public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
        event.getRegistry().register(EXAMPLE_BLOCK.setRegistryName(...));
    }
}
```

### 禁止硬编码版本号

```properties
# ❌ 错误：在 build.gradle 中硬编码
minecraft "net.minecraftforge:forge:1.13.2-25.0.219"

# ✅ 正确：引用 gradle.properties 属性
minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
```

### pack_format

Forge 1.13.2 使用 `pack_format = 6`（在 pack.mcmeta 中）。

---

## 目录约定

| 目录 | 内容 |
|------|------|
| `src/main/java/` | 所有 Java 源码 |
| `src/main/resources/` | 所有资源文件 |
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

# 重新生成 IDE 项目文件
./gradlew eclipse      # Eclipse
./gradlew idea         # IntelliJ IDEA
```

---

## mods.toml 关键字段

```toml
[[mods]]
modId="${mod_id}"           # 必须与 Java 代码中的 MOD_ID 一致
version="${mod_version}"
displayName="${mod_name}"
description='''多行描述'''

[[dependencies.${mod_id}]]
modId="forge"               # 必须依赖 Forge
mandatory=true
versionRange="${forge_version_range}"
ordering="NONE"
side="BOTH"
```

> **AI 注意**：`mods.toml` 中的 `modId`（如 `${mod_id}`）会在 Gradle 构建时替换为 `gradle.properties` 中的值。

---

## Gradle / ForgeGradle 3（本档不能用系统 Gradle 8 + JDK 17 直接 `properties`）

`plugins { id 'net.minecraftforge.gradle' version '[3.2,3.3)' }` **永远解析不到**：Gradle plugin marker 线上只有 `3.0.196` / `3.0.197`（无 3.2.x）。

在 `%TEMP%` 用 Java 8 实测：

| Gradle | pin `3.0.197` 结果 |
|--------|-------------------|
| 6.9.4 | 插件能下载，apply 时 FG3 硬拒「Gradle 6.0.0 and newer are not supported in FG3」 |
| 5.6.4 | 插件 apply 成功，随后 `JavaLanguageVersion` 不存在（toolchain 是 Gradle 6.7+ API）→ 本 scaffold 的 `java.toolchain` 行失败 |

因此本轮 **不改** `build.gradle` 的 plugins 行（禁止用「能编译的假 FG 号」或把 toolchain 降回 FG3 年代 DSL 而不对照官方 1.13.2 MDK）。只把 `gradle-wrapper.properties` 的 `distributionUrl` 补上 `https://services.gradle.org/distributions/` 前缀。要跑通请对照当时官方 MDK 的 `buildscript { classpath 'net.minecraftforge.gradle:ForgeGradle:3.x' }` + 其指定的 Gradle 5.x，不要用系统 Gradle 8/9。

