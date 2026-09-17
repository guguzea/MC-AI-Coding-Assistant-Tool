# Fabric 1.16.5 模组项目骨架说明

> 本文件供 AI 编程助手阅读，描述每个文件的职责、修改注意事项和扩展位置。
> 当 AI 开始一个新的 Fabric 1.16.5 项目时，先读本文件。

本档事实核（落笔任何名字前先对号）：

- Minecraft `1.16.5` / Yarn `1.16.5+build.10` / Fabric Loader `0.11.2` / Fabric API `0.42.0+1.16`（全部在 `gradle.properties`）
- Loom 插件 `fabric-loom` 版本 `0.10.31`（`build.gradle:2`），Gradle Wrapper `7.6.1`（`gradle/wrapper/gradle-wrapper.properties`）
- **Java 8**：`build.gradle:79-81`（`options.release = 8`）+ `build.gradle:83-88`（`JavaVersion.VERSION_1_8`）、`src/main/resources/fabric.mod.json:25`（`"java": ">=8"`）、`src/main/resources/examplemod.mixins.json:5`（`"compatibilityLevel": "JAVA_8"`）三处同口径。权威依据：`.cursor/rules/00-project-setup.mdc:11`「Minecraft 1.16.5 运行在 Java 8；Java 16 从 Minecraft 1.17 起才要求」与 `:87`「用 Java 16/17 编译的模组无法在 1.16.5 加载」。**1.16.5 不是 Java 16/17 档**，任何 `JAVA_16` / `JAVA_17` / `">=17"` 出现在本档都是缺陷。
- 名字的第一方证据：原版/Yarn 名查 `data/fabric_1.16.5/mappings/yarn-1.16.5+build.10-tiny.gz`；Fabric API 名查 `mcp-server/data/loader-api-summaries/1.16.5-fabric-api.json`（或 `query_loader_api --platform=fabric --minecraftVersion=1.16.5`）；写法口径查本档 `.cursor/rules/*.mdc`。**禁止**把 1.17+ / 1.20.x 的名字当本档可用名（差异见下节）。

---

## 文件清单与职责

```
fabric-mod/
├── build.gradle                       # Loom 0.10.31 + 依赖 + processResources 展开 + Java 8 锁定
├── settings.gradle                    # 插件仓库与项目名
├── gradle.properties                  # 版本号集中管理（优先改这里）
├── gradlew / gradlew.bat              # Wrapper 入口
├── gradle/wrapper/                    # gradle-wrapper.jar + 7.6.1 发行版坐标
├── .gitignore
└── src/main/
    ├── java/com/example/examplemod/
    │   ├── ExampleMod.java            # 主入口 implements ModInitializer（本档用 log4j LogManager）
    │   ├── ExampleModClient.java      # 客户端入口 implements ClientModInitializer
    │   ├── ExampleAnimalEntity.java   # 示例实体类 extends AnimalEntity（未在 ExampleMod 注册）
    │   └── mixin/
    │       ├── ExampleMixin.java      # 通用 Mixin：注入 MinecraftServer#tick
    │       └── client/ExampleMixin.java # 客户端 Mixin：注入 MinecraftClient#tick
    └── resources/
        ├── fabric.mod.json            # 元数据：含 ${} 占位符，构建期由 processResources 展开
        ├── pack.mcmeta                # 资源包标识
        └── examplemod.mixins.json     # Mixin 配置：package / compatibilityLevel / 类清单
```

- 本 scaffold **没有** `src/generated/resources/`、没有 datagen 源集、没有 accessWidener 文件、没有 `assets/` / `data/` 目录（要加内容时自行创建）。
- `fabric.mod.json:12` 的 `icon` 指向 `assets/examplemod/icon.png`，而 scaffold 不含该图标文件：Loader 缺图标只 WARN 并回退默认图标，不阻断构建。
- `ExampleAnimalEntity` 只是实体类样例，**未注册**为 `EntityType`；它的 `createChild` 注释已说明「无强类型字段可用」。因此 `ExampleModClient` 里不给渲染器注册的可编译示例（1.16.5 的注册入口字段名本仓无一手证据，见该文件内 `TODO(未核实)`），需要时按「扩展骨架 · 添加自定义实体」先注册再挂渲染器。

---

## 优先修改：`gradle.properties`

所有**依赖/映射/loader/mod** 版本号集中在此文件，禁止在 `build.gradle` 中硬编码；唯一例外是 Gradle **插件**版本（`fabric-loom` 等），插件块按 Gradle 惯例必须内联，不算违规。本档实存键：

```properties
minecraft_version=1.16.5
yarn_mappings=1.16.5+build.10
loader_version=0.11.2
fabric_api_version=0.42.0+1.16

mod_id=examplemod          # 全小写
mod_name=Example Mod
mod_version=1.0.0
mod_description=An example Fabric mod
mod_authors=ExampleAuthor
mod_license=MIT
maven_group=com.example    # Java 包名前缀：${maven_group}.${mod_id} = com.example.examplemod
```

> **AI 注意 1**：包名前缀的键名是 `maven_group`，**不是** `mod_group_id`（后者在本档 `gradle.properties` 里不存在，写上去只会得到 `MissingPropertyException`）。
> **AI 注意 2**：改 `mod_id` 后必须同步 `fabric.mod.json` 的 `${mod_id}` 派生项、`ExampleMod.java` 的 `MOD_ID` 常量、`examplemod.mixins.json` 的文件名（`fabric.mod.json:17` 按 `${mod_id}.mixins.json` 引用它），以及所有 `new Identifier(MOD_ID, ...)` 注册名。

---

## 1.16.5 与后期版本（1.17+/1.20.x）的差异 —— 照后期抄必错

| 事项 | 1.16.5（本档，可用） | 后期写法（本档禁止） | 证据 |
| --- | --- | --- | --- |
| 注册表常量 | `Registry.BLOCK` / `Registry.ITEM` / `Registry.ENTITY_TYPE` 静态字段 | `Registries.*`（1.19.3+ 才有的类） | tiny `FIELD net/minecraft/util/registry/Registry.{BLOCK,ITEM,ENTITY_TYPE}`；`.cursor/rules/01-registry.mdc:24-33` |
| 方块材质枚举 | `net.minecraft.block.Material` | `net.minecraft.block.material.Material`（1.17+ 路径） | tiny `CLASS net/minecraft/block/Material` 存在，`net/minecraft/block/material/Material` 全集零命中 |
| 方块设置类 | `net.fabricmc.fabric.api.block.FabricBlockSettings`，方法 `of(Material)` / `copy(Block)` / `copyOf(Settings)` / `strength(float,float)` / `breakByTool` / `breakByHand` / `materialColor` / `dropsLike` / `noCollision` | `object.builder.v1.block.FabricBlockSettings` 的 `create()` / `copyOf(Block)` / `requiresTool` / `mapColor` / `solid` / `suffocates` | `.cursor/rules/02-block.mdc:4-6`；`query_loader_api 1.16.5 → net.fabricmc.fabric.api.block.FabricBlockSettings` 逐方法回读 |
| 地图色 | Yarn `MapColor`，石头灰字段 `STONE_GRAY`；FAPI 方法名仍叫 `materialColor` | `MaterialColor` / `MaterialColor.STONE` | `.cursor/rules/02-block.mdc:6` |
| 实体渲染器注册类 | `net.fabricmc.fabric.api.client.rendereregistry.v1.EntityRendererRegistry`（本档**没有** `client.rendering.v1` 包） | `...client.rendering.v1.EntityRendererRegistry`（1.17+ 现役形态） | `loader-api-summaries/1.16.5-fabric-api.json:487`；`query_loader_api` 查 `rendering.v1` 形态 → `found:false` |
| 实体生成分类 | Yarn `SpawnGroup`（例：`SpawnGroup.CREATURE`） | Mojmap `MobCategory` | `.cursor/rules/04-entity.mdc:61,91` |
| 实体工厂类型 | `EntityType.EntityFactory<T>`（tiny 中 `EntityType$EntityFactory`；FAPI 签名里的 `class_1299.class_4049<T>`） | —— | tiny `CLASS net/minecraft/entity/EntityType$EntityFactory`；`1.16.5-fabric-api.json` 的 `FabricEntityTypeBuilder.create(class_1311, class_1299.class_4049<T>)`（`class_1311` = `SpawnGroup`） |
| 客户端分离注解 | `@Environment(EnvType.CLIENT)`（本档 `ExampleModClient.java:10` 现状） | `@OnlyIn(Dist.CLIENT)`（Forge/Neo 写法） | 根 `AGENTS.md`「物理端约束」+ 本 scaffold 代码 |
| Java 级别 | 8 | 16 / 17 / 21 | 见首节「本档事实核」 |

---

## 扩展骨架：添加新内容

### 添加新方块

在 `ExampleMod.java` 中（注册必须发生在 `onInitialize()`，见「关键规则」）：

```java
// 方块：Block.Settings 或 FabricBlockSettings（1.16.5 包是 net.fabricmc.fabric.api.block）
private static final Block MY_BLOCK =
    Registry.register(
        Registry.BLOCK,
        new Identifier(MOD_ID, "my_block"),
        new Block(FabricBlockSettings.copy(Blocks.STONE).strength(1.5f))
    );

// 同名 BlockItem：方块有物品形态时必须同名
private static final Item MY_BLOCK_ITEM =
    Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_block"),   // 必须同名！
        new BlockItem(MY_BLOCK, new Item.Settings())
    );
```

### 添加新物品

```java
private static final Item MY_ITEM =
    Registry.register(
        Registry.ITEM,
        new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings().maxCount(64))   // Item$Settings.maxCount(int) 见 tiny
    );
```

### 添加自定义实体

```java
public static final EntityType<ExampleAnimalEntity> EXAMPLE_ANIMAL =
    Registry.register(
        Registry.ENTITY_TYPE,
        new Identifier(MOD_ID, "example_animal"),
        FabricEntityTypeBuilder.create(SpawnGroup.CREATURE, ExampleAnimalEntity::new)
            .dimensions(EntityDimensions.changing(0.9f, 1.4f))
            .build()
    );
```

- `FabricEntityTypeBuilder` 用 `net.fabricmc.fabric.api.object.builder.v1.entity` 那份（本档 `ExampleAnimalEntity.java:4` 现状）；`create(SpawnGroup, EntityType.EntityFactory<T>)` 与 `dimensions(EntityDimensions)` / `build()` 均可从 `1.16.5-fabric-api.json` 逐签名回读。
- `EntityDimensions.changing(float, float)` 见 tiny `METHOD net/minecraft/entity/EntityDimensions.changing (FF)`。
- 属性注册用 `FabricDefaultAttributeRegistry.register`（`.cursor/rules/04-entity.mdc:61`）。
- 渲染器：1.16.5 的注册类是 `net.fabricmc.fabric.api.client.rendereregistry.v1.EntityRendererRegistry`；该类的调用形态（静态入口字段名）本仓 loader-api 摘要未覆盖，写之前先按 `TODO(未核实)` 走 `ingest_loader_api` 补该档 jar 再核。原版可用渲染器名以本档 tiny 为准，例如 `net/minecraft/client/render/entity/CowEntityRenderer`；`AnimalsRenderer`、`entity/renderer/*` 包在 1.16.5 都不存在。

---

## 关键规则

### 注册必须发生在 `onInitialize()`

本档口径来自 `.cursor/rules/01-registry.mdc:12-16`：所有注册在 `onInitialize()`（或对应 entrypoint）中调用 `Registry.register()`；Fabric 没有 mod bus，**只 `new` 不注册的对象不会出现在游戏里**。

```java
@Override
public void onInitialize() {
    LOGGER.info("Mod initialized");
    // 注册调用放在这里（或本类内联静态字段的初始化里，但顺序要自己保证）
}
```

### mod ID

- 必须全小写，且与 `fabric.mod.json` 的 `id` 完全一致（`ExampleMod.java:8` 的 `MOD_ID` 同步）。
- 本档规则取保守口径：不用横杠（`.cursor/rules/01-registry.mdc:53-61` 把 `example-mod` 判为错误示例）。根 `AGENTS.md` 允许 Fabric 用连字符，但**本档 README 与 rules 一致**，需要连字符请先改 rules 再改这里。

### 服务端不要引用客户端类

```java
// ❌ 在 ExampleMod（双方入口）里拿 MinecraftClient —— 服务端崩溃
MinecraftClient client = MinecraftClient.getInstance();

// ✅ 客户端逻辑放 ExampleModClient（已带 @Environment(EnvType.CLIENT)）
```

同理 `EntityRendererRegistry` 一类客户端注册只能在 `ExampleModClient.onInitializeClient()` 里出现（`.cursor/rules/04-entity.mdc:90`）。

---

## 目录约定

| 目录 | 内容 |
|------|------|
| `src/main/java/` | 所有 Java 源码（包名根 = `${maven_group}.${mod_id}`）|
| `src/main/resources/` | `fabric.mod.json` / `pack.mcmeta` / `examplemod.mixins.json` |
| `src/main/resources/assets/{modid}/` | 材质、模型、`lang/` 等（本 scaffold 未附样例文件）|
| `src/main/resources/data/{modid}/` | 配方、战利品表、标签等数据包内容（本 scaffold 未附样例文件）|

本档 Loom `0.10.31` 未配 datagen 源集，**没有** `src/generated/resources/`，也没有 `runDatagen` 任务；要 datagen 需自行加 `fabric-datagen` 依赖与 run 配置。

---

## 常用 Gradle 命令

```bash
./gradlew build                                            # 首次构建（下载依赖，耗时较长）
./gradlew build --no-build-cache --rerun-tasks              # 疑似缓存脏时全量重跑
./gradlew processResources                                 # 只看 fabric.mod.json / mixins 是否展开成期望值
./gradlew clean loom                                       # 换 yarn mappings 后刷新 Loom
./gradlew runClient                                         # 启动客户端
./gradlew runServer                                         # 启动服务端
./gradlew idea                                             # 生成 IntelliJ IDEA 工程
./gradlew eclipse                                          # 生成 Eclipse 工程
```

命令集与本档 `.cursor/rules/00-project-setup.mdc:29-38` 一致；`runClient` / `runServer` 由 Loom 注册（`build.gradle:2` 已 apply `fabric-loom`），`idea` / `eclipse` 来自 `build.gradle:4-5` 的两个插件。IDE 侧要用 JDK 8（见首节）。

---

## `fabric.mod.json` 关键字段

本档实文件（含占位符形态）见 `src/main/resources/fabric.mod.json`；要点：

```json
{
  "schemaVersion": 1,
  "id": "${mod_id}",
  "entrypoints": {
    "main":  ["${maven_group}.${mod_id}.ExampleMod"],
    "client": ["${maven_group}.${mod_id}.ExampleModClient"]
  },
  "mixins": ["${mod_id}.mixins.json"],
  "injectors": { "defaultRequire": 1 },
  "depends": {
    "fabricloader": ">=${loader_version}",
    "fabric": "*",
    "minecraft": ">=${minecraft_version}",
    "java": ">=8"
  }
}
```

- 1.16.5 的依赖键是 **`fabric`**，不是 1.17+ 的 `fabric-api`（本档 `fabric.mod.json:23` 现状）。
- `java` 是 `>=8`，与 `build.gradle` 的 `release = 8` 和 `mixins.json` 的 `JAVA_8` 对齐。
- `${...}` 由 `build.gradle:46-64` 的 `processResources { filesMatching(...) { expand ... } }` 在构建期替换；该 glob 现含 `fabric.mod.json`、`pack.mcmeta`、**`examplemod.mixins.json`** 三件 —— 少了第三件的话 `examplemod.mixins.json:4` 的 `"package": "${maven_group}.${mod_id}.mixin"` 不会被展开，Mixin 运行期按字面量找包，两个 mixin 全部失效。
- 手工预览展开结果：`./gradlew processResources` 后读 `build/resources/main/` 下同名文件，而不是直接改展开后的产物。
