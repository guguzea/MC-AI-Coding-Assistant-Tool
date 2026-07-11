# Fabric 1.21.3 模组项目骨架说明

> 本文件供 AI 编程助手阅读，描述每个文件的职责、修改注意事项和扩展位置。
> 当 AI 开始一个新的 Fabric 1.21.3 项目时，先读本文件。

---

## 文件清单与职责

```
fabric-mod/
├── build.gradle              # Gradle 构建配置，定义依赖和 Loom 配置
├── settings.gradle           # 项目名称
├── gradle.properties        # 版本号集中管理（优先修改这里）
├── .gitignore               # Git 忽略配置
│
└── src/main/
    ├── java/com/example/examplemod/
    │   ├── ExampleMod.java      # 主入口（implements FabricMod）
    │   ├── ExampleModClient.java # 客户端入口（implements ClientModInitializer）
    │   ├── ExampleAnimalEntity.java # 示例实体类
    │   └── mixin/             # Mixin 类
    │       ├── ExampleMixin.java
    │       └── client/ExampleMixin.java
    │
    └── resources/
        ├── fabric.mod.json     # Fabric 元数据（modId / 版本 / 依赖声明）
        ├── pack.mcmeta        # 资源包标识（pack_format: 34）
        ├── examplemod.mixins.json # Mixin 配置
        └── assets/examplemod/  # 资源文件（textures、models 等）
```

---

## 优先修改：`gradle.properties`

所有版本号集中在此文件，**禁止在 `build.gradle` 中硬编码版本号**：

```properties
minecraft_version=1.21.3
yarn_mappings=1.21.3+build.2
loader_version=0.16.9
fabric_api_version=0.200.1+build.3

mod_id=examplemod          # 全部小写，禁止含 `-`
mod_name=Example Mod
mod_version=1.0.0
mod_group_id=com.example.examplemod   # Java 包名前缀
mod_authors=YourNameHere
mod_description=An example Fabric mod.
mod_license=MIT
```

> **AI 注意**：修改 `mod_id` 后，必须同步修改 `fabric.mod.json`、`ExampleMod.java` 中的 `MOD_ID` 常量和所有 `Identifier` 注册名。

---

## 扩展骨架：添加新内容

### 添加新方块

在 `ExampleMod.java` 中添加：

```java
// 静态字段
private static final RegistrySupplier<Block> MY_BLOCK =
    Registry.register(
        Registries.BLOCK,
        new Identifier(MOD_ID, "my_block"),
        new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(1.5f))
    );

// 同名 BlockItem
private static final RegistrySupplier<Item> MY_BLOCK_ITEM =
    Registry.register(
        Registries.ITEM,
        new Identifier(MOD_ID, "my_block"),  // 必须同名！
        new BlockItem(MY_BLOCK.get(), new Item.Settings())
    );
```

### 添加新物品

```java
private static final RegistrySupplier<Item> MY_ITEM =
    Registry.register(
        Registries.ITEM,
        new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings().maxCount(64))
    );
```

### 添加自定义实体

```java
public class MyEntity extends AnimalEntity {
    // ...
}

// 在 onInitialize() 中注册
public static final RegistrySupplier<EntityType<MyEntity>> MY_ENTITY =
    Registry.register(
        Registries.ENTITY_TYPE,
        new Identifier(MOD_ID, "my_entity"),
        FabricEntityTypeBuilder.create(MobCategory.CREATURE, MyEntity::new)
            .dimensions(EntityDimensions.changing(0.9f, 1.4f))
            .build()
    );
```

---

## 关键规则

### 禁止在 onInitialize() 外注册

```java
// ✅ 正确：在 onInitialize() 执行时，所有静态注册已经完成
@Override
public void onInitialize() {
    LOGGER.info("Mod initialized");
}

// ❌ 错误：不应该在 onInitialize() 中手动调用注册
// Registry.register() 在类加载时已执行，不需要再次调用
```

### 禁止使用 `-` 作为 mod ID 的一部分

```properties
# ❌ 错误
mod_id=example-mod

# ✅ 正确
mod_id=example_mod
```

### 禁止在服务端引用客户端类

```java
// ❌ 错误：在 ExampleMod（服务端）中引用 MinecraftClient
public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
        MinecraftClient client = MinecraftClient.getInstance();  // 崩溃！
    }
}

// ✅ 正确：客户端逻辑放在 ExampleModClient
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        MinecraftClient client = MinecraftClient.getInstance();  // 正确
    }
}
```

---

## 目录约定

| 目录 | 内容 |
|------|------|
| `src/main/java/` | 所有 Java 源码 |
| `src/main/resources/` | 所有资源文件 |
| `src/generated/resources/` | DataGen 生成的文件（自动创建，不要手动编辑）|
| `src/main/resources/assets/{modid}/` | 资源包内容（textures、models、lang 等）|
| `src/main/resources/data/{modid}/` | 数据包内容（recipes、loot_tables、tags 等）|

---

## 常用 Gradle 命令

```bash
# 首次构建（下载依赖，耗时较长）
./gradlew build

# 编译
./gradlew compileJava

# 启动客户端
./gradlew runClient

# 启动服务端
./gradlew runServer

# 启动数据生成器
./gradlew runDatagen

# 刷新 Loom（Mappings 变更后必需）
./gradlew clean loom

# 生成 IDE 项目
./gradlew idea    # IntelliJ IDEA
./gradlew eclipse # Eclipse
```

---

## fabric.mod.json 关键字段

```json
{
  "schemaVersion": 1,
  "id": "${mod_id}",
  "version": "${version}",
  "name": "${mod_name}",
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"],
    "client": ["com.example.examplemod.ExampleModClient"]
  },
  "mixins": ["examplemod.mixins.json"],
  "depends": {
    "fabricloader": ">=${loader_version}",
    "fabric-api": "*",
    "minecraft": ">=${minecraft_version}",
    "java": ">=21"
  }
}
```

> **AI 注意**：`fabric.mod.json` 中的 `${mod_id}` 会在 Gradle 构建时替换为 `gradle.properties` 中的值。不要手动修改 `fabric.mod.json` 中的 `id`，修改 `gradle.properties` 即可。

---

## ⚠️ 1.21.x 重要变化

### Fabric API 0.200.x 重大变化

- `fabric-networking-api-v1`: `ServerPlayNetworking` 方法签名变更
- `fabric-attachment-api-v1` 取代 `fabric-capability-api-v1`（Capability 系统被移除）
- `fabric-language-kotlin` 需要特定版本兼容 1.21+

### Pack Format

- 1.21.3 使用 `pack_format: 34`

### Java 版本

- **必须使用 Java 21**（不再支持 Java 17）
