# Forge 1.16.5 模组项目骨架说明

> 本文件供 AI 编程助手阅读，描述每个文件的职责、修改注意事项和扩展位置。
> 当 AI 开始一个新的 Forge 1.16.5 项目时，先读本文件。

---

> **⚠️ Forge 1.16.5 `scaffold/` 与官方 MDK 存在代差 —— 有意保留，不是缺陷；禁止为了「对齐」去改 scaffold 钉值。**
> 注意（不是「已跑通」）：本档 `pack.meta.json` → `buildVerified: **false**`，卡点就是钉值本身 —— FG `[4.1,4.2)` 硬拒 Gradle 7+（2026-09-10 实测 `_g_forge1.16.5_v5.log`："Found Gradle version Gradle 7.6. Versions Gradle 7.0 and newer are not supported yet"），而 `gradle/wrapper/gradle-wrapper.properties:3` 钉的正是 7.6。按根裁定 wrapper 钉值保持不动；**是否降到 Gradle 6.x 需用户裁定**，本档只登记。
> 需要新版工具链：自行调用 `download_official_mdk`（默认 dryRun，只落到 `$MC_SKILL_CACHE`，不写仓库），再把返回值填进**你自己的工程**。

> | 字段 | 本档 `scaffold/` | 官方 MDK |
> | --- | --- | --- |
> | Gradle Wrapper | `scaffold/gradle/wrapper/gradle-wrapper.properties:3` → `gradle-7.6-bin` | `gradle-7.3.3-bin` |
> | ForgeGradle | `scaffold/build.gradle:5` → `[4.1,4.2)` | `build.gradle:7` → `ForgeGradle:5.1.+` |
> | Forge | `scaffold/gradle.properties:9` → `36.2.34` | `build.gradle:120` → `1.16.5-36.2.34`（同） |
> | mappings | `scaffold/gradle.properties:16-17` → `official` / `1.16.5` | `build.gradle:33` → `official` / `1.16.5`（同） |

> **取证与局限（2026-09-14 实读）**
> - 官方侧来源：`%APPDATA%\mc-skill-cache\mdk\forge\1.16.5\forgegradle\unpacked\`{gradle.properties, build.gradle, gradle/wrapper/gradle-wrapper.properties}；
>   本仓侧来源：本目录 `gradle.properties` / `build.gradle` / `gradle/wrapper/gradle-wrapper.properties`。
>   两侧值均逐行实读，非训练记忆。
> - 环境局限：本机 `JAVA_HOME` **未设**，PATH 上的 `java` 是 **Java 8（1.8.0_431）**。
>   任何复现取证 / Gradle 调用必须**显式**把 `JAVA_HOME` 指到 JDK 17
>   （本机：`G:/JAVA17/jdk-17.0.12_windows-x64_bin/jdk-17.0.12`），否则 FG6 档（1.20.x）直接 fail。
> - **禁止**在本仓库 `scaffold/` 目录内跑 Gradle。要跑先复制到仓库外的临时目录。

## 文件清单与职责

```
forge-1.16.5-mod/
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
minecraft_version=1.16.5
forge_version=36.2.34

# ---- Mappings（本包 ForgeGradle [4.1,4.2) 实测只认 official / snapshot 通道）----
# channel=parchment 真机失败：Unknown mapping provider: parchment_2021.07.27-1.16.5
mapping_channel=official
mapping_version=1.16.5

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

### 添加新物品

```java
// 在 ExampleMod.java 中添加：
public static final DeferredRegister<Item> ITEMS = ...;  // 已存在

// 在 RegistryObject 声明区域添加：
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties().tab(ItemGroup.TAB_MISC))
);
```

> **AI 注意**：
> - `"my_item"` 即 registry name，全小写下划线
> - `ITEMS.register()` 在 modEventBus 注册后才执行，不要在 lambda 之外使用 `MY_ITEM`

---

## 关键规则

### 禁止在 lambda 表达式之外引用 RegistryObject

```java
// ✅ 正确：lambda 内使用 .get() 获取实例
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(...);  // MY_ITEM 在 lambda 内部此时已可用（外部创建，lambda 延迟执行）
);

// ❌ 错误：在另一个静态字段中直接引用
public static final ItemStack STACK = new ItemStack(MY_ITEM.get()); // MY_ITEM 可能为 null
```

### 禁止硬编码版本号

```properties
# ❌ 错误：在 gradle.properties 中
forge_version=36.2.34

# build.gradle 中
minecraft "net.minecraftforge:forge:1.16.5-36.2.34"  # ❌ 硬编码

# ✅ 正确：引用 gradle.properties 属性
minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
```

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
