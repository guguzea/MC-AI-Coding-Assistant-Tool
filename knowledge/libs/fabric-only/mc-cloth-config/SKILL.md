---
name: mc-cloth-config
description: Cloth Config 配置库（Fabric/Quilt）接入。触发词：Cloth Config、cloth-config、ConfigBuilder、ConfigCategory、ConfigEntryBuilder、ConfigScreen、配置界面库、配置屏
platforms: [fabric, quilt]
mcVersions: ["1.14-26.2"]
communityDocId: authored/lib-cloth-config
mappings: hint
---

> 数据日期：2026-09-14。本稿是**通用形**（不绑单个 MC 版本）：版本相关的坐标一律走下面的「版本映射表」，逐行标证据等级。
> 证据等级：`manifest` = `mcp-server/data/lib-manifests/all.json` 里 cloth-config 条目的取件记录（文件名即上游构建名）；`本仓:` = 本仓库某档 scaffold 或 skill 正文的**现状**（是证据，不一定是正解，冲突处已标 ★）；`短文` = `authored/lib-cloth-config`（Modrinth API 实测 2026-09-02）。

# Cloth Config（Fabric / Quilt 视角通用形）

老牌配置屏库：`ConfigBuilder` + `ConfigEntryBuilder` 生成设置界面，包根长期稳定在 `me.shedaniel.clothconfig2.api`。**功能冻结但未停更**（短文实测：1.14 → 26.2 共 158 条构建 / 末次 2026-06-18 `v26.2.155`）——「拿不到本版构建」是伪命题，「等它加新特性」才是真没有。

## Decision: 要不要用 Cloth

```
Decision: 配置方案
→ 平台 = forge / neoforge 且只要服务端配置 → ForgeConfigSpec / ModConfigSpec，不引 Cloth（读 mc-config）
→ 需要图形配置屏 且 版本在 1.14–26.2 内 → 可用 Cloth
   ├─ 新项目 / 长维护 → 先比 mc-yacl；Cloth 冻结、社区新项目多转 YACL/Fzzy/owo-config
   ├─ 已有 Cloth 依赖（REI/Kiwi 生态）→ 保持 Cloth，别期待新 API
   └─ 平台 = quilt → 先读 QSL 配置文档；实测 158 条构建里 quilt 0 条，别当 Fabric 工程照抄
→ 平台 = bedrock → 本 skill 不适用
```

## 仓库行（先加仓库，再加依赖；漏了就拉不到）

Cloth **不在 Maven Central**。官方 README 给的 Fabric 侧仓库是 `https://maven.shedaniel.me/`：

```groovy
// build.gradle —— 两段都要；只写 dependencies 段是常见的「找不到依赖」成因
repositories {
    mavenCentral()
    maven { url "https://maven.shedaniel.me/" }   // ← Cloth 仓库行
}

dependencies {
    modApi("me.shedaniel.cloth:cloth-config-fabric:<版本，见下表>") {
        exclude group: "net.fabricmc.fabric-api"   // 必须；否则与项目自带 FAPI 撞版本
    }
    // Loom 工程若要把库打进产物（jiJ）再补：
    // include "me.shedaniel.cloth:cloth-config-fabric:<同上>"
}
```

- **症状对照（本仓实测）**：`fabric/1.21.1/scaffold/build.gradle:32-41` 记录了注释态的完整诊断——启用该依赖后配置期即报 `Could not find me.shedaniel.cloth:cloth-config-fabric:15.0.96`，两个独立原因：① 该档 `repositories` 只有 mavenCentral + maven.fabricmc.net，**没有 Cloth 仓库**；② 版本号上游不存在。**两处都修才拉得到。**
- 平台坐标：Fabric/Quilt = `me.shedaniel.cloth:cloth-config-fabric`；Forge = `cloth-config-forge`（artifact 名见 manifest 文件名 `cloth-config-forge-5.3.63.jar`）；NeoForge = `cloth-config-neoforge`（`cloth-config-18.0.145-neoforge.jar`）。**本 skill 只覆盖 Fabric/Quilt**；Forge/Neo 侧走 `mc-config`。
- ⚠️ **命名空间会变**：本仓摘要（`mcp-server/data/lib-api-summaries/cloth-config.json`，键 `1.14`）实测 Forge 侧类是 **relocate 过的** `me.shedaniel.forge.clothconfig2.*`，不是 `me.shedaniel.clothconfig2.*`。写 import 前先 `query_loader_api` / 反编译核对该平台坐标下的真实包名，**禁止默写**。

## 版本映射表

**用途**：选坐标里的 `<版本>`。**只写本仓有一手证据的行**；证据不足一律 `TODO(未核实)`，不许按邻居档推。

**真值来源（2026-09-14 实测，可复现）**：以 Modrinth API 逐 `game_versions` 取该 MC 版本下的 fabric 构建（77 条），取**最新 release** 的 `version_number`；再用 `maven.shedaniel.me` 的 `maven-metadata.xml`（该 artifact 共 **128** 个版本）确认该串**真的存在**。命令：

```bash
curl -sS "https://api.modrinth.com/v2/project/cloth-config/version?loaders=%5B%22fabric%22%5D&game_versions=%5B%221.16.5%22%5D"
curl -sS "https://maven.shedaniel.me/me/shedaniel/cloth/cloth-config-fabric/maven-metadata.xml"
```

| MC 版本线 | 坐标里的版本串（fabric，最新 release，实测） | 本仓现状 | 判定 |
| --- | --- | --- | --- |
| 1.14 / 1.14.1–1.14.4 | `1.8+fabric` | 该档 skill 写 `TODO` | 本仓未接，真值已给 |
| 1.15 / 1.15.1 / 1.15.2 | `2.14.2+fabric` | — | — |
| 1.16 / 1.16.1 | `4.6.0+fabric` | — | — |
| 1.16.2 / 1.16.3 | `4.15.82` | — | — |
| 1.16.4 / 1.16.5 | **`4.17.101`** | 该档 build.gradle:41 注释写 `6.0.50+1.16.5`（skill 正文写 `11.0.106+1.20.1`） | ★ **两者都错**：`6.0.50` / `6.0.50+1.16.5` / `11.0.106` 在 maven **均不存在** |
| 1.17 / 1.17.1 | **`5.3.63`** | 该档 skill 正文写 `6.0.46+1.17` | ★ 错（`6.0.46` 不在 maven；1.17.1 实为 5.3.63） |
| 1.18 / 1.18.1 / 1.18.2 | **`6.5.102`** | build.gradle:33 写 `9.0.2+1.18.2`；skill 正文写 `11.0.106+1.18.2` | ★ 两者都错（`9.0.2` 是 1.19.3 线；`11.0.106` 不在 maven） |
| 1.19 / 1.19.1 / 1.19.2 | `8.3.134+fabric` | — | — |
| 1.19.3 | `9.1.104+fabric` | — | — |
| 1.19.4 | **`10.1.135+fabric`** | build.gradle:34 写 `9.0.118+1.19.4` | ★ 错（`9.0.x` 属 1.19.3 线） |
| 1.20 / 1.20.1 | **`11.1.136+fabric`** | build.gradle:33 与 skill 正文都写 `11.0.106+1.20.1` | ★ 错（`11.0.106` 不在 maven；短文的 `11.1.136` 才是实存构建） |
| 1.20.2 | `12.0.137+fabric` | — | — |
| 1.20.3 / 1.20.4 | **`13.0.138+fabric`** | build.gradle 用 `${cloth_config_version}`（键不在 gradle.properties）；skill 正文写 `11.0.106+1.20.4` | ★ 错（同 1.20.1 的成因） |
| 1.20.5 / 1.20.6 | `14.0.139+fabric` | — | — |
| 1.21 / 1.21.1 | **`15.0.140+fabric`** | build.gradle:32-41 注释里实测过 `15.0.96`「上游不存在」（结论对，串错）；skill 正文写 `11.0.106+1.20.1` | ★ 真值是 `15.0.140+fabric` |
| 1.21.2 / 1.21.3 | **`16.0.143+fabric`** | build.gradle:43 写 `13.0.0+1.21`（maven 无 `13.0.0`）；skill 正文 `16.0.143` | ★ 前者错、后者对（16.0.143 在 maven ✔） |
| 1.21.4 | `17.0.144+fabric` | skill 正文写 `11.0.106+1.20.1` | ★ 跨档复制 |
| 1.21.5 | `18.0.145+fabric` | — | — |
| 1.21.6 / 1.21.7 / 1.21.8 | **`19.0.147+fabric`** | skill 正文写 `11.0.106+1.20.1` | ★ 跨档复制（manifest 里的 `19.0.147-fabric.jar` 同证） |
| 1.21.9 / 1.21.10 | `20.0.149+fabric` | 1.21.10 skill 正文写 `11.0.106+1.20.1` | ★ 跨档复制 |
| 1.21.11 | **`21.11.153+fabric`** | skill 正文 `21.11.153` | ✔ 一致（maven 有 `21.11.151` 同线） |
| 26.1 / 26.1.1 / 26.1.2 | **`26.1.154+fabric`** | manifest 文件名 `cloth-config-26.1.154.jar` + 短文实测 | ✔ 两处一致 |
| 26.2 | **`26.2.155+fabric`** | manifest 文件名 + 短文（末次发布 2026-06-18） | ✔ 两处一致 |

> **同线选哪个构建（不是对错，是选型）**：本表给的是**该 MC 线的最新 release**；另一条同样成立的选法是**按项目自带 Fabric API 版本对齐**（看候选构建 pom 里 `fabric-api` 依赖的后缀，如 `+1.16`），偏保守、与老项目依赖树摩擦小。两者差的是「同线内取哪一版」，**不改变「哪条 MC 线用哪个大版本」**（`4.x→1.16`、`5.x→1.17`、`6.x→1.18`、`7.x→1.19`、`8.x→1.19.1`、`9.x→1.19.3`、`10.x→1.19.4`、`11.x→1.20`、`12.x→1.20.2`、`13.x→1.20.4`；1.20.5 起按 jar 内 `fabric.mod.json` 的 `depends.minecraft` 判）。
>
> **本仓旧态警告（别抄历史值）**：2026-09-14 前，8 个档的 skill 正文写着 `11.0.106+1.20.1`（1.20.1 旧串，且该串**在 maven 也不存在**），另有 `6.0.50+1.16.5` / `6.0.46+1.17` / `9.0.2+1.18.2` / `9.0.118+1.19.4` / `13.0.0+1.21` 同样不在 maven —— 全是跨档复制产物。仓库正在把这些档逐个对齐（并行进行中）；**无论读到哪一版，以本表的 MC 线 + 上面两条实测命令为准**，不要按邻居档抄。
>
> Modrinth 的 `version_number` 带 `+fabric` 后缀、maven 坐标不带后缀（如 Modrinth `4.17.101` = 坐标 `me.shedaniel.cloth:cloth-config-fabric:4.17.101`）；两者是同一构建的两种写法，**坐标里不要带 `+fabric`**，也不要用 `+1.16.5` / `+1.20.1` 这类后缀（本仓 `client.txt`-式后缀在 Cloth 的 maven 上不存在）。

## 档位版本注入点（投影机制，2026-09-16）

- 各档手稿（`fabric/<v>/.cursor/skills/mc-cloth-config.md`）frontmatter 后带 **`cloth-version-inject` 标记行**（coord/state/textApi 三字段），由 `scripts/project-cloth-skill.mjs` 按本目录 `versions.json` 校验/回填——**改坐标先改 versions.json 再重投影**，禁止手改标记行。
- 本中心稿是**通用形权威**；手稿正文是各档已逐档修正的实况（2026-09-14 落地）。本表「本仓现状」列反映 2026-09-14 上午前的状态（S41-b 当日深夜已把各档坐标落为实证值），**以 `versions.json` 与档内标记为准**。
- 两套选法（本表「该线最新 release」/ 档内「对齐项目自带 FAPI」）都成立：同线内取哪一版是选型，不改变「哪条 MC 线用哪个大版本」。

## 已核实成员（签名级，2026-09-16）

**来源**：4 条 MC 版本线的 **Fabric 构件本体**（`me.shedaniel.cloth:cloth-config-fabric`）`javap` 直读，**逐签名四版一致**：

| jar | MC 线 | 字节数 |
| --- | --- | --- |
| `cloth-fabric-4.17.101.jar` | 1.16.4 / 1.16.5 | 1,117,847 |
| `cloth-11.1.106.jar` | 1.20 / 1.20.1 | 1,159,179 |
| `cloth-15.0.127.jar` | 1.21 / 1.21.1 | 1,144,382 |
| `cloth-21.11.150.jar` | 1.21.11 | 1,148,412 |

**12 个成员（= `generate_config` 默认骨架的调用点）**——jar 内为 intermediary 名，映射：`class_437` = Screen、`class_2561` = Component（yarn 名 `Text`）：

| # | 调用点 | 核实签名 |
| --- | --- | --- |
| 1 | `ConfigBuilder.create()` | `static ConfigBuilder create()` |
| 2 | `.setParentScreen(parent)` | `ConfigBuilder setParentScreen(class_437)` |
| 3 | `.setTitle(...)` | `ConfigBuilder setTitle(class_2561)` |
| 4 | `.entryBuilder()` | `ConfigEntryBuilder entryBuilder()`（default 方法） |
| 5 | `.getOrCreateCategory(...)` | `ConfigCategory getOrCreateCategory(class_2561)` |
| 6 | `category.addEntry(...)` | `ConfigCategory addEntry(AbstractConfigListEntry)` |
| 7 | `entry.startBooleanToggle(...)` | `BooleanToggleBuilder startBooleanToggle(class_2561, boolean)` |
| 8 | `.setDefaultValue(true)` | `BooleanToggleBuilder setDefaultValue(boolean)`（另有 `setDefaultValue(Supplier<Boolean>)`） |
| 9 | `.setSaveConsumer(v -> …)` | `BooleanToggleBuilder setSaveConsumer(Consumer<Boolean>)` |
| 10 | `.build()`（条目） | `BooleanListEntry build()`（`extends AbstractConfigListEntry`，可进 `addEntry`） |
| 11 | `builder.setSavingRunnable(...)` | `ConfigBuilder setSavingRunnable(Runnable)` |
| 12 | `builder.build()` | `Screen build()`（`class_437`） |

**边界**：
- 仓内摘要 `data/lib-api-summaries/cloth-config.json`（键 `1.14`）是 **Forge 工件** `me.shedaniel.forge.clothconfig2.*`，与本表的 Fabric 包名 **不同工件**，不作为本表来源（本表 = Fabric 构件本体直读）。
- **只核实这 12 个骨架调用点**；其它成员（`startIntSlider` / `startStrField` / `setCategoryBackground` …）**未逐个核实**，要写先 `javap` 或 `ingest_loader_api` 核（强制前置见规则与 `mc-config`）。
- 映射口径按你工程二选一：`generate_config` 骨架用 Mojang 名（`Component` / `client.gui.screens.Screen`）；yarn 工程对齐为 `Text` / `client.gui.screen.Screen`。

## 通用形（API 形态，与版本无关）

```java
// 1) 配置持有类：手写 POJO，读写由你负责（可选 AutoConfig，见下）
public class MyConfig {
    public boolean enableFeature = true;
    public int value = 10;
}

// 2) 建屏：包根 me.shedaniel.clothconfig2.api（ConfigBuilder / ConfigCategory / ConfigEntryBuilder）
ConfigBuilder builder = ConfigBuilder.create()
    .setTitle(Text.literal("My Mod Config"))          // 1.19+ 用 Text.literal；1.16–1.18 用 new LiteralText(...)/new TranslatableText(...)
    .setSavingRunnable(() -> saveMyConfig());         // 只挂保存回调，业务逻辑别写进 Builder

ConfigEntryBuilder entryBuilder = builder.entryBuilder();
builder.getOrCreateCategory(Text.literal("General"))
    .addEntry(entryBuilder.startBooleanToggle(Text.literal("Enable Feature"), config.enableFeature)
        .setDefaultValue(true)
        .setSaveConsumer(v -> config.enableFeature = v)
        .build())
    .addEntry(entryBuilder.startIntSlider(Text.literal("Value"), config.value, 1, 100)
        .setDefaultValue(10)
        .setSaveConsumer(v -> config.value = v)
        .build());

// 3) 打开：Screen 只存在于客户端
MinecraftClient.getInstance().setScreen(builder.build());   // 1.16.5 名；映射名按该档 yarn/MCP 口径
```

- **入口挂载**：Fabric 侧走 Mod Menu 的软依赖回调（`modmenu` 与本库解耦，见 `authored/soft-deps-modlist`）；不接 Mod Menu 时自建按键 → 打开配置屏。
- **`me.shedaniel.autoconfig` 是可选的另一半**：注解式配置 + 自动读写（本仓摘要 `1.14` 键里有 `me.shedaniel.autoconfig` 顶层包证据）。用不用它都要保证「配置落盘路径唯一」。
- **不写死签名**：本 skill 给出的是形态，**具体方法名 / 重载以官方 README + 反编译为准**；落到类成员请走 `query_loader_api`（先 `ingest_loader_api` 自备该档 jar）。历史缺陷：本仓 1.16.5 档曾出现 Cloth 骨架硬编码 14 个未入库成员调用，已全部替换为 `TODO(未核实)` —— 不要重犯。

## 常见坑

- **漏仓库行** → `Could not find me.shedaniel.cloth:cloth-config-fabric:<v>`（配置期即失败）。症状与两个成因的实测记录见 `fabric/1.21.1/scaffold/build.gradle:32-41`。
- **跨档抄坐标**：本仓实测有 8 个档的 skill 正文写着 `11.0.106+1.20.1`（1.20.1 的版本）——含 1.16.5 / 1.18.2 / 1.20.4 / 1.21.1 / 1.21.4 / 1.21.8 / 1.21.10。**先查上表，别抄邻居档。**
- **`exclude group: "net.fabricmc.fabric-api"` 漏写** → 与项目自带 FAPI 撞版本，`Duplicate mod` / 运行期类冲突。
- **Screen 类被公共（双方）代码引用** → 专用服 `NoClassDefFoundError`。Fabric/Quilt：放 client 源集 + `@Environment(EnvType.CLIENT)`；Forge/Neo：`Dist.CLIENT` 门闩。
- **只 `compileOnly` 却当硬依赖用** → 未装 Cloth 的整合包崩。软依赖请用 `FabricLoader.getInstance().isModLoaded("cloth-config")` 门闩。
- **`fabric.mod.json` 声明与 build.gradle 不一致**：硬依赖写 `depends.cloth-config`，软依赖写 `suggests`，两者别混。
- **双份配置**：同时用 Cloth 与 `ForgeConfigSpec`/自研文件读写同一份配置 → 互相覆盖。

## 自检

- 未装 Cloth（软依赖场景）：模组正常进档，日志无 `me.shedaniel` 类加载。
- 只装 Cloth：配置屏能开、改动保存后重启仍在。
- `runServer` 日志无 Cloth 相关类加载（Screen 泄漏的判据）。
- 坐标 + 仓库行两处都在（用上表核过版本，不是抄邻居档）。

## 交叉引用

- 选型总纲：`mc-config`（ForgeConfigSpec / Cloth / YACL / Fzzy 四路对比）；替代：`mc-yacl`
- 短文（数据视图）：`authored/lib-cloth-config`；分类导航：`authored/library-catalog-2026`
- MCP：`check_dependencies`（查该档是否已有 Cloth）、`search_community_docs`、`query_loader_api`（核类成员）
- 官方：https://github.com/shedaniel/cloth-config ；仓库 https://maven.shedaniel.me/
