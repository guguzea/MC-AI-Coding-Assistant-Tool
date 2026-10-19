# 名字出处核验台账（nowhere 清单 × 真构件）
# 人类不用看这个
> 本文件由 `F:\MOD_TEST\gen-doc.mjs` 从 `verify3.json` / `artifact-map2.json` 生成，**不要手改数字**；口径与脚本见文末「复现」。
> 生成日期：2026-10-13。

## 1. 这是什么

仓内有一份**候选发现器**（`F:\MOD_TEST\nonfabric-skill-names.mjs`，不入库），扫各平台/档的 `.cursor/{rules,skills}`、`code-patterns/`、`knowledge/`、`AGENTS.md`、`scaffold/**`（含 `.java` 模板）里的标识符，凡在**六条仓内腿**（本档语料逐字 / 本档映射库 / 本档 loader 摘要 / mojmap 派生表 / 本包自声明 / 同平台并集）里都找不到出处的，记入 **nowhere**。本台账把这些 nowhere 逐名交给**真构件**复核。

六条腿全在仓内、**没有一条是真构件**，所以 nowhere 只是一份「待核候选」。本台账的结论一律以真构件为准。

## 2. 方法与判据

- **真构件集**：合并件（forge `*_mapped_*`、neoforge `*-merged`、fabric loom `minecraft-merged-*`/`project-@-mapped`）+ **该档依赖件**（net.minecraftforge `eventbus/coremods/unsafe` 与 `fml*`、net.neoforged `neoforge-<ver>-universal/bus/coremods`、fabric loom `remapped_mods` 全部件）+ **本机模块缓存全量库件**（1890 件，含跨版本）。
- **存在性判据**：逐 `.class` 解析常量池（纯 Node，最小 ZIP reader + class 文件常量池解析），**精确匹配**名字；顶层类的简单名不单独出现在常量池，故对含 `/` 或 `$` 的项再切词核对 FQCN/描述符/泛型签名。
- **verdict 四态**：`PRESENT-MAIN`（本档合并件里有）/ `PRESENT-DEPS`（本档依赖件里有）/ `PRESENT-LIB`（本机库缓存里有，**跨版本**，方向偏「存在」）/ `ABSENT`（三者皆无）。
- **偏保守**：目录含跨版本件 ⇒ `ABSENT` 是强结论（该名在本机这一档的构件里确实不存在），`PRESENT-*` 只说明存在、**不证明用法正确**。

### 覆盖（哪些档核得了）

| 档 | 主件 | 依赖件数 |
| --- | --- | --- |
| fabric|1.17.1 | minecraft-project-@-mapped.jar | 50 |
| fabric|1.18.2 | minecraft-merged-3abf014fcc-1.18.2-net.fabricmc.yarn.1_18_2.1.18.2+build.4-v2.jar | 49 |
| fabric|1.19.4 | minecraft-merged-44e7483152-1.19.4-net.fabricmc.yarn.1_19_4.1.19.4+build.2-v2.jar | 53 |
| fabric|1.20.1 | minecraft-merged-51c0cfe141-1.20.1-net.fabricmc.yarn.1_20_1.1.20.1+build.10-v2.jar | 53 |
| fabric|1.20.4 | minecraft-merged-dd71698084-1.20.4-net.fabricmc.yarn.1_20_4.1.20.4+build.3-v2.jar | 52 |
| fabric|1.21.1 | minecraft-merged-c3f060f70f-1.21.1-net.fabricmc.yarn.1_21_1.1.21.1+build.2-v2.jar | 50 |
| fabric|1.21.10 | minecraft-merged-6227aad8ee-1.21.10-net.fabricmc.yarn.1_21_10.1.21.10+build.3-v2.jar | 92 |
| fabric|1.21.11 | minecraft-merged-2ae02fda0f-1.21.11-net.fabricmc.yarn.1_21_11.1.21.11+build.6-v2.jar | 95 |
| fabric|1.21.3 | minecraft-merged-4c1b918aa2-1.21.3-net.fabricmc.yarn.1_21_3.1.21.3+build.2-v2.jar | 49 |
| fabric|1.21.4 | minecraft-merged-a172fc6613-1.21.4-net.fabricmc.yarn.1_21_4.1.21.4+build.8-v2.jar | 149 |
| fabric|1.21.8 | minecraft-merged-0cbc897a28-1.21.8-net.fabricmc.yarn.1_21_8.1.21.8+build.1-v2.jar | 91 |
| fabric|26.1.2 | minecraft-merged-043a8b3edf-26.1.2.jar | 0 |
| forge|1.13.2 | forge-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar | 17 |
| forge|1.14.4 | forge-1.14.4-28.2.26_mapped_snapshot_20190719-1.14.3.jar | 17 |
| forge|1.15.2 | forge-1.15.2-31.2.50_mapped_official_1.15.2.jar | 17 |
| forge|1.16.5 | forge-1.16.5-36.2.34_mapped_official_1.16.5.jar | 17 |
| forge|1.17.1 | forge-1.17.1-37.1.1_mapped_official_1.17.1.jar | 21 |
| forge|1.18.2 | forge-1.18.2-40.1.80_mapped_parchment_2022.08.21-1.18.2.jar | 21 |
| forge|1.19.4 | forge-1.19.4-45.4.0_mapped_parchment_2023.06.26-1.19.4.jar | 21 |
| forge|1.20.1 | forge-1.20.1-47.4.0_mapped_official_1.20.1.jar | 25 |
| forge|1.20.4 | forge-1.20.4-49.2.0_mapped_parchment_2024.02.25-1.20.4.jar | 21 |
| neoforge|1.20.1 | forge-1.20.1-47.4.0_mapped_official_1.20.1.jar | 13 |
| neoforge|1.20.4 | neoforge-20.4.251-merged.jar | 10 |
| neoforge|1.20.6 | neoforge-20.6.139-merged.jar | 6 |
| neoforge|1.21.1 | neoforge-21.1.248-merged.jar | 8 |
| neoforge|1.21.10 | neoforge-21.10.64-merged.jar | 6 |
| neoforge|1.21.11 | neoforge-21.11.45-merged.jar | 6 |
| neoforge|1.21.3 | neoforge-21.3.97-merged.jar | 6 |
| neoforge|1.21.5 | neoforge-21.5.98-merged.jar | 6 |
| neoforge|1.21.8 | neoforge-21.8.54-merged.jar | 6 |
| neoforge|26.1 | minecraft-patched-26.1.2.114-merged.jar | 8 |
| rift|1.13.2 | forge-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar | 17 |

**本机无可用构件（一律记「未核实」，不据此判缺陷）** —— ⚠️ **下表已被 §8.9(1) 更正**：forge 1.7.10–1.12.2 / fabric 1.14.4·1.16.5 / quilt 1.18.2–1.21.1 / liteloader 三档 / modloader / bedrock **本机其实都有可用件**（路径与覆盖范围见 §8.9(1)）。下表保留为「扫描构件集当时的状态」：

| 档 | 原因 |
| --- | --- |
| forge|1.7.10 | 无 mapped 构件 |
| forge|1.8.9 | 无 mapped 构件 |
| forge|1.9.4 | 无 mapped 构件 |
| forge|1.10.2 | 无 mapped 构件 |
| forge|1.11.2 | 无 mapped 构件 |
| forge|1.12.2 | 无 mapped 构件 |
| forge|1.21.1 | 无 mapped 构件 |
| fabric|1.14.4 | 无 merged 构件 |
| fabric|1.16.5 | 无 merged 构件 |
| quilt|1.18.2 | 本档无 QSL/QFAPI 构件（仓库自述） |
| quilt|1.19.4 | 本档无 QSL/QFAPI 构件（仓库自述） |
| quilt|1.20.1 | 本档无 QSL/QFAPI 构件（仓库自述） |
| quilt|1.20.4 | 本档无 QSL/QFAPI 构件（仓库自述） |
| quilt|1.21.1 | 本档无 QSL/QFAPI 构件（仓库自述） |
| quilt|1.21.3 | 本档无 QSL/QFAPI 构件（仓库自述） |
| quilt|1.21.4 | 本档无 QSL/QFAPI 构件（仓库自述） |
| quilt|1.21.8 | 本档无 QSL/QFAPI 构件（仓库自述） |
| quilt|1.21.10 | 本档无 QSL/QFAPI 构件（仓库自述） |
| quilt|1.21.11 | 本档无 QSL/QFAPI 构件（仓库自述） |
| liteloader|1.8.9 | 仅有 LiteLoader 加载器件，无 MC/Forge 侧参照 |
| liteloader|1.10.2 | 仅有 LiteLoader 加载器件，无 MC/Forge 侧参照 |
| liteloader|1.12.2 | 仅有加载器件；MC 侧可借 forge 1.12.2（本机无 1.12.2 映射件） |
| modloader|1.2.5 | 无构件（远古版本，本机无 jar） |
| modloader|1.5.2 | 无构件（远古版本，本机无 jar） |
| modloader|1.6.4 | 无构件（远古版本，本机无 jar） |
| bedrock| | 非 Java 构件，不适用 |

## 3. 总表（3073 行 nowhere）

| verdict | 行数 | 含义 |
| --- | --- | --- |
| PRESENT-MAIN | 966 | 本档合并件里就有 ⇒ **量具盲区**（文档没错） |
| PRESENT-DEPS | 299 | 本档依赖件里有（如 Forge `eventbus` 的 `SubscribeEvent`）⇒ 文档没错 |
| PRESENT-LIB | 560 | 本机库缓存里有 ⇒ 文档没错 |
| ABSENT（可核档） | 846 | 该档构件里查无 ⇒ 需分诊（见 §4/§5） |
| ABSENT（无构件档） | 498 | 本机无该档构件 ⇒ **未核实** |

> ⚠️ **本表是「扫描面修正前」的读数（3073）。** 量具的 `extractCodeFences` 曾整块跳过 ```yaml 围栏，而本仓 `code-patterns/**` 的代码恰恰写在 ```yaml 围栏里（元数据头 + `---` + 代码）⇒ 这些档的代码从未进面。修正后 nowhere = **3232**；本轮再修 §8.3 那批真缺陷后 = **3222**。修正经过、新增行分诊与第二批修复见 **§8**。

**量具盲区的主因**：① **枚举常量/静态字段**——loader 摘要只收类+方法（fields 恒 0），Forge 侧映射库成员是 MCP `func_/field_` 不可读；② **loader 自有类**（`SubscribeEvent`/`DeferredRegister` 在独立 `eventbus` 件里）；③ **库类**（Cloth/REI/JEI 等不在本机）；④ 中文围栏散文被当作代码。

## 4. 真缺陷（本轮已修，共 8 族）

### 4.1 LEGACY_CAVE → LEGACY_CAVE_SETTINGS

- 落点：
  - `forge/1.17.1/code-patterns/04-world-patterns.md:20`
  - `forge/1.18.2/code-patterns/04-world-patterns.md:25`
  - `forge/1.19.4/code-patterns/04-world-patterns.md:32（原 TODO 注释块）`
  - `forge/1.19.4/code-patterns/README.md:60`
  - `forge/1.20.1/code-patterns/04-world-patterns.md:20`
  - `forge/1.20.4/code-patterns/04-world-patterns.md:20`
  - `neoforge/code-patterns/04-world-patterns.md:20`
- 证据：构件 javap：1.16.5–1.20.4 各族构件里 `AmbientMoodSettings` 只有 `CODEC` + `LEGACY_CAVE_SETTINGS`；`LEGACY_CAVE` 零命中
- 处置：改文档 + **就地留出处标记**（改的是受管面 `forge/**`、`neoforge/**`；`.cursor/rules` 改动已按纪律刷 7 面镜像）。

### 4.2 RenderGameOverlayEvent → RenderGuiOverlayEvent

- 落点：
  - `forge/1.19.4|1.20.1|1.20.4 的 `.cursor/rules/09-anti-patterns.mdc`（✅ 正确方案块）`
  - `同三档 `.cursor/rules/08-client-server.mdc`（决策流文案）`
  - `同三档 `knowledge/antipatterns/events.md`（❌ 块 + ✅ 块，并补披露注释）`
- 证据：构件 javap：1.19.4/1.20.1/1.20.4 同包只有 `RenderGuiOverlayEvent`(+`RenderGuiEvent`)，`RenderGameOverlayEvent` 已删；1.17.1 仍在
- 处置：改文档 + **就地留出处标记**（改的是受管面 `forge/**`、`neoforge/**`；`.cursor/rules` 改动已按纪律刷 7 面镜像）。

### 4.3 1.14.4 `code-patterns/04-world-patterns.md` 整套重写

- 落点：
  - `forge/1.14.4/code-patterns/04-world-patterns.md:18-27`
- 证据：构件 javap：1.14.4 `Biome$Builder` 只有 precipitation/category/depth/scale/temperature/downfall/waterColor/waterFogColor/surfaceBuilder/parent；无 `BiomeAmbience`（1.16.5 才出现）、无 skyColor/grassColor/foliageColor、无 ambientSound/specialEffects/generationSettings/mobSettings
- 处置：改文档 + **就地留出处标记**（改的是受管面 `forge/**`、`neoforge/**`；`.cursor/rules` 改动已按纪律刷 7 面镜像）。

### 4.4 1.16.5 `code-patterns/04-world-patterns.md` 按真名改写

- 落点：
  - `forge/1.16.5/code-patterns/04-world-patterns.md:12-28`
- 证据：构件 javap：`with*` 全族不存在；真名 = `biomeCategory` / `specialEffects` / `waterColor` / `waterFogColor` / `fogColor` / `skyColor` / `ambientLoopSound` / `mobSpawnSettings` / `generationSettings`；`AMBIENT_BASALT_DELTAS_LAZY` 无此常量（真名 `…_LOOP/_MOOD/_ADDITIONS`）；1.16.2+ 地表迁到 BiomeGenerationSettings
- 处置：改文档 + **就地留出处标记**（改的是受管面 `forge/**`、`neoforge/**`；`.cursor/rules` 改动已按纪律刷 7 面镜像）。

### 4.5 `Level.ExplosionInteraction.BLOW` → `Explosion.BlockInteraction.BREAK`

- 落点：
  - `forge/1.17.1/code-patterns/03-entity-patterns.md:67`
- 证据：构件 javap：1.17.1 `Level#explode(..., Explosion$BlockInteraction)`；`BlockInteraction` 有 NONE/BREAK/DESTROY，无 `ExplosionInteraction`/`BLOW`
- 处置：改文档 + **就地留出处标记**（改的是受管面 `forge/**`、`neoforge/**`；`.cursor/rules` 改动已按纪律刷 7 面镜像）。

### 4.6 裸 `INNER_ARMOR`/`OUTER_ARMOR` → `ModelLayers.PLAYER_INNER/OUTER_ARMOR`

- 落点：
  - `forge/1.17.1/code-patterns/03-entity-patterns.md:106-107`
  - `forge/1.19.4/code-patterns/03-entity-patterns.md:137-138`
  - `forge/1.20.1/code-patterns/03-entity-patterns.md:105-106`
  - `forge/1.20.4/code-patterns/03-entity-patterns.md:105-106`
- 证据：构件实测：裸常量零命中；1.17.1/1.18.2/1.19.4/1.20.x 均有 `PLAYER_INNER_ARMOR`/`PLAYER_OUTER_ARMOR`（neoforge 档早已写明此点）
- 处置：改文档 + **就地留出处标记**（改的是受管面 `forge/**`、`neoforge/**`；`.cursor/rules` 改动已按纪律刷 7 面镜像）。

### 4.7 `getAttributeMap()/getAttributeManager().registerAttribute(...)` → `createAttributes()` 形态

- 落点：
  - `forge/1.16.5/code-patterns/03-entity-patterns.md:106,113-115`
  - `forge/1.17.1/code-patterns/03-entity-patterns.md:131-133`
  - `forge/1.19.4/code-patterns/03-entity-patterns.md:181（散文）`
  - `forge/1.20.1/code-patterns/03-entity-patterns.md:132`
  - `forge/1.20.4/code-patterns/03-entity-patterns.md:132`
- 证据：构件实测：`registerAttribute` 零命中、`getAttributeMap`/`getAttributeManager` 零命中；真名 `getAttributes()`；1.16.5 走 `AttributeModifierMap.MutableAttribute` + `MonsterEntity.createMonsterAttributes()`，1.17.1+ 走 `AttributeSupplier.Builder` + `Mob.createMobAttributes()`
- 处置：改文档 + **就地留出处标记**（改的是受管面 `forge/**`、`neoforge/**`；`.cursor/rules` 改动已按纪律刷 7 面镜像）。

### 4.8 `getReachingSide` → `getReceptionSide`

- 落点：
  - `forge/1.16.5/knowledge/antipatterns/networking.md:81`
  - `forge/1.17.1/knowledge/antipatterns/networking.md:81`
  - `forge/1.19.4/knowledge/antipatterns/networking.md:81`
  - `forge/1.20.1/knowledge/antipatterns/networking.md:81`
- 证据：构件实测：`getReachingSide` 零命中、`getReceptionSide` 各档 4 处
- 处置：改文档 + **就地留出处标记**（改的是受管面 `forge/**`、`neoforge/**`；`.cursor/rules` 改动已按纪律刷 7 面镜像）。


## 5. 查无但仍需人审（分诊，未改文档）

自建名/处理器名等**本来就不该有出处**的占绝大多数；下表按机器启发式分诊，**不是结论**。

| 类别 | 行数 | 唯一名 | 说明 |
| --- | --- | --- | --- |
| 模板自建名（`Mod*`/`My*`/`IMy*`/`some*`…） | 130 | 17 | 读者自己的类/字段名，文档是模板 |
| 自建方法名（`on*`/`register*`/`modify*`…） | 166 | 36 | 事件处理器/回调名，由读者命名 |
| **反例/披露提及**（`❌`/`不是`/`旧名`…） | 14 | 4 | 文档把错名当反面例子写（如 1.13.2「字段是 MISC 不是 TAB_MISC」）⇒ 文档正确 |
| 版本迁移文档（`version-changes/`） | 9 | 4 | 讲的是**别的版本**的 API，却按宿主档构件核 ⇒ 需拿被述版本的构件再核 |
| 跨加载器对照文档里的**他加载器**名 | 54 | 16 | 如 fabric 档 `porting/*` 里写 Forge 的 `ForgeRegistries`/`SimpleChannel` |
| Gradle 构建脚本 API | 24 | 4 | 非 MC API，构件自然查无 |
| 第三方库 API（本机无该库构件） | 248 | 48 | Cloth/REI/JEI/GeckoLib 等未入库 ⇒ **未核实** |
| 已修（见 §4，此处为修复前扫描残留） | 40 | 17 | LEGACY_CAVE / RenderGameOverlayEvent / withEffects / withFogColor / withSkyColor / withGenerationSettings / withMobSpawnSettings / AMBIENT_BASALT_DELTAS_LAZY / AmbientManager / getReachingSide / getAttributeMap / getAttributeManager / INNER_ARMOR / OUTER_ARMOR / BLOW / AmbientSoundEvents / setShouldWatch |
| **其余待审** | 161 | 39 | 见下表 |

### 5.1 待审清单（按出现次数降序）

| 次数 | 平台\|名 | 首次出现位置 |
| --- | --- | --- |
| 18 | `forge|scheduleProcessing` | `forge/1.13.2/.cursor/rules/09-anti-patterns.mdc:156` |
| 17 | `forge|OTHER_ITEM` | `forge/1.14.4/.cursor/skills/mc-datagen/SKILL.md:83` |
| 14 | `forge|someData` | `forge/1.14.4/.cursor/rules/09-anti-patterns.mdc:308` |
| 9 | `forge|SPECIAL_BLOCK` | `forge/1.14.4/.cursor/rules/07-datagen.mdc:239` |
| 9 | `forge|SPECIAL_DROP` | `forge/1.14.4/.cursor/rules/07-datagen.mdc:242` |
| 8 | `forge|attachToPlayer` | `forge/1.14.4/.cursor/skills/mc-capability/SKILL.md:52` |
| 8 | `fabric|blockInventory` | `fabric/1.17.1/.cursor/rules/10-gui.mdc:91` |
| 7 | `forge|slotStack` | `forge/1.14.4/.cursor/skills/mc-gui/SKILL.md:76` |
| 7 | `forge|clientOnlyMethod` | `forge/1.14.4/.cursor/rules/08-client-server.mdc:269` |
| 7 | `forge|serverInit` | `forge/1.15.2/.cursor/rules/10-gui.mdc:26` |
| 5 | `forge|DATA_ID` | `forge/1.17.1/.cursor/skills/mc-entity/SKILL.md:62` |
| 5 | `forge|LAYER_LOCATION` | `forge/1.17.1/.cursor/skills/mc-entity/SKILL.md:93` |
| 4 | `forge|attackDamageIn` | `forge/1.14.4/.cursor/rules/03-item.mdc:87` |
| 4 | `forge|AIR_BLOCK` | `forge/1.19.4/.cursor/rules/07-datagen.mdc:257` |
| 3 | `forge|attackSpeedIn` | `forge/1.14.4/code-patterns/02-item-patterns.md:147` |
| 3 | `forge|REQ_ID` | `forge/1.17.1/.cursor/rules/06-networking.mdc:278` |
| 3 | `forge|blockLookupProvider` | `forge/1.19.4/.cursor/skills/mc-datagen/SKILL.md:204` |
| 3 | `forge|NetworkHandler` | `forge/1.20.4/.cursor/rules/05-events.mdc:188` |
| 2 | `forge|clientMethod` | `forge/1.13.2/.cursor/rules/08-client-server.mdc:146` |
| 2 | `forge|DataGen` | `forge/1.14.4/.cursor/skills/mc-recipe/SKILL.md:15` |
| 2 | `forge|PROCESSED_DIAMOND` | `forge/1.14.4/.cursor/skills/mc-recipe/SKILL.md:133` |
| 2 | `forge|transferHandler` | `forge/1.15.2/.cursor/rules/10-gui.mdc:72` |
| 2 | `forge|WALK` | `forge/1.20.1/.cursor/skills/mc-entity/SKILL.md:162` |
| 2 | `fabric|Mojmap` | `fabric/1.21.11/.cursor/rules/02-block.mdc:28` |
| 1 | `forge|damageReduction` | `forge/1.13.2/.cursor/skills/mc-item/SKILL.md:103` |
| 1 | `forge|interactionObject` | `forge/1.13.2/.cursor/rules/10-gui.mdc:34` |
| 1 | `forge|dataSlots` | `forge/1.14.4/.cursor/skills/mc-gui/SKILL.md:46` |
| 1 | `forge|worldClient` | `forge/1.14.4/.cursor/skills/mc-sound/SKILL.md:113` |
| 1 | `forge|attachToTile` | `forge/1.14.4/.cursor/skills/mc-capability/SKILL.md:69` |
| 1 | `forge|dedicatedInit` | `forge/1.14.4/.cursor/rules/10-gui.mdc:25` |
| 1 | `forge|mobSpawn` | `forge/1.16.5/code-patterns/04-world-patterns.md:27` |
| 1 | `forge|serverMethod` | `forge/1.17.1/.cursor/skills/mc-events/SKILL.md:100` |
| 1 | `forge|MACHINE_BLOCK` | `forge/1.19.4/code-patterns/01-block-patterns.md:105` |
| 1 | `neoforge|NetworkHandler` | `neoforge/knowledge/antipatterns/events.md:89` |
| 1 | `neoforge|someData` | `neoforge/knowledge/antipatterns/events.md:125` |
| 1 | `neoforge|scheduleProcessing` | `neoforge/knowledge/antipatterns/events.md:60` |
| 1 | `fabric|README_AI` | `fabric/1.20.4/.cursor/rules/00-project-setup.mdc:71` |
| 1 | `fabric|loveTimer` | `fabric/1.21.1/code-patterns/03-entity-patterns.md:97` |
| 1 | `fabric|DataGen` | `fabric/1.21.11/.cursor/rules/01-registry.mdc:63` |

## 6. 复现

| 脚本 | 用途 |
| --- | --- |
| `F:\MOD_TEST\nonfabric-skill-names.mjs` | 候选发现器（扫面/腿/桶），输出 `nonfabric-scan/` |
| `F:\MOD_TEST\artifact-map2.mjs` | 生成真构件集（主件 + 依赖件）→ `artifact-map2.json` |
| `F:\MOD_TEST\verify-names3.mjs` | 逐名过构件（常量池匹配 + 库池复试）→ `verify3.json/.tsv` |
| `F:\MOD_TEST\apply-fixes.mjs` / `apply-fixes2.mjs` | 本轮修文档的可审脚本（dry-run 默认，`APPLY=1` 才写盘） |
| `F:\MOD_TEST\verify-all.mjs` | 全局核验（按 jar 聚合所需名字 ⇒ 每件只读一遍）；输入 `merged.tsv` ∪ `merged-cross.tsv` |
| `F:\MOD_TEST\verify-extra.mjs` | 「无构件档」补核；支持**源码 jar 按词切**；输入同前 → `verify-extra.json` |
| `F:\MOD_TEST\scan-jars.mjs` | 横扫 12 个根的 jar，找「无构件档」的可用件 |
| `F:\MOD_TEST\verify-mc.mjs` | **MC 侧**核验：解析 classfile 的 `fields[]` / `methods[]` 声明表（比常量池串匹配强）→ `verify-mc.json` |
| `F:\MOD_TEST\probe-mc.mjs` | 定向探针：给定名字问「哪个类声明了它」（解析器先验后信用） |
| `F:\MOD_TEST\resid.mjs` | 残余 ABSENT 分诊（读 `verify-extra.json`） |
| `F:\MC_GAME\_oracle-jars\mc\minecraft-{1.14.4-yarn-build.18,1.16.5-yarn-build.10}.jar` | fabric 两档的 **Yarn 具名** MC 件（§8.10 用） |
| `F:\MOD_TEST\nonfabric-skill-names.mjs` | **已改**：`srcDirs()` 增 `.cursor/agent/**` 与档根 `CLAUDE.md`；新增 `libs` 伪档（`knowledge/libs/**`，腿 = 全平台并集）——见 §8.12(2) |
| `F:\MOD_TEST\extract.mjs` | 从 `merged*.tsv` 抽某个平台的行（带上下文） |
| `F:\MOD_TEST\cover.mjs` / `split.mjs` / `dump-pending.mjs` / `surfaces.mjs` | 覆盖账 / 分桶 / 待审导出 / 未扫面计数（§8.11） |
| `F:\MC_GAME\_oracle-jars\fabric-api\` | 5 个 fabric-api jar（1.21.3 / .4 / .8 / .10 / .11）+ `quilt-loader-0.31.0-beta.4.jar`（§8.12 用） |
| `F:\MOD_TEST\verify-strict.mjs`（+ `mk-strict.mjs` 生成器） | **严格版核验器**：构件只准为「同加载器 + 同 MC 版本」作证 —— §8.14 起以此为准 |
| `F:\MOD_TEST\depsaudit2.mjs` / `strict-diff.mjs` / `dump-drops.mjs` | 正面证据的版本/平台体检、宽松↔严格差异、摘下的行 |
| `F:\MOD_TEST\verify-strict.json` / `strict-drops.json` | 严格版逐行判决 / 被摘下的 265 行明细 |
| `F:\MOD_TEST\recheck150.mjs` | 三档（1.14.4/1.15.2/1.16.5）strict-ABSENT 的**完整件**重核：逐版本扫全部同版本构件（class 常量池 + 类条目 + 源码 jar 原文）—— §8.15 |
| `F:\MOD_TEST\ls-pkg.mjs` / `forge-surface.mjs` / `nf-surface.mjs` / `find-class.mjs` | 包清单 / `net/minecraftforge` 包分布 / 任意包面计数 / 类名正则扫（§8.15 构件结构取证） |
| `F:\MOD_TEST\adj-verify.mjs` / `adj-verify2.mjs` / `adj-disk.mjs` / `adj-counts.mjs` / `a25-exact.mjs` / `aprime.mjs` / `javap-class.mjs` | 外部审计 A1–A28 的独立复核（构件声明表 / 盘面 / 计数 / 精确类名 / 宿主类×成员）—— §8.16 |
| `F:\MOD_TEST\extract-v2.mjs` | 抽取面原型：把「行内 code / frontmatter」两面也抽出来，量「量具盲区新增候选」—— §8.16(2) |
| `G:\graalvm-jdk-21_windows-x64_bin\graalvm-jdk-21.0.12+7.1\bin\javap.exe` | 字节码级复核（§8.16 的 A7 `constructMod` 判据；PATH 上的 java 是 Java 8，须写全路径） |

不变量（本轮实测）：① 量具行凡来自整行注释者 = **0**；② 各包 JSON 求和 = 总表（扫描面扩到 `code-patterns/knowledge/AGENTS/scaffold` 后 nowhere = 3073）；③ 修复后非镜像面内旧名零残留（仅剩披露注释与「该版本确实存在」的用法）。

## 7. 后续

- 量具的腿可补：**字段名腿**（loader 摘要无字段）、**库件腿**（Cloth/REI/JEI 未入库）。
- 未覆盖档：forge ≤1.12.2、quilt 全族、liteloader、modloader、bedrock、fabric 1.14.4/1.16.5 —— 需要构件才能核。
- §5.1 待审清单里若出现**确属本档 API 却无此名**的，按 §4 的方式改文档 + 留标记。

---

## 8. 第二批（2026-10-13 · 扫描面修正后）

### 8.1 量具的 yaml 盲区（本轮发现并修复）

上一批（§1–§7）把扫描面扩到了 `code-patterns/**`，但量具的 `extractCodeFences` 有一条 `if (NONJVM.test(lang)) continue;`，把 ```yaml 围栏**整块跳过**。本仓 `code-patterns/**` 的约定恰恰是：```yaml 围栏 = 模式元数据头 + 单独一行 `---` + **代码**。⇒ 凡把代码写进 yaml 围栏的档（实测 86 个 `.md` 带 yaml 围栏；`forge/1.13.2/code-patterns/**` 5 个文件全部如此）的代码**从未进过面**。

修法：`extractCodeFences` 对 `ya?ml` 围栏取 `---` 之后的片段当代码扫（`F:\MOD_TEST\nonfabric-skill-names.mjs`，NONJVM 分支）。重跑后 nowhere 由 **3073 → 3232**（+159 行；yaml 围栏带来的新候选）。

### 8.2 新增行的分诊（逐类）

- **真缺陷（已修，见 §8.3）**：`forge/1.13.2/code-patterns/{01,04}`；`forge/1.18.2/code-patterns/03`；`fabric/{1.16.5,1.18.2,1.20.1}/code-patterns/01`。
- **构件里其实存在（量具盲区，不改）**：`forge/1.13.2` 的 `EntityAINearestAttackableTarget` / `initEntityAI` / `targetTasks`（1.13.2 构件实测**都在**；Goal 改写是 1.14 才发生 —— 一度被我误判为缺陷）；fabric 档的 `writeNbt`/`readNbt`/`initGoals`/`mobTick`/`setDimensions`/`maxTrackingRange`/`getActiveHand`/`addStatusEffect`/`breakInstantly`/`copyOf`/`wasPressed`/`addDrawableChild` 等（Yarn 实名）；`EntityRendererRegistry`/`EntityAttributeModification`/`LootTableLoadingCallback`/`FabricRecipesProvider`/`TagRegistry`/`withEntry`（Fabric API，不在 Yarn 映射）；`GLFW`（LWJGL）。
- **读者自建名/参数名/处理器名（本就不该有出处）**：`onOreGen`/`onBlocksRegistry`/`onEntitiesRegistry`/`onRender`/`onTick`/`hasJumpDisabledEffect`/`packetByteBuf`/`responseSender`/`nextDiscriminator` 等。

### 8.3 第二批真缺陷（本轮已修，构件 javap 逐名取证）

| 落点 | 原（构件查无） | 改为 | 证据 |
| --- | --- | --- | --- |
| `forge/1.18.2/code-patterns/03-entity-patterns.md:71` | `Level.ExplosionInteraction.BLOW` | `Explosion.BlockInteraction.BREAK` | 1.18.2 主件只有 `Explosion$BlockInteraction`；`Level$ExplosionInteraction` 自 **1.19.4** 起才出现在主件里 |
| `forge/1.13.2/code-patterns/01-block-patterns.md`（TileEntity 模式） | `implements ITileEntityProvider` + `createNewTileEntity(IBlockReader)` | `IForgeBlock#hasTileEntity(IBlockState)` / `createTileEntity(IBlockState, IBlockReader)` | 1.13.2 主件**无** `ITileEntityProvider`；`IForgeBlock` 有这两个 default 方法 |
| 同上 | `TileEntityTypeRegistry.MY_TILE_ENTITY.get()` | `TileEntityType.Builder.create(MyTileEntity::new).build(null)` + `RegistryEvent.Register<TileEntityType<?>>` | 主件无 `TileEntityTypeRegistry`、无 `DeferredRegister`；`TileEntityType$Builder.create(Supplier)` / `build(Type)` 实名 |
| 同上 | `implements ITickable` + `void update()` | `void tick()` | `net.minecraft.util.ITickable` 在；其唯一方法名是 `tick()` |
| 同上 | `writeToNBT` / `readFromNBT` + `setInteger` / `getInteger` | `write(NBTTagCompound)` / `read(NBTTagCompound)` + `setInt` / `getInt` | `TileEntity` 实名 `read`/`write`；`NBTTagCompound` 实名 `setInt`/`getInt`（无 `setInteger`） |
| `forge/1.13.2/code-patterns/04-world-patterns.md`（Ore Generation 模式） | `MinecraftForge.ORE_GEN_BUS` + `WorldEvent.GenerateSpawn` | 改指点 `Biome#addFeature(GenerationStage.Decoration, CompositeFeature)` | 主件无 `ORE_GEN_BUS`；`WorldEvent` 子类只有 Load/Save/Unload/PotentialSpawns/CreateSpawnPosition；`Biome#addFeature` / `Biome.createCompositeFeature` 在 |
| `forge/1.13.2/code-patterns/04-world-patterns.md`（Custom Biome 模式） | `new Biome.Builder()` + `withDefaultTemperature()` + `withTemperatureBiome()` + `surfaceBuilder(new SurfaceBuilder(...), new SurfaceConfig(...))` + `.build()` | `new Biome.BiomeBuilder()`；删去两个 `with*`；`surfaceBuilder(new CompositeSurfaceBuilder<>(new DefaultSurfaceBuilder(), new SurfaceBuilderConfig(...)))` | `Biome$BiomeBuilder` 实名（无 `Biome$Builder`）；构建器方法全表已核；主件无 `SurfaceBuilder`/`SurfaceConfig` 类 |
| `fabric/{1.16.5,1.18.2,1.20.1}/code-patterns/01-block-patterns.md` | `BlockSoundGroups.GRASS` | `BlockSoundGroup.GRASS` | fabric 1.17.1 / 1.20.1 loom 合并件只有 `net/minecraft/sound/BlockSoundGroup`；常量 `GRASS` 实名 |

> 本批修复处一律**就地留 `// 1.13.2 / 1.18.2 构件 javap：…` 出处标记**；改的都是 `code-patterns/**`（非镜像面，无需刷镜像）。

### 8.4 尚未处理的缺口（诚实记账，未静默）

1. **`crossPack` 降档面从未被逐行审过**：`merged-cross.tsv` 现有 944 TYPE + 1059 MEMBER 行。「某名在同平台**别的版本**存在」正是版本错配最可能藏身处 —— 1.18.2 的 `Level.ExplosionInteraction.BLOW` 就因为「1.19.4 有」被 B 腿降成 crossPack，从而**没进 nowhere 清单**。本批唯一靠人工复查补上；系统性审 crossPack 面本轮未做。
2. **yaml 修正后新进面的行，构件核验只对「已判断可疑的」逐一做了 javap**（§8.2/§8.3），没有像上一批那样跑全量对照（`verify-names3.mjs`）。⇒ §8 未覆盖的新行里若还有真错，属**未核实**。
3. **`forge/1.13.2` 的 Feature / Placement 配置类名未取证**（已就地在 Ore Generation 模式留 `// TODO(未核实)`）。

### 8.5 复现（本批）

| 脚本 | 变更 |
| --- | --- |
| `F:\MOD_TEST\nonfabric-skill-names.mjs` | **已改**：`extractCodeFences` 增 yaml 围栏取 `---` 后片段 |
| `F:\MOD_TEST\sweep-check2.mjs` / `sweep-check3.mjs` | 全仓旧名残留扫描（按文件聚合） |
| `F:\MOD_TEST\probe-expl.mjs` | 逐 forge 件列 `ExplosionInteraction` / `Surface*` 条目 |
| `F:\MOD_TEST\scan-yaml.mjs` | 列各档带 yaml 围栏的文件 |

### 8.6 crossPack 降档面系统审（本轮，对应 §8.4 缺口 1）

- **方法**：把 `merged-cross.tsv`（2003 行）与 nowhere 合并成一份，交给 `F:\MOD_TEST\verify-all.mjs` 逐名过真构件（与 nowhere 同一批：**按 jar 聚合所需名字，每件只读一遍**，缓存记 `queried` 全集）。
- **读数**：crossPack 2003 行 → `PRESENT-MAIN 981` / `PRESENT-DEPS 504` / `PRESENT-LIB 179` / **`ABSENT 339`**。其中 `ABSENT` 只有 **97 行落在可核档**（88 个文件），另 242 行落在无构件档（quilt / liteloader / modloader / bedrock / fabric 1.14.4·1.16.5 / forge ≤1.12.2）⇒ **未核实**。
- **分诊那 97 行**：真缺陷 **16 处 / 14 个文件**（见 §8.7）；其余为读者自建名（`ModBlocks`/`ModBlockEntities`/`sendToAll`/`commonSetup`/`onCommonSetup`/`onClientTick`…）、参数名（`translationBuilder`/`entityYaw`/`fromPos`）、SRG/混入名（`field_70725_aQ`/`func_110143_aJ` —— 混入的 `@Shadow` 用 SRG 名是**对的**，读名件里查不到属正常）、1.12 负例块（`toBytes`/`fromBytes`/`MessageContext`/`getServerHandler`）、构建脚本/DK 名（`sourceSets`/`modApi`/`accessWidenerPath`/`archivesName`/`groupId`）、第三方库名（`LoggerFactory`/`SuppressWarnings`/`MAX_VALUE`）与 version-changes 文档（讲别的版本）。
- **这条腿的价值**：`forge/1.18.2/code-patterns/03` 的 `Level.ExplosionInteraction` 正是被 B 腿（同平台并集）降成 crossPack 才没进 nowhere 清单的 —— 单审 nowhere **必漏**这一类。
- **同批顺带**：nowhere 3222 行也重跑了一遍全量构件对照，四态 = `PRESENT-MAIN 1086` / `PRESENT-DEPS 309` / `PRESENT-LIB 560` / `ABSENT 1267`（其中可核 838 / 无构件 429）。

### 8.7 第三批真缺陷（crossPack 审出，已修，构件 javap 逐名取证）

| 落点 | 原（本档构件查无） | 改为 | 证据 |
| --- | --- | --- | --- |
| `forge/1.13.2/code-patterns/03-entity-patterns.md` | `EntityRendererManager` | `RenderManager` | 1.13.2 主件有 `client/renderer/entity/RenderManager.class`，无 `EntityRendererManager` |
| `forge/1.14.4/code-patterns/01-block-patterns.md` | `NBTTagCompound` | `CompoundNBT` | 1.14.4 主件有 `nbt/CompoundNBT.class`，无 `NBTTagCompound` |
| `forge/1.15.2/code-patterns/01-block-patterns.md`（read/write 各一） | `NBTTagCompound` | `CompoundNBT` | 1.15.2 主件同形（`CompoundNBT`） |
| `forge/1.15.2/knowledge/antipatterns/entity.md` | `readFromNBT(NBTTagCompound)` | `read(CompoundNBT)` | 同上；`TileEntity` 实名 `read`/`write` |
| `forge/1.14.4/knowledge/antipatterns/networking.md` | `NBTTagCompound` | `CompoundNBT` + 就地 ⚠️ 标「本块是 1.12 形态（`toBytes/fromBytes`）待改写」 | 同上 |
| `forge/1.15.2/.cursor/skills/mc-gui/SKILL.md` | `IInteractionObject` | `INamedContainerProvider` | 1.14.4 主件有 `inventory/container/INamedContainerProvider.class`，无 `IInteractionObject` |
| `forge/1.14.4/code-patterns/04-world-patterns.md` | `Blocks.*.defaultBlockState()` | `Blocks.*.getDefaultState()` | 1.14.4 `Block` 有 `getDefaultState()`，无 `defaultBlockState` |
| `forge/1.20.1` / `forge/1.20.4` `.cursor/skills/mc-entity/SKILL.md` | `ModelRenderer` | `ModelPart` | 1.20.1 主件有 `client/model/geom/ModelPart.class`，无 `ModelRenderer` |
| `forge/1.20.4/.cursor/skills/mc-gui/SKILL.md` | `NetworkHooks.openScreen(...)` | `serverPlayer.openMenu(p)` | `NetworkHooks` 在 **1.20.1 主件在、1.20.4 主件已无**；`ServerPlayer#openMenu(MenuProvider)` 在 |
| `forge/1.16.5/.cursor/skills/mc-sound/SKILL.md` | `SoundEvents.BLOCK_STONE_{BREAK,STEP,PLACE,HIT,FALL}` | `SoundEvents.STONE_{BREAK,STEP,PLACE,HIT,FALL}` | 1.16.5 `SoundEvents` 只有 `STONE_*` |
| `forge/1.19.4` / `1.20.1` / `1.20.4` `.cursor/skills/mc-fluid/SKILL.md` | `.noDrops()` | `.noLootTable()` | 1.19.4 `BlockBehaviour$Properties` 有 `noLootTable()`，无 `noDrops` |
| `forge/1.18.2/.cursor/rules/{05-events,08-client-server}.mdc` | `RegisterKeyMappingsEvent` + `event.register(...)` | `ClientRegistry.registerKeyBinding(...)`（放进 `FMLClientSetupEvent`） | 1.18.2 主件**无** `RegisterKeyMappingsEvent`；`net.minecraftforge.client.ClientRegistry#registerKeyBinding(KeyMapping)` 在 |

> 本批修复处一律**就地留 `// 1.x 构件 javap：…` 出处标记**；`.cursor/**` 改动已按纪律对 **forge 1.15.2 / 1.16.5 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4** 六档重刷 7 面镜像（`scripts/sync-skills.ps1 -TargetDir <档>`），`assert-skill-mirrors` = `ok`（57 档 / 12418 目标 / 漂移 0 / 孤儿 0）。

### 8.8 仍留「未核实」（⚠️ 其中 4 项已由 §8.9 处置；下表为当时状态）

| 项 | 为什么没改 |
| --- | --- |
| `forge/1.13.2/.cursor/skills/{mc-item,mc-recipe,mc-particle}` 的 `knockbackResistance` / `getKnockbackResistance` / `IRecipeType` / `onUpdate` / `particleMaxAge` | 构件已证**本档查无**（1.13.2 无 `IRecipeType`、`Item` 无 `getKnockbackResistance`、`Particle` 只有 `tick()`），但**正确替换形**（1.13.2 的配方类型体系 / 粒子字段实名）本档尚未逐一取证 ⇒ 留待下一轮，不拿 1.16 名顶替 |
| `forge/1.16.5/.cursor/skills/mc-gui/SKILL.md` 的 `BACKGROUND_TEXTURE` | 1.16.5 `Screen`（含 `-p`）无任何 `*Location` 常量 ⇒ 更像读者自建常量，但文档未声明它 ⇒ 归类存疑，未动 |
| `forge/1.16.5`、`forge/1.17.1` 的 `knowledge/porting/*` 的 `builtInRegistryHolder` | porting 文档讲的是**目标版本**的 API，按宿主档构件核会假红（= 台账 §5「版本迁移文档」那类的近亲） |
| `fabric/1.17.1/code-patterns/03` 的 `EntityAttributeModification`、`fabric/1.21.1/code-patterns/02` 的 `getKnockbackResistance` | 构件实测**连 Fabric API 依赖件里都没有** ⇒ 可疑，但正确形态未定 |
| crossPack `ABSENT` 中落在无构件档的 242 行 | 本机无该档构件 ⇒ **未核实** |

**修完后重跑**（`node F:\MOD_TEST\nonfabric-skill-names.mjs`）：nowhere = **3222**（TYPE 1238 + MEMBER 1984）；crossPack = **1984**（TYPE 935 + MEMBER 1049）——crossPack 比 §8.6 那次 **2003 少 19 行**（修掉的名字不再被 B 腿降档）。

### 8.9 第三批续（用户点名）—— ①「无构件档」复核 ② §8.8 四项处置

#### (1) 「本机无构件」这句是错的（更正 §2 下半张表）

用 `F:\MOD_TEST\scan-jars.mjs` 横扫 12 个根（`D:\mc-skill-temp`、`F:\MC_GAME`、`F:\MOD_TEST`、`F:\finish_MCMODS`、`D:\Minecraft`、`C:\Users\zzrCN\.gradle\caches\{minecraft,quilt-loom,modules-2}` 等），共约 3.6 万个 jar。**原判「无构件」的档里，以下其实有可用件**：

| 档 | 找到的件（本机路径） | 能核什么 / 不能核什么 |
| --- | --- | --- |
| forge 1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2 / 1.12.2 | `D:\mc-skill-temp\forge-<v>-universal.jar`（6 档）；1.12.2 另有 `…\caches\minecraft\…\forgeBin-1.12.2-14.23.5.2847.jar` 与 `loader-jars\1.12.2-forge.jar` | Forge 类名（SRG 可读类名）。**MC 侧类与 MCP 成员名仍不可核** |
| fabric 1.14.4 / 1.16.5 | `D:\mc-skill-temp\loader-jars\{1.14.4,1.16.5}-fabric-api.jar` + `-fabric.jar`（**源码件，内容是 `.java`**） | Fabric API / loader 名。**MC 侧仍不可核** |
| quilt 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 / 1.21.1 | `F:\MC_GAME\_oracle-jars\qsl\{qsl_base,registry,lifecycle_events}-<ver>.jar` | QSL API 名 |
| liteloader 1.8.9 / 1.10.2 / 1.12.2 | `_oracle-jars\liteloader\liteloader-{1.8.9,1.10.2}.jar`、`…modules-2\…\liteloader-1.12.2-SNAPSHOT.jar` | LiteLoader API 名 |
| modloader 1.2.5 / 1.5.2 / 1.6.x | `_oracle-jars\modloader\ex-{1.2.5,1.5.2,1.6.2}\`（反编译类转储）+ `ModLoader-*.zip` | ModLoader 类名。**1.6.4 只有最近的 1.6.2 转储可用** |
| bedrock | `_oracle-jars\bedrock\{package,beta-pkg}\index.d.ts` + server tgz | Script API 名（**不是 jar**，走 `.d.ts` 类型声明） |

**仍然没有**：fabric 1.14.4 / 1.16.5 的 **MC merged 件**、quilt 1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11 的 QSL 件、modloader 精确 1.6.4、E: 盘（本轮未挂载）。

#### (2) 补核读数（`F:\MOD_TEST\verify-extra.mjs`；newly 支持「源码 jar 按词切」）

| 档 | 待核行 | 新件里**存在** | 仍查无 | 其中唯一名 |
| --- | --- | --- | --- | --- |
| fabric 1.14.4 | 276 | **113** | 163 | 110 |
| fabric 1.16.5 | 328 | **145** | 183 | 117 |
| forge 1.12.2 | 167 | **122** | 45 | 40 |
| liteloader 1.12.2 | 4 | **4** | 0 | 0 |
| **合计** | **775** | **384（50%）** | **391** | 267 |

⇒ §8.8 末行「无构件档 242 行」的档里，**至少 384 行现在核得了**（例如 fabric 1.14.4/1.16.5 的 Fabric API 名、forge 1.12.2 的 Forge 类名）。余 391 行要**该档 MC 侧件**才核得了，本机确无。逐名清单：`F:\MOD_TEST\verify-extra.json`。

**一个反直觉读数（写在这里免得下轮重复找）**：有 QSL 件的 quilt 5 档（1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 / 1.21.1）在当前扫描里 **0 条 nowhere/cross 行**（全被语料腿与映射腿吸收）；而有行的 quilt 5 档（1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11）**恰好没有 QSL 件**。两个集合互补 ⇒ **QSL 新件不改变任何现有行的判定**。它的价值是纠正「本机无构件」这个说法本身，不是解锁新修复。

#### (3) §8.8 四项处置（逐项给取证结论）

| 原项 | 取证结论 | 处置 |
| --- | --- | --- |
| `forge/1.13.2/.cursor/skills/mc-item` 的 `getKnockbackResistance` | 1.13.2 `IArmorMaterial` 只有 `getDurability` / `getDamageReductionAmount` / `getEnchantability` / `getSoundEvent` / **`getRepairMaterial`** / `getName` / `getToughness` ⇒ 确无 `getKnockbackResistance`，且文档**漏了必需的 `getRepairMaterial`** | **已改**：删该字段 / 构造参数 / override；补 `getRepairMaterial()`（`Ingredient.fromItems` 形态已核） |
| `forge/1.13.2/.cursor/skills/mc-recipe` 的 `IRecipeType` / `getType()` | 1.13.2 `IRecipe` **没有 `getType()`**（`IRecipeType` 是 1.14 起的体系） | **已改**：删该 override 与 `ModRecipes.MY_TYPE`，就地留说明 |
| `forge/1.13.2/.cursor/skills/mc-particle` 的 `onUpdate()` / `particleMaxAge` | 1.13.2 `Particle` 字段是 `age` / `maxAge`（有 `setMaxAge` / `getMaxAge`），方法是 **`tick()`**（`onUpdate` 是 1.12 名） | **已改**：`setMaxAge(40)` + `tick()` |
| `forge/1.16.5/.cursor/skills/mc-gui` 的 `BACKGROUND_TEXTURE` | 1.16.5 `AbstractGui` 有 **`public static final ResourceLocation BACKGROUND_LOCATION`** ⇒ 原来是**常量写错名**，不是读者自建常量 | **已改**：`AbstractGui.BACKGROUND_LOCATION` |
| `fabric/1.17.1/code-patterns/03` 的 `EntityAttributeModification` | 本档全部 FAPI 依赖件查无；本档正确入口是 `FabricDefaultAttributeRegistry`（已在 object-builder 件中核到该类） | **已改**：注释掉伪 API，指向 `FabricDefaultAttributeRegistry#register`，签名留 `TODO(未核实)` |
| `fabric/1.21.1/code-patterns/02` 的 `getKnockbackResistance` | 1.21.1 `ArmorMaterial` 是 **record**（不是接口，不能 `implements`）；实名 `toughness()` / `knockbackResistance()` / `enchantability()` / `equipSound()` / `repairIngredient()`，**也没有 `getName` / `getDurability`** ⇒ 整块是旧版形态 | **加 ⚠️ 就地说明**（record 形态 + 逐名对照）；整块按 record 改写留 `TODO(未核实)`（`RegistryEntry<SoundEvent>` 与 `ArmorMaterial.Layer` 的构造形态未取证，不拿猜的写） |
| porting 文档的 `builtInRegistryHolder` | 讲的是**目标版本** API，按宿主档构件核必假红 | **不改**（登记为假红类，与 §5「版本迁移文档」同类） |

> 已改的三件 `.cursor/skills`（`forge/1.13.2` 两件、`forge/1.16.5` 一件）按纪律重刷 7 面镜像。

#### (4) 残余 391 行的分诊（结论：**未再发现真缺陷**）

`verify-extra.json` 的 267 个唯一查无名，逐名归入四类，**没有一条需要改文档**：

| 类 | 例 | 为什么不算缺陷 |
| --- | --- | --- |
| **库类**（本机无该库件） | `ConfigSerializable`/`ConfigCategory`/`ClothConfigBuilder`/`BoolOption`（Cloth Config）、`REIPluginClient`/`AutoStorageAware`（REI）、`JEIPlugin`/`IModPlugin`/`IModRegistry`（JEI） | 库不在本机 ⇒ 核不了，**登记为盲区**（与 §2「量具盲区主因③」同源） |
| **读者自定义标识符** | `myItem`/`myBlock`/`tileInv`/`playerInv`/`blockInventory`/`modApi`/`packetId`/`syncData`/`sendToolBreakStatus`/`registerMessages`/`registerServerReceivers`/`initClientOnly` | 是示例里作者自己起的名字，**本就不该在构件里** |
| **Vanilla MC 名**（该档无 MC 侧件） | `getPlacementState`/`getDefaultState`/`setBlockState`/`getActiveHand`/`isSneaking`/`getStill`/`getFlowing`/`ofItems`/`ofSize`/`saturationModifier`/`alwaysEdible`/`renderBackground` | fabric 档只拿得到 **Fabric API/loader 源码件**，MC 侧确无 ⇒ **未核实**，不是缺陷 |
| **就地否定/对照例**（量具的 `negBlock` 只认块级否定，行内否定抓不到） | `forge/1.12.2` 的 `IItemTier` 全部出现在「**不要** implements `IItemTier`（1.14+）」；`fabric/1.16.5` 的 `MixinLauncher` 出现在「**不要**手写 MixinBootstrap / MixinLauncher」；`fabric/1.14.4` 的 `ScreenEvents` 出现在「1.14.4 索引里**没有** `ScreenEvents.AFTER_INIT`」；`EntityClassification` 出现在 `knowledge/porting/forge-to-fabric.md` 的 **Forge 侧**对照行 | 文档写的正是「这个档没有它」⇒ 构件里查无**恰好印证文档正确** |

> 这三个高信号名（`IItemTier` / `MixinLauncher` / `ScreenEvents`）本轮逐站点读过上下文才判为非缺陷，**不是**按名字猜的。同一类在 fabric 1.14.4 的 `RegistryObject` / `SubscribeEvent` / `modEventBus` 上重复出现（全部是「Fabric **没有** modEventBus」「**不要**用 Forge `RegistryObject`」式对照）。

**量具已知局限（记在这里，免得下轮当新发现）**：`negBlock` 腿只判**代码块级**否定；行内否定（中文散文里说「不要/没有 X」）一律落回 nowhere。⇒ nowhere 表里凡出现**同名跨档真**的名字，先按本条复查上下文再判。

### 8.10 第三批续（用户点名 ②）—— QSL 上游边界 + 用 MC 侧构件核残余 Vanilla 名

#### (1) QSL 上游止于 1.21（用户判断被证实）

`query_upstream_releases source=modrinth slug=qsl`：可查 **143** 条，**最新 = `11.0.0-alpha.3+0.102.0-1.21`**（MC 1.21，`versionType=beta`）；显式按版本过滤 —— `minecraftVersion=1.21.1` ⇒ `ok:true` + **`available:false`** + `total:0`；`1.21.4` 同形（两发都 `tier:"absent"`）。⇒ **QSL 上游根本没有 1.21.1+ 的构建**（release 级最后一版是 1.20.1 的 `7.7.0+0.92.2`）。

所以有行的那 5 个 quilt 档（1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11）**不可能**有 QSL 参照 —— 这是**上游事实**，不是「本机没下」。§8.9(2) 那个「两集合互补」的读数因此**不需要也不应该**靠补件去闭合。

#### (2) MC 侧构件已找到，并按用户指定落进 `F:\MC_GAME`

| 档 | 件（新落点） | 取自 | 大小 |
| --- | --- | --- | --- |
| fabric 1.14.4 | `F:\MC_GAME\_oracle-jars\mc\minecraft-1.14.4-yarn-build.18.jar` | `~\.gradle\caches\fabric-loom\1.14.4-mapped-net.fabricmc.yarn-1.14.4+build.18-v2\` | 26.1 MB |
| fabric 1.16.5 | `F:\MC_GAME\_oracle-jars\mc\minecraft-1.16.5-yarn-build.10.jar` | `~\.gradle\caches\fabric-loom\1.16.5-mapped-net.fabricmc.yarn-1.16.5+build.10-v2\` | 19.2 MB |
| forge 1.12.2 | `F:\MC_GAME\_oracle-jars\mc\minecraft_merged-1.12.2-obf.jar` | `~\.gradle\caches\minecraft\net\minecraft\minecraft_merged\1.12.2\` | 9.6 MB（**混淆件**） |

前两件是 **Yarn 具名** jar ⇒ 能核 **fabric 档的 Vanilla 名**。第三件是混淆件，**只作存档**：1.12.2 的 MCP 可读成员名本机仍无（成员名核不了，类名级已由 §8.9(2) 覆盖）。

#### (3) 核验读数（`verify-mc.mjs`：读 classfile 的**声明**表）

判据比前一版强：不是常量池字符串匹配，而是**逐类解析 `fields[]` / `methods[]` 的 `name_index`**，得到「本档 MC 件声明过的名字」全集。

| 档 | 残余名 | 本档 MC 件**声明**命中 | 仍未命中 |
| --- | --- | --- | --- |
| fabric 1.14.4 | 110 | **46** | 64 |
| fabric 1.16.5 | 117 | **52** | 65 |
| 合计 | 227 | **98** | 129 |

⇒ **98 个名字从「未核实」升为「构件已证存在」**。例：1.14.4 `getDefaultState` 声明在 `Block` / `StateManager` / `Fluid` 三类；1.16.5 `textRenderer` 声明在 `MinecraftClient` 等 6 类、`drawWithShadow` 声明在 `TextRenderer`。

**解析器先验后信**（对已知名定向取证）：`getDefaultState` → 3 类命中；`textRenderer` → 6 类命中；`LiteralText` → 类在 1.14.4 件中。

#### (4) 仍未命中的 129 个：逐类分诊，**未再发现真缺陷**

| 类 | 例 | 判据 |
| --- | --- | --- |
| **库类**（本机无该库件） | Cloth：`ConfigSerializable` / `ConfigCategory` / `BoolOption` / `setGlobalErrorSupplier` / `setSavingRunnable`；REI：`REIPluginClient` / `RegisterClientPluginsEvent` / `AutoStorageAware`；Gradle DSL：`mavenCentral` / `processResources` / `filesMatching` / `Excluded` / `accessWidenerPath` / `minecraftVersion` / `modId` | 既不在 MC 件、也不在 FAPI 件 ⇒ **未核实** |
| **读者自定义** | `myItem` / `myBlock` / `ModBlocks` / `ModBlockEntities` / `ModScreenHandlers` / `PACKET_ID` / `CUSTOM_REGISTRY` / `blockInventory` / `LogUtils` / `modApi` / `yarnMappings`；1.12.2 的 `VARIANT_A/B/C`（示例枚举值）、`BLOCK_SIMPLE` / `BLOCK_COMPLEX`（示例 `RegistryHandler` 字段） | 文档作者自己起的名字 ⇒ 本就不该在构件里 |
| **Forge 名（出现在 fabric 档）** | `IEventBus` / `FMLJavaModLoadingContext` / `DeferredRegister` / `ForgeRegistries` / `RegistryObject` / `SubscribeEvent` / `PlayerEvent` / `getModEventBus` / `PlayerLoggedInEvent` | 全部是**对照 / 否定**行（「Fabric **没有** modEventBus」「**不要**用 Forge `RegistryObject`」） |
| **行内否定例** | 1.12.2 `IItemTier`、1.16.5 `MixinLauncher` / `addPrimaryMixin`、1.14.4 `ScreenEvents` | 文档写的正是「这档没有它」⇒ 构件查无**印证**文档正确 |
| **mixin 处理器名** | `onTick(CallbackInfo ci)`（两档多处） | 作者在自己 mixin 类里起的注入方法名 |
| **迁移表 / 反模式里的旧名** | 1.14.4 `TextComponentString`（Yarn 实名 `LiteralText`）、`damageItem`（Yarn 实名 `damage`） | 只出现在 `knowledge/version-changes/1.14.x.md` 的「旧 → 新」对照表与 `knowledge/antipatterns/yarn-mappings.md`（教「不要这么写」）⇒ **是对照面的左值，用法正确** |
| **其它库常量** | `Keyboard.KEY_G`（LWJGL2） | 不在 Forge / MC 件里 |

> 上面每个可疑名都**逐站点读过上下文**才判：`TextComponentString` / `damageItem` 若不是落在迁移表左栏，本来会是**真缺陷**（fabric 档写 mojmap 名）。读后确认是「旧名 → 新名」对照表与反模式示例 ⇒ 不改。

#### (5) 仍未核（诚实记账）

- **forge 1.12.2 的成员名**：本机只有 SRG 具名件（`forgeBin` / universal）与混淆 merged 件 ⇒ MCP 可读成员名核不了。类名级已覆盖（present 122 / 查无 45）。
- §8.10(4) 的**库类**与 `Keyboard.KEY_G` 需相应库 / 依赖件 ⇒ 未核实。
- 本轮到 `F:\MC_GAME\_oracle-jars\mc\` 为止；**未改仓内任何 `.cursor/**`** ⇒ 镜像面不受影响。

### 8.11 覆盖面自审（用户问「全部核对了吗？有没有漏的」）

**答：没有全核过。** 本节把「已核 / 未核」逐格算清，并补掉能补的那一档。

#### (1) 行总账（当前快照：`node nonfabric-skill-names.mjs && node verify-all.mjs` 重跑）

| 项 | 行数 | 状态 |
| --- | --- | --- |
| 候选行合计（nowhere ∪ crossPack） | 5199 | — |
| 构件里在（PRESENT-MAIN 2070 + DEPS 813 + LIB 579 + LIB-notV 156） | **3618** | 已证存在 |
| **ABSENT 且该档有件（必须分诊）** | **909** | 见 (2) |
| ABSENT 且该档无件 | **672** | 见 (3) |

909 = nowhere 835 + crossPack 74；672 = nowhere 429 + crossPack 243。

#### (2) 909 的分诊：§5 分类 + §5.1「待审」队列**本轮全部判毕**

§5 已把 nowhere 那批按启发式分过类（自建名 / 反例提及 / 版本迁移文档 / 跨加载器对照 / Gradle / 第三方库 / 其余待审）。其中**「其余待审」38 个（档|名）（124 条去重项 / 160 行）从未给结论** —— 本轮逐名**读站点原文**判毕，**34 个唯一名全部为非缺陷**：

| 类 | 名（34） | 判据（读站点，不读名字） |
| --- | --- | --- |
| **读者自建标识符**（28） | `scheduleProcessing` `someData` `OTHER_ITEM` `SPECIAL_BLOCK` `SPECIAL_DROP` `blockInventory` `slotStack` `clientOnlyMethod` `serverInit` `DATA_ID` `REQ_ID` `AIR_BLOCK` `clientMethod` `PROCESSED_DIAMOND` `LAYER_LOCATION` `WALK` `MACHINE_BLOCK` `damageReduction` `dataSlots` `worldClient` `loveTimer` `attachToPlayer` `attachToTile` `dedicatedInit` `serverMethod` `NetworkHandler` `interactionObject` `blockLookupProvider` | 全是文档作者自己起的字段 / 方法 / 局部名（`ModItems.OTHER_ITEM.get()`、`MyEntityModel.LAYER_LOCATION`、`() -> clientOnlyMethod`、`this.entityData.define(DATA_ID, 0)`、`cap.setData(someData)`）⇒ **本就不该在构件里** |
| **形参名**（2） | `attackDamageIn` `attackSpeedIn` | `SwordItem(IItemTier, int attackDamageIn, float attackSpeedIn, Properties)` —— 形参名**不影响编译**，且是 MCP 形（本档通道为 official）⇒ 文档口径小瑕，非错误 |
| **散文 / 文件名**（4） | `DataGen`（散文「DataGen（可选）」）`Mojmap`（「Mojmap 轴才是…」）`README_AI`（文件名，句意是「本档 scaffold **无** `README_AI.md`」）`transferHandler`（散文「slot management and transferHandler」） | 不是 API 名 |

> 注：§5.1 表里的 `forge|mobSpawn` 在本轮快照里已消失（§8.3 那批按真名改写时一并修掉）。

#### (3) 672 条「无件」：648 已被本轮补核覆盖，24 条上游不可得

fabric 1.14.4 / 1.16.5 / forge 1.12.2 / liteloader 1.12.2 的行（共 648）已由 `verify-extra.mjs` + `verify-mc.mjs` 处理（读数见 §8.9(2) / §8.10(3)）；余 **24** 条 = quilt 1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 各 6 条 —— 上游**没有** QSL（§8.10(1)），**不可核，不是漏查**。

#### (4) **真正还漏着的，是「扫描面」本身**

量具扫面 = `.cursor/{rules,skills}` + 本档 `code-patterns/` + `knowledge/` + `AGENTS.md` + `scaffold/**`。以下面**从未进过量具**（实测文件数，2026-10-13）：

| 未扫面 | 件数 | 说明 |
| --- | --- | --- |
| `.cursor/agent/**` | 57 | 与 `AGENTS.md` 常同文（例：`fabric/1.16.5/.cursor/agent/default.md:108` 与 `fabric/1.16.5/AGENTS.md:108` 同句）⇒ 目前靠「与已扫文件同文」间接覆盖，**无机器保证** |
| 档根 `CLAUDE.md` | 21 | 与 `AGENTS.md` 并列的宿主入口，独立正文 |
| 根 `*.md` | 19 | `README*` / `CONTRIBUTING*` / `CORPUS_PROVENANCE` / `REPORT-FORMAT` / `WRITING-FOR-AGENTS` / `DELIVERY_LOG` … |
| `knowledge/libs/**` | 37 | 库模组 Skill 源稿（Cloth / GeckoLib / Trinkets…）—— 本身就是教 API 的 |
| `community_knowledge/**` | 121 | 社区短文（发布 / 崩溃 / 软依赖） |
| `mcp-server/**`（md + ts） | 193 | 工作流模板体与工具实现 |
| *（对照）*扫面内的 md/mdc/java | ≈2463 | — |

#### (5) 仍然核不了的（要用户给件或拍板）

- **第三方库 API：248 行 / 48 唯一名**（Cloth / REI / JEI / GeckoLib；§5 登记口径）⇒ 本机无库件 ⇒ **未核实**
- **forge 1.12.2 的 MCP 可读成员名**（本机只有 SRG 件 + 混淆 merged 件）
- 上表六个**未扫面**里的名字：要核先得扩量具扫面并重跑（属范围决定）

### 8.12 用户点名两项：quilt 1.21.x 的 Fabric API 面 + 扫描面扩三处

#### (1) quilt 1.21.3–1.21.11 走「Vanilla + 同版 Fabric API」—— 用户判断成立，且**本档自述早就这么写**

`quilt/<v>/.cursor/agent/default.md` 横幅与 `:20` 逐字写着：**「注册与事件一律用 Vanilla `Registry.register` 或同版 Fabric API；本目录出现的 QSL 相关表述仅为考据/stub（无构件可按）——禁止生成 QSL 代码」**（1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11 五档同文）。

⇒ §8.11(3) 那 24 行「quilt 无件 ⇒ 未核实」**不再是缺口**：这五档本就不需要 QSL，它们指向的 **Vanilla + 同版 Fabric API** 在本机都有件 ——
`fabric-api-{0.110.0+1.21.3, 0.119.4+1.21.4, 0.136.1+1.21.8, 0.138.4+1.21.10, 0.141.6+1.21.11}.jar` 与 `quilt-loader-0.31.0-beta.4.jar`（均从 `~\.gradle\caches\modules-2` 取出，已复制到 **`F:\MC_GAME\_oracle-jars\fabric-api\`**）。

**核验**：这五档当前扫出的 53 行里，真正的 API 名只有三个（其余 `AGENTS` / `Vanilla` / `Fabric` / `Quilt` / `QFAPI` / `Deprecated` 是散文词）。用 `quilt-loader-0.31.0-beta.4.jar` 逐名核：

| 名 | 构件实况 |
| --- | --- |
| `ModInitializer` | `net/fabricmc/api/ModInitializer`（quilt-loader 自带的 Fabric 兼容接口，类在） |
| `onInitialize` | 同上接口的方法 |
| `ModContainer` | `org/quiltmc/loader/api/ModContainer`、`net/fabricmc/loader/api/ModContainer` 等 3 处 |

⇒ 文档所写与 quilt-loader 0.31.0-beta.4 实况一致，**零缺陷**。

> **口径提醒**：五档 `agent/default.md` 里那句「旧横幅的 `11.0.0-alpha.3+0.102.0-1.21` 在 **maven** 上 0 命中（虚构，勿再写）」是 **maven 通道**口径。**Modrinth 通道确有该版本串，总数正好 143**（本轮 `query_upstream_releases source=modrinth slug=qsl` 实测：`total:143`、`latest:11.0.0-alpha.3+0.102.0-1.21`）。两通道结论不同，**别把「Modrinth 全部 143 个发布」当虚构——那个数字是对的**。

#### (2) 扫描面按用户指定扩三处

| 新增面 | 实现（gauge 改动见 §6 复现表） |
| --- | --- |
| `.cursor/agent/**`（各档 57 件） | 加进 `srcDirs()`（原先只扫 `.cursor/{skills,rules}`） |
| 档根 `CLAUDE.md`（21 件） | 与 `AGENTS.md` 同列扫描 |
| `knowledge/libs/**`（根级 37 件） | 新增 **`libs` 伪档**（`platform:"libs"`, `version:"<libs>"`）；腿取**全平台并集**（库教材里的 MC 侧名字应能在某档语料/映射/摘要出现），库自身 API 仍落 nowhere —— 正是要看的信号 |

**读数**（扩面后全量重跑）：

| 项 | 扩面前 | 扩面后 |
| --- | --- | --- |
| nowhere 行 | 3222 | **3238**（+16） |
| crossPack 行 | 1984 | 1985（quilt 等档新出 48 行） |
| 其中 `libs` 伪档 | — | **16 行**（TYPE 8 + MEMBER 8） |

⇒ `.cursor/agent/**` 与 `CLAUDE.md` **没有产生新的 nowhere**（内容与 `AGENTS.md` / 规则同源，被本档腿吸收）；新增的 16 行**全在 `libs`** ⇒ 扩面代价极小。

#### (3) libs 那 16 行逐条判毕：**零缺陷**，其中 7 个 Cloth 名**构件已证在场**

| 行 | 判据 |
| --- | --- |
| Cloth 7 名：`ConfigBuilder` `ConfigEntryBuilder` `getOrCreateCategory` `startBooleanToggle` `startIntSlider` `setSaveConsumer` `setSavingRunnable`（`mc-cloth-config/SKILL.md`） | 用本机件 `D:\mc-skill-temp\remapped\mod-cloth-config-15.0.140-yarn-named.jar` 核：`me/shedaniel/clothconfig2/api/{ConfigBuilder,ConfigEntryBuilder}` 类在；`getOrCreateCategory` / `setSavingRunnable` 是 `ConfigBuilder` 的方法；`startBooleanToggle` / `startIntSlider` 是 `ConfigEntryBuilder` 的方法；`setSaveConsumer` 命中 19 处 ⇒ **全部在场** |
| `saveMyConfig` | 作者自己的保存函数（`setSavingRunnable(() -> saveMyConfig())`）⇒ 非缺陷 |
| `createSomething`（`mc-architectury:47`） | 作者自己的示例方法（`static Something createSomething() { throw new AssertionError("平台实现缺失"); }`）⇒ 非缺陷 |
| `ExpectPlatform`（`mc-architectury:24`） | Architectury 的 `@ExpectPlatform`；**本机无 Architectury 件** ⇒ **未核实** |
| `Polymer` `Trinkets` `G8hlgtEk`（`mc-trinkets:26`） | 散文（「Modrinth 项目 id `G8hlgtEk`，标题 *Polymer Patch for Trinkets Updated*」）⇒ 非 API 名 |
| `skillId` `modIds`（`knowledge/libs/README.md:38`） | 散文（CLI 输出字段说明 `{ skillId, path, modIds, platforms }`）⇒ 非 API 名 |

#### (4) 六个未扫面里本轮**只扩用户点名的三处**

`根 *.md`(19) / `community_knowledge`(121) / `mcp-server`(193) —— 用户判定为教程/说明，**本轮不扫**（§8.11(4) 的表保留作记录）。

### 8.13 横幅「Modrinth 143 = 虚构」更正（用户令「改」）

**结论**：「Modrinth 全部 143 个发布」**不是虚构** —— 实测 `query_upstream_releases source=modrinth slug=qsl` 得 `total=143`、`latest=11.0.0-alpha.3+0.102.0-1.21`；只有 **maven 通道**没有该版本串（两通道口径不同）。

**改动面**：**7 棵 quilt 树**（`1.20.4` / `1.21.1` / `1.21.3` / `1.21.4` / `1.21.8` / `1.21.10` / `1.21.11`）的 `AGENTS.md` + `quilt/1.21.1/knowledge/common/qsl-verified.md`。

**新措辞（各树同义）**：`11.0.0-alpha.3+0.102.0-1.21` **在 maven 清单里 0 命中**（勿当 maven 坐标写），但**在 Modrinth 上是真版本**（`total=143`；按 `1.21.1` / `1.21.4` 过滤均 `available:false`）⇒ **此前标「虚构」有误**。`1.20.4` 树原文没有 maven 那半句，只把「发布数未复核、已删」改成「发布数是实测真值，只有版本号那半句未复核」。

**传播面与派生件（重要顺序）**：
- `AGENTS.md` 是**权威**；`.cursor/agent/default.md` + `.claude/agents/default.md` + `.trae/agents/default.md` 由 `scripts/sync-skills.ps1` **生成**。⇒ 必须**先改 `AGENTS.md` 再 sync**（本轮先改了 `.cursor/agent/default.md`，被随后自己的 sync 覆盖回旧文 —— 靠「五树 × 四面」逐面读回才定位到）。
- `quilt/1.21.1/knowledge/common/qsl-verified.md` 的 processed 派生件由 `scripts/index-qsl-verified.mjs --write` 重生成（1.21.1 的 `index-l0/l1/l2.json` sha 同步刷新；其余 5 档源稿未变、sha 未变）。

**验证**：`assert-skill-mirrors` ok（漂移 0 / 孤儿 0）· `assert-qsl-verified-sync` ok（**10/10** 档一致、无孤儿）· `assert-authoring-lint` ok（J3 纯负向 0）· 活树残留扫描（排除 `temp/**` 与本台账）`虚构，勿再写` **为空**。

**未动**：`temp/**` 下的审计快照（`temp/audit*/**`、`temp/ralph-audit*/**`、`temp/w3-*.md`）仍带旧句，属历史副本。

### 8.14 覆盖面自审（第二遍）—— 核验器「正面」不可靠，已改严并摘出 265 行假绿

**发现（结构性，比前几轮都重要）**：前几轮的核验器把「构件里在」判得很宽 —— 一个名字只要在**本机任何** jar 的常量池里出现就算 PRESENT，**既不管加载器、也不管 MC 版本**。实测（`F:\MOD_TEST\depsaudit2.mjs`）：

- 3625 条 PRESENT 里，**354 行**靠**别的加载器**的件作证 —— 例：`forge|1.12.2` 的 `tickCounter` 靠 `fabric-rendering-v1-….jar`；`forge|1.14.4` 的 `Fabric` 靠 `fabric-loader-….jar`；`forge|1.17.1` 的若干名字靠 `azure-json` / `ForgeGradle` 这类**构建工具件**。
- 另有 **59 行**靠**别的 MC 版本**的件作证 —— 例：`forge|1.13.2` 的 `FluidType` 靠 `neoforge-26.2.0.88-universal.jar`。

⇒ **正面（PRESENT）不构成「该名在本档存在」的证据**；真缺陷可以被假绿掩盖。

**处置：造严格版核验器** —— `verify-strict.mjs`（由 `mk-strict.mjs` 从 `verify-all.mjs` 生成）。规则：一件构件只准为「**同加载器、同 MC 版本**」的档作证（`jarOk()`：① 文件名前缀属另一加载器即拒（neoforge 接受 forge 件）；② 文件名带的**已知 MC 版本** ≠ 本档即拒；无版本 token 的库件照常可用）。库池升级同样过这道闸。

**读数**：5223 行里 **265 行由 PRESENT 降为 ABSENT**（假绿被摘掉），涉及 **49 个唯一名**。降幅前列：`onServerStarting` 26 / `onRegisterRenderers` 20 / `PlayerEvent` 19 / `modEventBus` 18 / `DeferredRegister` 18 / `PlayerLoggedInEvent` 18 / `tickCounter` 15 / `onRender` 14 / `onPlayerInteract` 12。

**49 名逐条分诊 → 2 处真缺陷（已修，3 个文件）**：

| 名 | 判据（构件 javap） | 处置 |
| --- | --- | --- |
| `Items.COPPER_INGOT`（`forge/1.15.2`、`forge/1.16.5` 的 `code-patterns/02-item-patterns.md`，各 2 处） | 1.16.5 件里 `COPPER_INGOT` **0 处**（`IRON_INGOT`/`NETHERITE_INGOT` 在场）；**铜是 1.17 才加入** | **已改**：两文件各 2 处 → `Items.IRON_INGOT` + 就地 javap 注（本版无铜，示例改用存在的锭） |
| `RegisterKeyMappingsEvent`（`forge/1.18.2/.cursor/rules/08-client-server.mdc:128` 的「示例：KeyMapping 处理」块） | 1.18.2 件里 `RegisterKeyMappingsEvent` **0 处**；`ClientRegistry#registerKeyBinding` 在场。同文件 `:98-101` 早已改成该形 ⇒ 本块是**漏改的第二处** | **已改**：改为 `@SubscribeEvent onClientSetup(FMLClientSetupEvent)` + `ClientRegistry.registerKeyBinding(TEST_KEY)` + javap 注。⚠️ `KeyConflictContext` **1.18.2 确有**（`net/minecraftforge/client/settings/KeyConflictContext`）⇒ 不被牵动 |

**其余 47 名：全非缺陷**，四类：

| 类 | 名 | 判据 |
| --- | --- | --- |
| **读者自建的处理器/字段/形参名**（17） | `onServerStarting` `onRegisterRenderers` `onRender` `onPlayerInteract` `onPlayerLogin` `onKeyInput` `clientInit` `getCustomValue` `tickCounter` `syncData` `menuProvider` `invSlot` `blockEntity` `entityYaw` `registerCapabilities` `registerRenderers` `onInitializeDataGenerator` | 文档自己定义的处理器/局部名 ⇒ 本就不该在构件里 |
| **移植 / 版本迁移文档的「另一侧」名**（26） | `PlayerEvent` `PlayerLoggedInEvent` `modEventBus` `DeferredRegister` `PlayerTickEvent` `onPlayerClone` `wasDeath` `NetworkRegistry` `FabricLoader` `ItemStackTemplate` `DeferredHolder` `builtInRegistryHolder` `createBlocks` `createItems` `FluidType` `RegisterEvent` `ModInitializer` `ClientTickEvents` `ServerTickEvents` `ServerLifecycleEvents` `ServerPlayNetworking` `FabricDataGenerator` `END_CLIENT_TICK` `SERVER_STOPPING` `END_SERVER_TICK` `registerGlobalReceiver` | 全在 `knowledge/porting/**` 或 `knowledge/version-changes/**`；**逐站点读过**：讲的是**另一加载器**或**目标版本**的 API（例：`ItemStackTemplate` 是「Before / After」迁移示例的 After 侧，配 `DataComponentPatch`）⇒ 按宿主档构件核必假红（同类已在 §5 登记） |
| **库 API（无件）**（1） | `registerRecipes`（JEI `IModPlugin`，方法名真） | 本机无 JEI 件 ⇒ 未核实 |
| **散文**（1） | `NewRegistry`（句中是「RegistryEvent.NewRegistry」） | 非独立标识符 |

**口径更新（自此以严格版为准）**：5220 行 = PRESENT **3360**（MAIN 2070 / DEPS 819 / LIB 471）/ **ABSENT 1860**。先前报的「PRESENT 3618 / ABSENT 1581」是**宽松版**读数，其中 **265 行的 present 是假的** ⇒ 「要分诊」的面比先前大 265 行，本轮已随那 49 名一并判毕。

**仍是「不定 / 假红风险」（诚实记账）**：

- ~~`forge 1.14.4` / `1.15.2` 的映射库是 `zero-rows`、`1.16.5` 的 mapped 件已知残缺 ⇒ 这三档的 strict-ABSENT **可能是假红**（缺类 ≠ 不存在）~~ → **§8.15 已复核否掉**：完整件重核，150 名里 136 名仍缺，非假红；且「1.16.5 mapped 件残缺」本身不成立。
- 短名（如 `tickCounter`）即使在同档件里也可能靠**无关字符串**命中 ⇒ 严格版只证「版本/平台不矛盾」，不证「成员位语义正确」。
- 三方库 API、`forge 1.12.2` 的 MCP 可读成员名、Architectury 的 `ExpectPlatform`：本机无件 ⇒ 未核实。
- 未扫面：根 `*.md` / `community_knowledge` / `mcp-server`（用户已判为不必扫）。

### 8.15 第四批 ·「另找完整件」——三档假红风险否掉 + forge ≥1.17 构件拆分事实（本轮，用户点名）

**结论**：forge 1.14.4 / 1.15.2 / 1.16.5 的 strict-ABSENT **不是假红**（§8.14 末那条风险作废）；顺带查清一条**会改变判断**的构件事实（forge ≥1.17 的 `net.minecraftforge.fml` 不在 mapped 件里），并据此更正两处旧说法。**本轮零新增真缺陷**。

#### (1) 完整件是什么
三档在 `.gradle\caches` 里各有 **12–13 件**：`forge_gradle\minecraft_user_repo\...\forge\<ver>\` 的 `binpatched` / `injected` / `inject_src` / `mci` / `srg` + `_mapped_*` 的 `mapped` / `launcher`；`forge_gradle\maven_downloader\...\forge\<ver>\` 的 `universal` / `userdev` / `sources` / `launcher`；加 `modules-2\...\forge\<ver>\...` 的 `launcher`。`mapped` 件是 `mci` 的**严格超集**（类集差 0，仅差 `package-info` 与 `realmsclient`）⇒ 取数面完整。

#### (2) 逐名重核（`F:\MOD_TEST\recheck150.mjs`）
把三档的 **150 个唯一「版本|名」（197 行）strict-ABSENT** 过**该版本全部构件**：

| 版本 | 唯一名 | 完整件里命中 | 仍缺 |
| --- | --- | --- | --- |
| 1.14.4 | 57 | 6 | 51 |
| 1.15.2 | 42 | 5 | 37 |
| 1.16.5 | 51 | 3 | 48 |

**136/150 仍缺 ⇒ 无假红**。14 个命中全是无关字符串（Forge 源码词 `onRender`/`DataGen`/`onSetup`、MC 字段名 `attackDamageIn`/`attackSpeedIn`/`particleMaxAge`/`entityYaw`、SRG 名 `func_110143_aJ`/`field_70725_aQ`）。136 个逐条看过，三类全是预期项：① 读者自建处理器/字段名（`onClientSetup`/`onServerStarting`/`ModCapabilities`/`slotStack`…）；② `knowledge/porting/**`、`knowledge/version-changes/**` 的**另一侧**加载器名（`FabricLoader`/`DeferredHolder`/`ItemStackTemplate`/`RegistrySupplier`/`ExpectPlatform`…）；③ `knowledge/antipatterns/**` 与 `09-anti-patterns.mdc` 里**故意写错**的例子（`ModifyBlockMessage`/`nextDiscriminator`）。另有 JEI 库名（`IModPlugin`/`JeiPlugin`）本机无件。

唯一像嫌疑犯的 `ITickableBlockEntity`（`forge/1.16.5/.cursor/rules/02-block.mdc:66`）：该行**原就带 `TODO(未核实)`**（原写 `ContainerProvider`/`ITickableBlockEntity`、本档语料 0 命中、已指向 `ITickableTileEntity`）⇒ 非缺陷。

#### (3) 构件拆分事实（本轮新发现）
forge **≥1.17** 的 `mapped` MC jar **不再带 `net.minecraftforge.fml` 包** —— 1.17.1 mapped 件里该包只有 **14** 类，1.16.5 有 **222** 类。FML 搬进独立构件 `net.minecraftforge:fmlcore`（+ `fmlloader` / `javafmllanguage`）。

⇒ **只读 mapped 件会给 forge ≥1.17 的 `net.minecraftforge.fml.*` 造成假 ABSENT**。`artifact-map2.json` 的 `deps` 已含 `fmlcore`（1.17.1–1.20.4 各档），故本轮量具**没**踩到；但这是一条必须记住的前提。

#### (4) 由此推翻「`DistExecutor` 在 1.17 被删」的误读
按 (3) 只看 mapped 件会得「`DistExecutor` 1.17.1/1.18.2 = 0」；拉齐构件后真值：

| 版本线 | `DistExecutor` 在哪 | 读数 |
| --- | --- | --- |
| forge 1.13.2 / 1.14.4 / 1.15.2 / 1.16.5 | `mapped` 件（`net/minecraftforge/fml/DistExecutor`，6 类） | 在场 |
| forge 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 | `fmlcore-<ver>.jar`（同 6 类） | 在场 |
| NeoForge | `net.neoforged.fancymodloader:loader` **2.0.17 / 3.0.45** 才有；**loader 4.0.43 起 0**；所有 `neoforge-*` universal/userdev（含 26.x）0 | 1.20.5 起删 |

⇒ forge 1.13.2–1.20.4 规则/技能里 **122 个逻辑文件**的 `DistExecutor.runWhenOn` / `unsafeRunWhenOn` **是对的，不得改**；规则树 `forge/1.12.2/knowledge/version-changes/1.12.x.md:65`「1.18+ 用 `DistExecutor`」也对。`community_knowledge/authored/neoforge-payload-networking.md:82`「26.x 已弃用」方向对，实际**删于 1.20.5**。

#### (5) NeoForge 侧的潜在盲区（本轮未观测到假红）
neoforge ≥1.20.6 各档，`artifact-map2.json` 的主件是 `neoforge-<ver>-merged.jar`，而 merged / universal 件**只含 `net/neoforged/neoforge/**`**（1.21.1 实测 9768 类里 `net/neoforged/neoforge` 1492、`net/neoforged/fml` **0**）。`net.neoforged.fml.*` 在 **`net.neoforged.fancymodloader:loader:<ver>.jar`**（1.21.1 对应 `loader-11.0.16.jar`：`net/neoforged/fml/common/Mod`、`ModContainer` 在场）——**该件不在量具的构件表内**。

观测到的 45 个 neoforge ABSENT 全是**脚手架自建方法名**（`onServerStarting`/`addCreative`/`commonSetup`/`validateItemName`）与移植/反模式面名字 ⇒ **无假红**；但这是躺着的地雷（任何 NeoForge FML 名若被量具判 ABSENT，必须先按本条补件再信）。

#### (6) 复现
`node F:\MOD_TEST\recheck150.mjs`（完整件重核）｜`node F:\MOD_TEST\ls-pkg.mjs <jar> <包前缀>`（包清单）｜`node F:\MOD_TEST\forge-surface.mjs <jar>`（`net/minecraftforge` 包分布）｜`node F:\MOD_TEST\nf-surface.mjs <jar>`（任意包面）｜`node F:\MOD_TEST\find-class.mjs <正则> <jar…>`（类名扫）。

### 8.16 第五批 · 外部审计 A1–A28 逐条独立复核 +「没查出来」的修法

**背景**：会话外另一 agent 产出 `DEEP_RESEARCH_REPO_AUDIT.md`（仓库根，`.gitignore:136` 已忽略）+ scratch `D:/mc-skill-temp/repo-audit/`（`ADJ-CR.md` A1–A28 全文、`FINAL-findings.tsv` 1476 条）。其 §3 族 A / A′ / B / G / H 与 §4 的 A1–A28 直指「**正文名字 vs 它自称的版本**」这一类 —— 与本台账前几批同一战场。本批**不采信其自报**，逐条自跑真构件 / 源码原文 / 盘面重核。

#### (1) 逐条判决（A1–A28）

| # | 报告结论 | 我的复核方法与读数 | 判 |
| --- | --- | --- | --- |
| A1 | forge 1.20.1 反模式「正确方案」用已删 `RenderGameOverlayEvent.Post` | 构件：1.18.2 universal `RenderGameOverlayEvent*`=**9** / 1.20.1=**0**（`RenderGuiOverlayEvent*`=**3**）；现盘已修 | **成立（已被并发修掉）** |
| A2 | `sync-skills.ps1` 剪枝集单一来源、空集即整目录删 | 源码 `:168-211` 逐行：`$cursorSkillNames` 只由 `$cursorSkillsDir` 填；剪枝段无「集合非空」守卫 | **成立** |
| A3 | `generateModel` item 分支 ≤1.21.3 正确 + 自披露 | 源码 `:36-58` + `warnings:["骨架不随 pack_format 变"]` | **成立（设计取舍）** |
| A4 | cloth `versions.json` 同字段混两套命名空间 | 逐 slot 读：≤1.21.3 无后缀 / 1.21.4+ 带 `+fabric`；**另见 1.21.11=`21.11.153` 无后缀**（夹在中间，比报告更乱）；1.14.4=`TODO(未核实)`、1.19.4=state `commented`（按设计 fail-closed）。maven 可达性**仍未核实**（探针无效） | **成立（更乱）** |
| A5 | 根文档计数全对 | fabric rules=**154** ✓、neoforge **13** 目录 ✓、forge rules=**125** ✓；**quilt rules=40**（报告写 32，偏高）；`registerTool(` 现 **87**（报告当时 86，已由 A17 取代） | **大体成立；quilt 一项计数错** |
| A6 | `FMLJavaModLoadingContext` 宿主随版本迁移 | 1.18.2：universal=0 / fmlcore=0 / **javafmllanguage=1** | **成立** |
| A7 | `@Mod` 注入形分界在 1.19.4 | javap 字节码 `FMLModContainer.constructMod()` 里 `getDeclaredConstructor` 调用数：1.17.1=**1** / 1.18.2=**1** / 1.19.4=**2**+`getParameterCount`+`NoSuchMethodException` 捕获表 / 1.20.1=**2** | **成立** |
| A8 | `gradlew` 44 条全 `100644` | `git config core.fileMode`=**false**；`git ls-files -s` 里 gradlew=**44**（`100644` 44 / `100755` 0） | **成立** |
| A9 | fabric 1.21.10 AGENTS 三断言假 | 逐句对 `pack.meta.json`：`mode`=`gradle`✓假 / `buildVerified`=`true`✓假 / 三件套在盘（provenance 记 sha256）✓假 | **成立** |
| A10 | A9 子断言「无 Gradle 键」字面为真 | 口径备注，未单独复跑 | **备注** |
| A11 | 1.13.2 pack_format 台账自称「已消解」而盘上三面不同步 | `glossary.md:24`=**6** / `00-project-setup.mdc:239`=**4** / `pack.mcmeta`=**4** / `porting/00-porting-guide.md:98`「~~pack_format~~（已消解）…两侧一致」 | **成立** |
| A12 | `TemplateManager` 在 1.18.2 不存在 | 构件：`TemplateManager`=**0**、`StructureTemplateManager`=**0**、`StructureManager`=**1**（本档真名）；jar 命名代自证 mojmap。**但全仓分类 205 处：围栏代码 0、frontmatter 184、`mc-multiblock` 的「禁止默写」清单 112** ⇒ 它**不是**「照抄即编译不过」 | **存在性成立；「80 文件」定性偏高** |
| A13 | fabric 26.1.2 无 `hasPermission(int)` | 构件 `CommandSourceStack`：`hasPermission`=**0**；权限面=`permissions()` / `withPermission` / `withMaximumPermission` | **成立** |
| A14 | forge 1.20.1 `mc-recipe` 教 `FinishedRecipe` 的 1.21 成员名 | 构件真名 `getId/getType/getAdvancementId/serializeAdvancement()`；文档写 `id/type/advancement/serializeAdvancement(JsonObject)`（实为 **3 改名 + 1 签名差**，报告写 4/4 略夸） | **成立** |
| A15 | fabric 1.21.3 规则教 loom `'1.8'` 且谎称同值 | maven HEAD：`1.8.pom`=**404** / 正控 `1.8.13.pom`=**200**；scaffold `build.gradle:12`=`1.8.13` | **成立** |
| A16 | `generate_network_packet` 4 个 forge 档一文件两 public 顶层类 | 实跑 CLI：1.16.5=`[NetworkHandler, TestPacket]`+单 `suggestedPath`；1.20.1=`[TestPacket]` | **成立** |
| A17 | 工具数 86 vs 87 | `registerTool(`=**87**（tool-registry 46 + wave/register 41）；README 3×87 + 2×86、AGENTS 1×86 | **成立** |
| A18 | fabric 1.21.8 AGENTS 四断言全假 | 同 A9 形 | **成立** |
| A19 | driver `startRound()` 漏重置 5 个观测静态位 | 源码：`startRound()`（`:4208-4230`）重置 17 项，**不含** `blockBefore/:2667`、`targetPos`、`guiOpened`、`guiClicked`、`guiClosed`；`:2920/:3491` 的 `if (blockBefore.isEmpty())` 守卫因此从第 2 轮起恒假 | **成立** |
| A20 | `DeferredRegister.Entities` 1.21.5 才有 | 逐档构件 `DeferredRegister$Entities`：20.4=**0** / 21.1=**0** / 21.3=**0** / 21.5=**1** / 21.8=**1** / 26.1=**1**；21.1 嵌套类=`Blocks,DataComponents,Items,RegistryHolder` | **成立** |
| A21 | `NeoForgeRegistries` 无 `SOUND_EVENTS/BLOCKS/ENTITY_TYPES/ATTRIBUTES` | 构件 21.1.248 字段 10 个（`…FLUID_TYPES/HOLDER_SET_TYPES/INGREDIENT_TYPES/FLUID_INGREDIENT_TYPES/CONDITION_SERIALIZERS/ATTACHMENT_TYPES`），四名 **0 命中** | **成立** |
| A22 | 根 `neoforge/scaffold` 面向 1.20.4 却发 `neoforge.mods.toml` | 盘上：根 scaffold `gradle.properties`=1.20.4/20.4.237，发 `neoforge.mods.toml`；版本档 1.20.4→`mods.toml`、1.20.6+→`neoforge.mods.toml`。FML loader：`loader-2.0.17` 含该字面量=**0**、`3.0.45`=**4** | **成立** |
| A23 | forge 1.20.1 `mc-blockentity` 三处编译不过 | 构件：`BlockEntity.handleUpdateTag`=**0**；`BlockEntityRenderer` `interface`=**true**；`BlockEntityType$Builder.of` 单重载 `(BlockEntitySupplier, Block...)` **无 Set 形** | **成立** |
| A24 | `mc-fluid` 的 `still`/`flowing` 两实参写反 | 官方 sources `ForgeFlowingFluid.java:204` = `Properties(fluidType, **still**, **flowing**)`；文档 `(MY_FLUID_TYPE, MY_FLUID, MY_FLUID_SOURCE)` 正好对调 | **成立** |
| A25 | NeoForge 词表收 Forge 专属 `AttachCapabilitiesEvent`/`RegistryObject`/`RegistryEvent` | 构件精确类名：`AttachCapabilitiesEvent` neoforge=**0**/forge=**1**；`RegistryObject` **0**/**1**；`DeferredHolder` **1**/**0**。**但 `RegistryEvent` 两边 universal 都=0**（报告「Forge 的类名」解释对 1.20.1 不精确） | **成立；`RegistryEvent` 一条解释需修** |
| A26 | `porting/03-real-world-examples.md:14` 的 `net.minecraftforge.event.fml.common.Mod` 包不存在 | `javafmllanguage-1.20.1`：`net/minecraftforge/event/fml` 前缀=**0**、`net/minecraftforge/fml/common/Mod.class`=**1** | **成立** |
| A27 | 3 条 import 全对；`SidedThreadGroups` 只在 `fmlcore` | mapped=0 / universal=0 / `fmlcore-1.20.1-47.4.10`=**1** | **成立** |
| A28 | A1 已被并发 commit 修掉 ⇒ finding 有保质期 | `git log` 该文件：`0c4437f4` blob 里旧名 **2** 处、`9e6ba97e`=**0** | **成立** |

**汇总**：**28/28 核心事实成立**（A1 成立但已被并发修掉）。需修细节 4 条：A5（quilt rules 实为 40 不是 32）、A12（存在性真、但「80 文件」是触发词/禁写清单而非代码）、A25（`RegistryEvent` 在 1.20.1 universal 里也查无，「Forge 类名」解释不精确）、A4（漏了 `1.21.11` 无后缀这一更乱的实例）。A3 = 设计取舍、A10 = 口径备注。

> **与本台账前几批的关系**：报告 §3 族 A 的成因判断（「现有的门只查映射层错配，结构上够不着『该档用了更老/更新的同名世代 API』」）**与本台账 §8.14 的自记一致**；A27 的「只看 universal/mapped 会造假红」与 §8.15(3) 的 fml 构件拆分**同源**。

#### (2)「没查出来」的修法 —— 缺口逐条量化 + 对应改法

本批把「我上一轮为什么漏掉这类」量到了具体数字（`F:\MOD_TEST\extract-v2.mjs`，抽取面原型）：

| 缺口 | 实测证据 | 改法 |
| --- | --- | --- |
| **G1 抽取面只覆盖围栏** | neoforge/1.20.4：围栏 token **62**，行内 code 里量具**从未考虑**的名 **117**（`NeoForgeRegistries`、`DeferredRegister.Entities` 恰在其中）；forge/1.20.1 同行内新增 **219**、frontmatter 新增 **23** | 抽取器加**行内 code（反引号）**与 **frontmatter `description`/触发词**两个面；清单型（「禁止默写：X」）改判为 negBlock 而非判红 |
| **G2 判据只到「名字存不存在」** | `FinishedRecipe`（A14）**就在我的 `nowhereTypes` 桶里**，被「类存在」放行；其 4 个成员错全在成员位 | 升到**声明表级**：`X.Y` 判 Y 是否 X 的声明成员；`extends B` 后用到的成员沿 B 的父链找（`javap-class.mjs` 原型已可用） |
| **G3 `negBlock` 桶过粗** | A1 的旧名落在 `09-anti-patterns.mdc` 的**「正确方案」**段，却被整文件判 negBlock 跳过（实测它在 `merged-skipped.tsv` 标 `negBlock`） | negBlock 从「整文件」降到「带 ❌/错误标记的**块**」，未标注块仍参与判红 |
| **G4 腿命中是布尔、不带版本** | §8.14 已记：短名可靠本档件里的**无关字符串**命中 ⇒ 只证「版本/平台不矛盾」 | 腿命中改成**带版本的有序命中**；「某版命中」不得为**另一版**的正文背书 |
| **G5 构件完整性** | A27：`SidedThreadGroups` 只在 `fmlcore`；本台账 §8.15：forge ≥1.17 的 `net.minecraftforge.fml` 在 `fmlcore`、neoforge ≥1.20.6 的 `net.neoforged.fml` 在 `fancymodloader:loader` | 构件表按「**同族构件或运算**」补齐（forge 7 件 + neoforge 的 fancymodloader loader） |
| **G6 门链结构盲区** | 本仓 `assert-skill-yarn-attest` / `assert-rules-api-names` / `assert-cross-layer-names` 只查映射层 | 把 G1–G5 做成一道**新门**（按语法位取词 + 同族构件或运算 + 棘轮豁免台账），挂 `test-scripts.mjs`；**A1–A28 当回归夹具** |

**原型读数**（`extract-v2.mjs`，只读）：加行内面后，`TemplateManager`（frontmatter）、`NeoForgeRegistries`/`Entities`（行内）**全部被捞回** ⇒ G1 是这三个已知真缺陷漏判的**直接**成因。

### 8.17 第六批 · A1–A28 修正落盘 + G1/G4 量具扩面（存量清单）

**本批 = 执行 §8.16「修法」的一半：A 项落盘 + G1/G4 实现。**

#### (1) A 项落盘（清单见 `DELIVERY_LOG.md` 本节第 1 块）

16 个靶点 / 24 文件；A2 守卫经真跑验证生效；A16 修后 CLI 实跑单 public 类。A8（`gradlew` 执行位，需改 git 索引）、A22（已归档树改名）判**不动**；A6/A27 为负结果/方法学校准。

#### (2) G1 / G4 已实现（量具 v3：`F:\MOD_TEST\nonfabric-skill-names-v3.mjs`）

- **G1**：新增 `extractProseUnits()`，抽取面从「只认 java/kotlin 围栏」扩到三面 —— 围栏 + **行内 code span**（`\`Identifier\`` / `A.b`）+ **文件首 frontmatter**（只取 PascalCase，排除 `HTML/CSS/JSON` 之类全大写噪声）。文件名形（`AGENTS.md`）与占位符形（`method_XXXXX`）显式排除。
- **G4**：E 腿（`data/_yarn-mojmap-pairs`）由**全档并集**改为**按版本分桶**（`yarn-mojmap-<ver>.json`；loose 包用并集）；命中改为**带腿标签** `A/C/D/Dqsl/E/Eonly`，仅靠 `Eonly`（全局 curated `MOJMAP_ONLY`）者另计 `attributedEonly` —— 「某版命中不得为另一版背书」这条落到了实现。
- **读数**：v2 nowhere TYPE **1246** / MEMBER **1990** → v3 TYPE **2647** / MEMBER **2226**；crossPack TYPE **933→1983**。
- **滤噪后**（去占位符/纯小写/长度<5/文件名形）：unique **539**，其中 G1/G4 **净增 26**（`F:\MOD_TEST\G14-inventory.txt`）。
- **可直接认的跨装载器泄漏**（fabric 档出现 Forge/Neo 名）：`DeferredRegister`(39) `FMLJavaModLoadingContext`(36) `MinecraftForge`(19) `RegisterEvent`(26) `RegistryObject`(23) `ForgeRegistries`(18) `IEventBus`(21) `EventPriority`(20) `ExistingFileHelper`(22)；NeoForge `NeoForgeAddonPlugin`(39)。
- **净增 26 条**：真候选 `DataComponentMap` / `MixinMinecraft` / `MixinGameSettings` / `ClientTickCallback` / `ServerTickCallback` / `ImpersonateClient` / `HttpServer` / `MinecraftExtension` / `BridgeMod` / `EntityRendererRegistry`；假阳 `AGENTS`/`CLAUDE`/`README`/`THIRD_PARTY_NOTICES` 与 `Properties`/`Minecraft`/`Message`/`Framebuffer`（名词回捞）。
- **复现**：`node F:\MOD_TEST\nonfabric-skill-names-v3.mjs --root=<repo>` → `F:\MOD_TEST\nonfabric-scan-v3/`；对拍 `node F:\MOD_TEST\final-inventory.mjs`；v2 基线 `node F:\MOD_TEST\nonfabric-skill-names.mjs --root=<repo>`。

#### (3) G2 / G3 / G5 是否要做（评估）

- **G2 要做**：`FinishedRecipe`(A14) 这类「类存在、成员名/签名错」在现有面判不出 —— 需按 `javap-class.mjs` 原型升到**声明表级**（`X.Y` 判 Y 是否为 X 的声明成员；`extends B` 沿父链）。**下一批首选**。
- **G3 已被大部分覆盖**：量具早已按**行级** `❌/✅` 切换 `blockNeg`（非整文件），§8.16 表里「整文件判 negBlock」的旧描述已不适用；残余仅「旧名落在 ✅ 正确方案段」（A1 形）需语义判，属**可选精修**。
- **G5 要做**：A27（`SidedThreadGroups` 只在 `fmlcore`）与 §8.15 的构件拆分共同证明「只看 universal/mapped 会造假红」；须按「**同族构件或运算**」补件表。与 G2 同批。

#### (4) 与 §8.16 的差异（口径更正）

§8.16 表里写「G3 整文件判 negBlock」——**该描述对 v2 量具已不成立**（`:319-320` 本就是行级切换）。本节点名更正，避免后续按错描述改。

### 8.18 第七批 · G5/G2/G3 上马 + 修 A8（含门）+ A22 补句

#### (1) 逐轮读数（nowhere 行数）

| 版本 | 加了什么 | nowhere TYPE | MEMBER | crossPack TYPE |
| --- | --- | ---: | ---: | ---: |
| v2 | 原始 | 1246 | 1990 | 933 |
| v3 | G1（行内 code span + frontmatter）+ G4（E 腿按版本分桶） | 2647 | 2226 | 1983 |
| v4a | G5（同族摘要或运算）+ G2（类→声明方法） | 2351 | 2021 | 1482 |
| v4 | G3 补完（prose 单元按所在行判负例） | **1655** | **1903** | 1054 |

工具 `F:\MOD_TEST\nonfabric-skill-names-v4.mjs`；产物与四类假阳清单见 `F:\MOD_TEST\G-final.md`。

#### (2) G5 的因（**重要，否定了一个长期假红面**）

量具 D 腿一直只读 `mcp-server/data/loader-api-summaries/<ver>-<platform>.json` = **loader**，而 **Fabric API 在 `<ver>-fabric-api.json`**（另有 quilt 的 `-qsl` 作 summAlt）。⇒ `EntityRendererRegistry` / `ScreenRegistry` / `ClientSidePacketRegistry` / `UseItemCallback` / `UseBlockCallback` / `ItemEvents` / `AttackEntityCallback` 等**成批**被假判 nowhere（实测这些名只出现在 `*-fabric-api.json`）。改法 = 「本档 loader 摘要 ⊕ 同族摘要」或运算（fabric→`-fabric-api`；neoforge 1.20.1→`-forge`）。**剩余面**：forge ≥1.17 的 FML 在 `fmlcore`、neoforge ≥1.20.6 的在 fancymodloader `loader`，两者**都无入库摘要** ⇒ 那两族 FML 名仍会落 nowhere。

#### (3) G2 现状与局限

`merged-member-mismatch.tsv` 296 行 / 29 unique。**只到方法级**（摘要 `fields` 恒 0）且**按简单名匹配** ⇒ 高频全是撞名假阳：`Properties.of`(121) / `Builder.of`(57) / `Properties.create`(23) / `Component.translatable`(10) 都是**正确写法**（同名类撞车）。⇒ G2 现在是**候选发现器**，改法 = 先把 `X.y` 的 X 解析到具体 FQCN，再判声明成员。

#### (4) G3 补完（口径更正）

§8.16 表把 G3 描述为「negBlock 从整文件降到带 ❌/错误标记的**块**」，§8.17(3) 又判它「已被大部分覆盖、属可选精修」。**两句都不够**：现有 `❌/✅` 行级切换只对**围栏面**生效，**新加的 prose 面（行内 code / frontmatter）压根没跑负例判据**。实测：fabric 各档「禁编名单（非本档 Fabric API）：`ItemEvents` / `BlockEvents` / …」、「不要用已移除的 `ClientSidePacketRegistry`」、「不要在这里抄邻版 `ScreenRegistry`」全被当推荐用法。补法 = prose 单元带 `ctxLine`（所在原行），行内命中 `NEG_PROSE`（比块级多 `禁编|禁用` 与 `无\x60`）即整单元跳过 ⇒ nowhere TYPE 2351→1655、豁免行 21427→27632。

#### (5) 扩面之后有没有新问题 —— **没有新的真缺陷**

新冒候选逐条读出处行后，四类全非知识错误：① 跨装载器对照表（`porting/*`、`agent/default.md` 的「与 Forge 的映射」列）；② 负例清单（G3 已判掉大半，残余 `## 禁止` 小节标题型漏判）；③ **frontmatter 触发词**（G1 自引入；`RoughlyEnoughItems`/`ForgeEnergy`/`FluidType`/`PublishedApi` 等）；④ 示例占位类名（`ModBlockEntities`/`ModCapabilities`/`ModifyBlockMessage`，现有 `PLACEHOLDER` 不覆盖 `Mod*`）。逐条复核过的可疑项（rift/modloader 的 `DeferredRegister`、neoforge 的 `NeoForgeAddonPlugin` 等）**全是禁用说明**。

#### (6) A8 / A22

- **A8 已修**：44 个 `gradlew` 索引模式 `100644→100755`（`git update-index --chmod=+x`，未提交）；`assert-scaffold-wrappers` 加执行位检查（负例红 / 恢复绿两向验过）。此前该门只查文件齐 / props⇄meta / jar 有效 / git 跟踪，**不查执行位**。
- **A22**：按「不动归档树」处置 —— 只在 `neoforge/LEGACY-NOTICE.md` 补一段（自报 1.20.4 却发 `neoforge.mods.toml`、FML 2.0.17 无该字面量 ⇒ 会被静默忽略；要走 `neoforge/<精确版本>/scaffold/`）。

### 8.19 第八批 · G2 升 FQCN + 三处内容问题（真构件）

#### (1) G2 的解析链与三代读数

| 代 | 接收者解析 | 行数 |
| --- | --- | ---: |
| v1 | 简单名直查（`Properties.of` 撞 `FluidType$Properties`） | 296 |
| v2 | `import` 精确名 ∪ 唯一顶层简单名 | 147 |
| v7 | 上述 + **跳过限定名尾巴**（`A.B.c(` 的接收者是 A） | 36 |

v6（**只认 import**）= 0 条：全仓 3697 个 java/kotlin 围栏里只有 **95 个**带 `import`（2.6%）⇒ import-only 结构性太窄，不能单用。

#### (2) 残余 11 个 unique 的归因（全部读过出处行）

- **同名类遮蔽（8）**：`Properties.of`(16) / `Properties.create`(3) / `Properties.notSolid`(1) / `SoundEvent.createVariableRangeEvent`(3) —— 文档写的是 vanilla `BlockBehaviour.Properties` / `net.minecraft.sounds.SoundEvent`，却按本档摘要里同名的 forge 类判。**修法**：解析到 FQCN 后还要看该 FQCN 的包是否与文档语义相符（或只认 import）。
- **映射不全（1，已证非缺陷）**：`FabricBlockSettings.of`(6)。1.18.2 sources 里是 `method_9637(class_3614 material)`（未映射），**方法确实存在**；1.20.1 同族才映射成 `of`。⇒ 这类假阳**改判据消不掉**。
- **迁移文档（2）**：`DeferredRegister.createBlocks/createItems`(各 1) 出现在 `forge/1.18.2/knowledge/version-changes/1.21.x.md` —— 讲 1.21 的迁移说明，正确。
- **负例（1）**：1.12.2 的 `Properties.notSolid` 行写「不要抄 1.13+ …」。

#### (3) G2 的边界（未做）

**父链成员**没走（`extends B` 后在 B 上声明的方法判不出；`FMLCommonSetupEvent.enqueueWork` 正是此类）；**vanilla 成员数据**没有（摘要只收 loader/平台类）⇒ 类内成员级校验只覆盖 loader API 自身。

#### (4) 三处新的内容问题（真构件核过；**未改**）

| # | 位置 | 问题 | 判 |
| --- | --- | --- | --- |
| 1 | `forge/1.14.4/.cursor/skills/mc-blockentity/SKILL.md:144`（正述）+ `:151`（代码） | 写 `ClientRegistry.bindTileEntityRenderer`；1.14.4 的 `ClientRegistry` **只有** `bindTileEntitySpecialRenderer(Class<T>, TileEntityRenderer<? super T>)`（sources 实测 + 官方 1.14.4 文档），且第一参要传 **TE 类**而非 `MY_TE.get()`。**同树的 `mc-renderer/SKILL.md:36` 写对了**（「本档仍带 `Special`」）⇒ 树内自相矛盾 | **坐实** |
| 2 | `forge/1.15.2/.cursor/rules/04-entity.mdc:92` | 写 `FMLCommonSetupEvent.enqueueWork()`；钉住的 1.15.2 构件（31.2.50）该类只有构造器、全 jar 无 `ParallelDispatchEvent`，javadoc 指向 `DeferredWorkQueue`。**但**本仓 `data/forge_1.15.2` 官方页提到 `ParallelDispatchEvent#enqueueWork` ⇒ 官方文档与该构件不一致（疑取自更晚 1.15.x 构建） | **未定案（需定构建版本）** |
| 3 | `forge/1.14.4/knowledge/antipatterns/registry.md:59` | ❌-示例里写 `DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID)`；1.14.4 的 `DeferredRegister` 只有构造器 `(IForgeRegistry<T>, String)` + `register`，**无 `create`**。属「❌ 忘记注册」示例，重点不是它，但照抄编译不过 | **坐实（轻）** |

### 8.20 第九批 · G2 父链（真构件继承表）+ 修 3 处内容问题

#### (1) 为什么需要父链

loader-api 摘要的 class 形状 = `{fqcn,simpleName,pkg,modifiers,methods}` —— **没有超类字段**，`methods` 只收**该类自己声明**的方法。于是「继承来的成员」被判成「不存在」：`FMLCommonSetupEvent` 在 1.16.5 的 `methods` 为空（只有构造器），而 `enqueueWork` 来自 `ParallelDispatchEvent`。

#### (2) 实现

- `hier.mjs`：读**真构件 sources jar**（`forge-<v>-sources.jar`），正则抽 `class|interface|enum X extends A implements B,C`（去泛型），输出 `hier-<platform>-<version>.json` = `{简单名: [父简单名...]}`。
- gauge v8：G2 命中后，直接声明查无 ⇒ `memberViaChain()` 沿链 BFS（父简单名经 `topSimpleUnique` 解析成 FQCN 再查该 FQCN 的成员集），找到即放过。
- 自检 `--probe-chain`：1.16.5 true / 1.15.2 false / 1.14.4 false + 假成员对照 false。

#### (3) 覆盖边界

只有本机存有 sources jar 的档有继承表（本轮 forge 1.14.4/1.15.2/1.16.5）。无表的档 `loadHier` 返回空 Map ⇒ 退回 v7（只判直接成员）。vanilla 类的父链同样缺（摘要只含 loader/平台类）。

#### (4) 修掉的 3 处（真构件出处）

| # | 文件:行 | 改法 | 真构件依据 |
| --- | --- | --- | --- |
| 1 | `forge/1.14.4/.cursor/skills/mc-blockentity/SKILL.md:144,151` | `bindTileEntityRenderer` → `bindTileEntitySpecialRenderer`；`MY_TE.get()` → `MyTE.class` | `forge-1.14.4-28.2.26-sources.jar` `ClientRegistry` 只有 `bindTileEntitySpecialRenderer(Class<T>, …)`；官方页 `tileentities_tesr.md:29` 同 |
| 2 | `forge/1.14.4/knowledge/antipatterns/registry.md:59` | `DeferredRegister.create(…)` → `new DeferredRegister<>(…)` | 同 jar `DeferredRegister` 只有 `public DeferredRegister(IForgeRegistry<T>, String)`，类 javadoc 自用 `new DeferredRegister<>(…)` |
| 3 | `forge/1.15.2/.cursor/rules/04-entity.mdc:92` | `FMLCommonSetupEvent.enqueueWork()` → `DeferredWorkQueue.runLater()` | `forge-1.15.2-31.2.50-sources.jar` 该类无 `enqueueWork`、无 `ParallelDispatchEvent`；`DeferredWorkQueue.runLater(Runnable)` 存在 |

未改（本就正确）：`forge/1.16.5/.cursor/skills/mc-worldgen/SKILL.md:19` 与 `forge/1.16.5/knowledge/version-changes/1.16.x.md:34` —— 1.16.5 的 `FMLCommonSetupEvent extends ParallelDispatchEvent`，`event.enqueueWork(...)` 合法。

修后量具：36 → 33 行。

### 8.21 第十批 · 把构件核验推到全档（roster）+ 修 6 档内容问题

#### (1) roster 量具（真构件 → 完整成员表 + 继承）

- `classfile.mjs`：最小 class 文件解析器（常量池 tag 1/3/4/5/6/7/8/9-12/15-20，Long/Double 占两格），取 `this_class` / `super_class` / 方法名表。
- `build-roster.mjs`：对每个 mapped jar 跑一遍，产 `roster-<platform>-<version>.json`。**与 javap 逐字一致**（4 个抽查点全中）。
- v11 相对 v10 多了 `absorbRoster()`：把 roster 的成员并进 `membersByFqcn`、把 `super`/`ifaces` 并进父链表 ⇒ **父链首次覆盖 vanilla 类**（v8 的父链表只覆盖 forge 的少量类）。

#### (2) 构件覆盖边界

| 平台 | 有 mapped jar（本机） | 无 |
| --- | --- | --- |
| forge | 1.13.2 / 1.14.4 / 1.15.2 / 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4（9 档；通道按各档 `gradle.properties` 选官方/快照/parchment） | 1.7.10–1.12.2 / 1.21.1 |
| fabric | 1.14.4 / 1.16.5 / 1.17.1（yarn mapped，且 build 号与各档 pin 相同） | 1.18.2+（loom 只缓存 intermediary 的 merged jar） |
| neoforge | — | 全族（neoformruntime 只有未映射 client/server） |

#### (3) 本轮修的内容问题（全部真构件/roster 实证）

| 档 | 位置 | 由 → 改 |
| --- | --- | --- |
| forge 1.16.5 | 10-gui.mdc / mc-gui / mc-dimension / mc-worldgen / version-changes | registerFactory→register；RegistryKey.get→create；MobSpawnInfo.builder()→new MobSpawnInfo.Builder()；BiomeGenerationSettings 同 |
| forge 1.15.2 | mc-gui / 10-gui / 07-datagen / version-changes | 同 registerFactory→register；战利品 DSL 四个类名 + `withPool`/`add`/`apply`/`between`；RenderType.getEntityTranslucent→entityTranslucent |
| forge 1.17.1 | 10-gui / mc-gui / 06-networking / 08-client-server | Component.literal→new TextComponent；Component.translatable→new TranslatableComponent；ClientboundBlockEntityDataPacket.create()→getUpdatePacket() |
| forge 1.18.2 | mc-gui / 10-gui | Component.literal→new TextComponent |
| fabric 1.14.4 | mc-sound / mc-item / 03-item | SoundEvent.of→new SoundEvent；TypedActionResult.success→new TypedActionResult<>(ActionResult.SUCCESS, …) |
| fabric 1.16.5 | mc-sound | SoundEvent.of→new SoundEvent |

**系统性根因**：这些档的 `.cursor` 正文写的是 **MCP 层名**，而各档 `scaffold/gradle.properties` 钉的是 **official / parchment 通道** ⇒ 同名不同层的成员名（`get`/`create`、`registerFactory`/`register`、`builder`/`lootTable`、`literal`/`TextComponent`…）在真构件下编不过。1.14.4/1.13.2 用 `snapshot` 通道，所以那两档的 `registerFactory` 等写法**是对的**（修的时候必须按档区分，不能全局替换）。

#### (4) 假阳的成因（量具侧，未修）

① **类级解析错配**：`Properties.*` 全被解析到 `net.minecraftforge.common.property.Properties`（文档本意 `Block.Properties`）——最大一类；② **负向行**：「不要写 X」/❌ 反例里的名字也算命中；③ **迁移文档**：version-changes 页里写的是目标版本 API；④ **非 MC jar 的类**：`FabricBlockSettings`（FAPI 不在 MC jar）；⑤ **api-index 子集**（v10 遗留）。

### 8.22 第十一批 · 映射库扩面 + 改动点编译验证

#### (1) 第二个 roster 源：仓库映射库

`data/<plat>_<ver>/mappings/yarn-mappings.sqlite` 的 `methods` 表是 **class-scoped 成员名录**（`owner_named` + `name_named`）：
- `yarn-tiny`（fabric 全族 14 档）：`name_named` = **Yarn** 名 ⇒ 直接可用。
- `forge-srg`/`tsrg`（forge 1.7.10–1.13.2）：`name_named` = **SRG**；需经 `searge_methods`（`searge→MCP`）换名。1.7.10–1.11.2 无该表也无 `methods.csv` ⇒ **不可用**。
- `mcp-config-srg`（forge 1.16.5–1.20.4）：`name_named` = `m_…_` SRG ⇒ 对 official 名无意义（那几档用 mapped jar）。
- `mcp-csv`（1.14.4/1.15.2）：`methods` 表 **0 行**。

⇒ 覆盖面 12 → **24 档**（fabric 13 + forge 11）。

#### (2) 改动点编译验证（15/15）

`compile-check.mjs`：对每个改动调用点，用 `javap` 取该成员的**精确签名** → 生成最小调用（类型变量→Object、泛型→原类型、`$Nested`→`.Nested`）→ `javac -cp <该档通道的 mapped jar>`。**15/15 PASS**，涵盖 forge 1.15.2/1.16.5/1.17.1 与 fabric 1.14.4。

**边界**：这只证明「文档示例里的这些调用能在该档构件上编译」；整树 `gradlew build` 与进游戏（L0/L4）**未跑**。

#### (3) 遗留的口径裁定（非事实问题）

`RegistryKey.get` / `RenderType.getEntityTranslucent`：上游 primer 就是这两个 MCP 名；构件是 `create` / `entityTranslucent`。本轮按构件改并加注。若项目采「语料优先」，应回退 + 标注。

### 8.23 第十二批 · 覆盖面到 35 档（neoforge 全族）

| 源 | 覆盖 | 说明 |
| --- | --- | --- |
| mapped jar（class 文件） | forge 9 + fabric 3 | 完整成员 + 超类 |
| `yarn-mappings.sqlite`（`methods.owner_named/name_named`） | fabric 10 | yarn 名 |
| `yarn-mappings.sqlite`（`name_official` ⋈ `classes.official`） | neoforge 8 | **mojmap roster** |
| `yarn-mappings.sqlite` + `mcp-<ver>.zip`/searge | forge 1.12.2 / 1.13.2 | MCP 名 |
| loom merged jar（26.x 去混淆） | fabric 26.1.2 + neoforge 26.1 | 名即可读 |
| **下载** Mojang `client_mappings` → `F:\MC_GAME\mappings\` | neoforge 1.20.6 / 1.21.5 | 首次 1.20.6 TLS 失败、重试成功 |

**取不到**：legacy 1.7.10–1.11.2 的 MCP 可读名（Forge maven 只有 `csrg`/`srg`；仓内 `mcp-<ver>.zip` 无 `methods.csv`）。

**结果**：neoforge 全族 **0 处真缺陷**（唯一 1 行经读原文 = 显式 `❌ 下一跳` 反例）。

## §8.24 fabric 声音族逐档溯源（SoundEvent 工厂 + 1.21.11 层错）

判据 = 该档映射 sqlite 的 `methods` + 该档**真构件 javap**；结论逐档不同，故按档列：

| 档 | 映射层 | 骨架原文 | 真构件实测 | 判定 |
| --- | --- | --- | --- | --- |
| fabric 1.14.4 | yarn | `SoundEvent.of(...)` | 仅 `getId()` + 构造器 | **缺陷·已修** |
| fabric 1.16.5 | yarn | `SoundEvent.of(...)` | 仅 `getId()` + 构造器 | **缺陷·已修** |
| fabric 1.17.1 | yarn | （无 mc-sound） | 仅 `getId()` | n/a |
| fabric 1.18.2 | yarn | `SoundEvent.of(...)` | **无 `of`**，`public SoundEvent(Identifier)` | **缺陷·本轮修** |
| fabric 1.19.4 – 1.21.10 | yarn | `SoundEvent.of(...)` | `of(Identifier)` 等三重载存在 | 正确·不动 |
| fabric 1.21.11 | yarn | mojmap 名（`BuiltInRegistries` + `Identifier.fromNamespaceAndPath` + `SoundEvent.createVariableRangeEvent`） | yarn 侧 `of` / `Identifier.of` / `Registries`；**三个官方名全无** | **缺陷·本轮修** |
| fabric 26.1.2 | mojmap（去混淆） | mojmap 名 | 真 jar 三个名**都在** | 正确·不动 |

**关键事实**：MC **1.21.11 的 mojmap 把 `ResourceLocation` 改名成 `Identifier`**，于是 mojmap 与 yarn 在 1.21.11 **简单类名相同、方法名不同**（mojmap `fromNamespaceAndPath` / `createVariableRangeEvent` ↔ yarn `of`）—— 「同名」最易骗过只查简单名的判据。26.1.2 去混淆后类名**就是** `Identifier`（`ResourceLocation` 已消失）。

**暴露的判据盲区**：上轮非 fabric 面 gauge 的判据停在「这个名字存不存在」；`BuiltInRegistries` 属**类名级且是「层错」**（类存在、但不在该档映射层），不在射程 ⇒ 漏报。修法是自己带「该档映射层」维度再判一次。

**收口证据（双向 javac）**：以真 yarn jar 为 `-cp` 对两处改动各做正/反两臂 —— 1.18.2 新式 `new SoundEvent(new Identifier(..))` PASS / 旧式 `SoundEvent.of(..)` FAIL（`找不到符号 方法 of`）；1.21.11 新式 `SoundEvent.of(Identifier.of(..))` PASS / 旧式 `createVariableRangeEvent(fromNamespaceAndPath)` FAIL（`找不到符号 方法 fromNamespaceAndPath`）。⇒ 修复后的骨架真编译过、被替掉的真编译不过，且编译器点名的正是所判缺名。

**2026-10-16 用户裁定（更正本节的处置）**：`fabric/1.21.11` 是**过渡档**，其 mc-sound 引官方名的写法**保留原文**，本轮改写已 `git checkout --` 全部撤回（8 面回到 `HEAD`）。上表 1.21.11 行的处置改读为「**已判缺名 · 按用户裁定保留原文**」——**判据表与双向 javac 读数仍是事实**（该档编译面 = Yarn），只是「改不改」由用户拍板。`fabric/1.18.2` 的修复不在撤回范围。

## §8.25 复核「1.21.11 两种名都编译」——成立条件是类路径挂两个 jar

对转述结论「1.21.11 yarn 名与官方名都能编译」做的实测复核（真工程 + 真 `gradlew compileJava`）：

| 工程 `mappings` | Yarn 名 | 官方名 |
| --- | --- | --- |
| `net.fabricmc:yarn:...`（本仓 scaffold / 基础模组工程） | **PASS** | **FAIL**（`程序包 net.minecraft.core / net.minecraft.resources / net.minecraft.sounds 不存在`） |
| `loom.officialMojangMappings()`（Fabric 文档参考工程） | **FAIL**（`程序包 net.minecraft.registry / net.minecraft.sound 不存在`） | **PASS** |

同工程不可混：三档 javac 对拍显示，**只有把 yarn jar 与 mojmap jar 同时挂进一个类路径**时两种写法才都过（`net.minecraft.util.Identifier` 与 `net.minecraft.resources.Identifier` 同时可见）；真工程的类路径只会含其中一个。

**出处**：`F:\MOD_TEST\dev\fabric-1.21.11\build.gradle:21` = yarn；`data/fabric_1.21.11/reference/1.21.11/build.gradle:8` = `loom.officialMojangMappings()`。官方名在 1.21.11 确实存在（javap loom 产出的 `1.21.11-loom.mappings.1_21_11.layered+hash.2198-v2`：`Identifier.fromNamespaceAndPath` 与 `SoundEvent.createVariableRangeEvent` 均在），只是不在 yarn 工程里。

⇒ 对 `fabric/1.21.11` mc-sound 原文（引官方名）的处置不变：按用户裁定**保留原文**；该段在任何读者手上能否编译，取决于其工程的 `mappings` 行。

## §8.26 处置落地：fabric/1.21.11 mc-sound 两套名并列（用户裁定）

用户裁定：该行**两种名都留下，因为都是有用的**（各自服务不同 `mappings` 行的工程）。已落地：

- **mojmap 层**（上游页原文；适用 `loom.officialMojangMappings()` 工程）：`Registry.register(BuiltInRegistries.SOUND_EVENT, Identifier.fromNamespaceAndPath(MOD_ID, "metal_whistle"), SoundEvent.createVariableRangeEvent(Identifier.fromNamespaceAndPath(MOD_ID, "metal_whistle")))`
- **Yarn 层**（适用 `net.fabricmc:yarn` 工程，本仓 scaffold 钉法）：`Registry.register(Registries.SOUND_EVENT, Identifier.of(MOD_ID, "metal_whistle"), SoundEvent.of(Identifier.of(MOD_ID, "metal_whistle")))`

| 上游页（mojmap） | Yarn 等价 | 出处 |
| --- | --- | --- |
| `BuiltInRegistries` | `Registries`（另有 `BuiltinRegistries`，小写 i） | `net.minecraft.registry.Registries` |
| `Identifier.fromNamespaceAndPath(a,b)` | `Identifier.of(a,b)` | javap @ yarn 1.21.11+build.6 |
| `SoundEvent.createVariableRangeEvent(id)` | `SoundEvent.of(id)` | javap @ yarn 1.21.11+build.6 |

**不删原名**——所加的是「并列 + 逐名对照 + 同一工程只编译其 `mappings` 那一层」的警告。8 面镜像已刷；`assert-skill-mirrors` 拒=0、`assert-skill-yarn-attest` 红 0。

另注：`fabric/1.18.2` 属另一种情形（Yarn 1.18.2 的 `SoundEvent` 无任何静态工厂，仅构造器），两套名无法并列，维持构造器写法。

## §8.27 fabric/1.21.11 补 Yarn 层（5 技能）——逐名带出处的换名表

承 §8.26，把 `fabric/1.21.11` 里正文用 mojmap 的技能补上 Yarn 层。**换算中轴** = Mojang 官方 `client-1.21.11.txt`（落 `F:\MC_GAME\mappings\`，只当中轴不入库）+ 本档 `yarn-mappings.sqlite`；每条另以 **javap @ yarn 1.21.11+build.6** 复核。

| mojmap | Yarn | 依据 |
| --- | --- | --- |
| `Holder<X>` | `RegistryEntry<X>` | chain |
| `Registry#registerForHolder(..)` | `Registry#registerReference(..)` | javap |
| `MobEffect` / `MobEffectCategory` / `MobEffectInstance` | `StatusEffect` / `StatusEffectCategory` / `StatusEffectInstance` | javap |
| `MobEffect#shouldApplyEffectTickThisTick(int,int)` / `#applyEffectTick(..)` | `StatusEffect#canApplyUpdateEffect(int,int)` / `#applyUpdateEffect(..)` | javap |
| `Player#giveExperiencePoints(int)` | `PlayerEntity#addExperience(int)` | javap |
| `Potion` / `Potions`（`world.item.alchemy`） | `Potion` / `Potions`（`net.minecraft.potion`） | chain |
| `LevelBasedValue#calculate(int)` | `EnchantmentLevelBasedValue#getValue(int)` | javap |
| `ResourceKey#create(..)` | `RegistryKey#of(..)` | javap |
| `Entity#blockPosition()` | `Entity#blockPos()` | chain |
| **`Registries`（常量表）** | **`RegistryKeys`** | chain |
| **`BuiltInRegistries`** | **`Registries`** | chain |
| **`BuiltInRegistries.MOB_EFFECT`** | **`Registries.STATUS_EFFECT`**（字段名也换） | javap |
| `Level` / `ServerLevel` / `BlockGetter` / `Vec3` / `EntitySpawnReason` / `EnchantedItemInUse` | `World` / `ServerWorld` / `BlockView` / `Vec3d` / `SpawnReason` / `EnchantmentEffectContext` | chain |

**三个易错点**（已写进各技能表）：① mojmap `Registries` 与 `BuiltInRegistries` 对应的是 yarn 的**两个不同类**（`RegistryKeys` / `Registries`），名字撞车；② `MOB_EFFECT`→`STATUS_EFFECT` 这类**字段名**也会换；③ `Identifier.fromNamespaceAndPath` → `Identifier.of`。

改动面：`mc-effect` / `mc-potion`（+Yarn 代码块）、`mc-enchantment` / `mc-multiblock`（扩表）、`mc-model`（一处 inline）。`mc-particle` / `mc-advancement` 经查无需改（前者正文即 Yarn；后者命中为 prose 警告）。门：mirrors 拒=0、yarn-attest 红 0。

## §8.28 逐块真编译的结果：3 处 Yarn 名写错 + 1 处旧名已换

把 1.21.11 技能里的代码块逐块落成独立 `.java`，分别编译进真工程（Yarn 工程 5 文件 / mojmap 工程 4 文件，两侧均带对照臂）。**mojmap 层 4/4 PASS；Yarn 层首跑红 3 处，修正后 5/5 PASS。**

| # | 我写的 Yarn 名 | 真编译报错 | 真构件结论 | 处理 |
| --- | --- | --- | --- | --- |
| 1 | `EnchantmentEntityEffect#codec()` | 未覆盖抽象方法 `getCodec()` / `@Override` 不成立 | Yarn 抽象方法名是 **`getCodec()`**（mojmap 才是 `codec()`） | 改 `getCodec()` + 表加行 |
| 2 | `Entity#blockPos()` | `找不到符号: 方法 blockPos()` | mojmap `blockPosition()` 在 Yarn 是方法 **`getBlockPos()`**；**`blockPos` 是同名字段**（`fields.name_official=aW`） | 改 `getBlockPos()` + 表加「字段/方法撞名」告警 |
| 3 | `BrewingRecipeRegistry.Builder#addMix(..)` | `找不到符号: 方法 addMix(...)` | Yarn 该 Builder 只有 `registerItemRecipe` / `registerPotionType` / **`registerPotionRecipe`** / `registerRecipes` | 改 `registerPotionRecipe` + 订正「方法名以盘上为准」的错误结论 |

**教训（写进判据）**：链式换算（Mojang `client.txt` → 本档 yarn sqlite）在「mojmap 同名字段与方法」处会选错成员——本例 `blockPosition` 的字段与方法 obf 名同为 `aW`，链选了字段（`blockPos`）。**成员级必须再走一遍 javap 真构件**；而「javap 里有这个名字」也不等于「这段代码编得过」，最终以真编译为准。

**顺手核掉/纠正的既有未核实**
- `mc-effect` `MobEffectInstance` 重载 → 7 个公开构造器（两侧同形）。
- `mc-potion`：`Potion` 两侧都只有 `(String, …EffectInstance...)` 一个构造器；`Potions.WATER` 是 `RegistryEntry<Potion>`；`BUILD` 的 lambda 形参是 vanilla `BrewingRecipeRegistry.Builder`（`BuildCallback.build(..)`）；`registerPotionRecipe` **存在**。
- `mc-multiblock`：FAPI `FabricBlockEntityTypeBuilder.create(factory, Block...).build()`、`Factory.create(BlockPos, BlockState)`；vanilla `BlockEntityType` 无公开 Builder；`BlockView#getBlockEntity/getBlockState` 返回类型；`BlockPos.iterate/stream`；`VoxelShapes.union`；**`BlockEntity` 序列化是 `writeData(WriteView)` / `readData(ReadView)`，原写 `writeNbt`/`readNbt` 已纠正**。
- 仍留未核实（本轮不碰）：药水 lang 键、`AnyOf.valueEffects`、mc-model 的 datagen/uvlock。

门：mirrors 拒=0、yarn-attest 红 0、8 面 48/48。


## §8.29 「全部核对」：42 项未核实逐条清账（真构件 + 真编译 + 上游发布源）

范围 = `fabric/1.21.11/.cursor/{skills,rules}` 全量 grep（初盘 42 项 / 49 文件）。核对三档：① 本档真构件 `javap`（Yarn `1.21.11+build.6`、mojmap `hash.2198`、第三方 jar）；② 真工程 `compileJava`（Yarn `F:\MOD_TEST\dev\fabric-1.21.11`、mojmap `F:\MOD_TEST\cc5\proj`）；③ 上游发布源（Modrinth API）。

| 文件 | 原未核实 | 核对结果 | 处置 |
| --- | --- | --- | --- |
| mc-advancement | `.display` 七参 / `addCriterion` 第二参 / requirements / telemetry / `AbstractCriterion#trigger` / `CriteriaTriggers.register` / `RegistryLookup` / `Strategy` / `DisplayInfo` | mojmap `.display` 是 **8 参**；`addCriterion(String, Criterion<?>)`；`AdvancementRequirements.allOf/anyOf`；`sendsTelemetryEvent()`；`trigger` 是 protected；`register` 在裸 jar 里 private、**靠 FAPI `fabric-transitive-access-wideners-v1` 的 transitive-accessible 才可调**；`RegistryLookup` ↔ `RegistryEntryLookup.RegistryLookup`；`Strategy` ↔ `CriterionMerger`；`DisplayInfo` 类存在 | 全部改写；+ Yarn 等价块（`create/criterion/build`） |
| mc-ai | `Goal` 生命周期 | 抽象方法 7 个 + `setControls`（两侧同名） | 改写 |
| mc-cloth-config | 整节 API | 21.11.153 jar 里 `ConfigSerializable` / `ClothConfigAddon` / `ClothConfigScreenBuilder` / `ClothConfigBuilder` / `ConfigEntry.BoolOption.createBuilder` **全部 0 命中**；真实 API = `AutoConfig` + `ConfigData` + `ConfigHolder` + `GsonConfigSerializer`、`ConfigBuilder` + `ConfigCategory#addEntry` + `ConfigEntryBuilder` | **按真 jar 重写整篇** |
| mc-compat-jei | `REIPluginClient` / `registerEntries(RegisterClientPluginsEvent)` | 真接口是 `REIClientPlugin`，参数是 `EntryRegistry`；`rei_client` 入口键由 REI 自身 `fabric.mod.json` 证实 | 改写 |
| mc-enchantment | `AnyOf.valueEffects` | 1.21.11 两层都没有 `AnyOf`；mojmap 是 `AllOf.valueEffects(...)`，Yarn 是 `AllOfEnchantmentEffects.allOf(...)` | 纠正 + 表加行 |
| mc-fluid | `FlowableFluid` 构造/抽象面 | public 无参构造；7 个抽象 + `Fluid` 10 个抽象；`getVelocity` 是 **public**（真编译抓出我写成 protected） | 补骨架 + 改可见性 |
| mc-item / rules/03 | `FabricItemGroup.builder()` 方法名 | `displayName` / `icon` / `entries` / `special` / `noRenderedName` / `noScrollbar` / `texture` / `build`（真编译通过） | 改写 |
| mc-kotlin | FLK 兼容矩阵 | Modrinth：`1.14.1+kotlin.2.4.20` 的 `gameVersions` 逐字含 `1.21.11`（release） | 改写 |
| mc-model | `BlockModelGenerators` 三名字 / `uvlock` | Yarn 无 `BlockModelGenerators`（只有 `BlockStateModelGenerator`）；`registerSingleton` / `registerCubeAllModelTexturePool` 存在；`registerSimpleItemModel` 两侧都没有；`uvlock` 在原版 blockstates 有 131 个用例（`"uvlock": true`） | 改写 + Yarn 代码块 |
| mc-potion | 药水 lang 键 | 原版 `en_us.json`：`item.minecraft.potion.effect.<path>`（另有 splash / lingering 前缀） | 补键格式 |
| rules/01-registry | `fabric-attachment-api-v1` | 真模块 id = **`fabric-data-attachment-api-v1`**（jar 内 `fabric.mod.json`） | 改写 |
| rules/05-events + mc-events | `BlockEvents` / `ItemEvents` 常量 | `USE_ITEM_ON` / `USE_WITHOUT_ITEM`、`USE_ON` / `USE`（真 FAPI jar javap） | 改写 |
| rules/10-gui | `ScreenEvents.AFTER_INIT/BEFORE_INIT` | 两常量均存在（真 FAPI jar javap） | 改写 |

**真编译台账**（每个都是 `gradlew compileJava`，非推断）：
- `cc5`（mojmap）：`CriteriaTriggers.register` 臂 PASS（证明 FAPI AW 生效）；`Registry.register(BuiltInRegistries.TRIGGER_TYPES, …)` 臂 PASS。
- `cc6`（Yarn）：advancement 全链（`create/display/criterion/build` + 自定义 `AbstractCriterion`）PASS。
- `cc7`（Yarn）：model 生成器 + fluid 骨架 + `FabricItemGroup.builder()` PASS；**首跑红 1 处**（`getVelocity` 写成 protected），改 public 后 PASS。
- `cc8`（Yarn + 本地 cloth-config-21.11.153 jar）：`AutoConfig` 路线与 `ConfigBuilder` 路线 PASS；`getConfigScreen` 报 `[removal]` 弃用警告（已写进技能）。
- `cc9`（Yarn + 本地 REI 21.11.816 jar）：`implements REIClientPlugin` + `registerEntries(EntryRegistry)` PASS。

**剩余 12 处 grep 命中**全部是语料边界说明（「页内没有的签名一律留 TODO」「本档语料未出现」）或工具用法说明，不是未核实的 API 断言。

**门**：`assert-skill-mirrors` ok（漂移 0 / 缺件 0）、`assert-skill-yarn-attest` 红 **0**（清单 532 件）、`assert-rules-api-names` rc=0（GREEN）、`assert-authoring-lint` GREEN、`assert-skill-mappings-key` GREEN。


## §8.30 签收台账专项清理：幻影名退账 + 13 档 Cloth/REI 技能按真 jar 重写

`external-apis-signoff.tsv` 从 **71 → 56** 条，删除 15 个幻影名：`ConfigSerializable`、`ClothConfigAddon`、`ClothConfigBuilder`、`ClothConfigScreenBuilder`、`BoolOption`、`IntSliderOption`、`EntryBuilder`、`createBuilder`、`ClothConfig`、`getOrCreateModConfig`、`setDefaultTitle`、`setGlobalErrorSupplier`、`setNewDefaultValue`、`REIPluginClient`、`RegisterClientPluginsEvent`。

**退账前先清引用**：台账是「逐名签收」，直接删行会让仍引用假名的 13 个 fabric 档转红。处理顺序：

1. 下载并 javap 每档真实构件：cloth-config-fabric 4.14.64 / 5.3.63 / 6.5.133 / 10.0.96 / 11.1.136 / 13.0.114 / 15.0.127 / 16.0.143 / 21.11.153；REI-fabric 17.0.807 / 18.0.815 / 20.0.811 / 21.9.813 / 21.11.816。
2. 用真 API 重写 Cloth 技能：`AutoConfig.register` + `ConfigHolder` + `GsonConfigSerializer`（路线 A），`ConfigBuilder.create().setParentScreen().setTitle()` + `getOrCreateCategory` + `entryBuilder()` + `startBooleanToggle/startIntSlider`（路线 B）。1.14.4 无可核实构件，改为「禁止默写」形态。1.19.4 依赖保持 `versions.json` 的 `state=commented`。
3. 用真 API 重写 REI 技能：`REIClientPlugin#registerEntries(EntryRegistry)`；无已核实构件的 8 档改为「未核实，禁止默写」。
4. 删除台账 15 行；`ledger-audit.cjs` 复核 56 条全部仍被引用（DEAD=0）。

**门**：mirrors 绿、yarn-attest 红 0、rules-api-names rc=0、authoring-lint 绿、mappings-key 绿、prose-name-roster 绿（违规 36 = 基线 36，新增 0）、第 8 步 `test-scripts` 全链通过。

**prose-name-roster 首跑红 21 条**：重写后的 REI 散文清单行列了 `CategoryRegistry` / `DisplayRegistry` / `ScreenRegistry` / `EntryRegistry` / `InputMethodRegistry`，该门只认本档 FAPI 摘要与 yarn vanilla 类名，外部库的 `*Registry` 名不在其中。改法 = 清单行只留方法名（`registerCategories` / `registerDisplays` / `registerScreens` / `registerEntries` / `registerInputMethods`），类名仍出现在围栏与 javap 出处行；没有改基线、没有关任何门。


## §8.31 二轮复核：10 处门禁盲区内的内容缺陷

对上轮 42 项清账做独立复核（真构件 javap + jar 中央目录 + jar 内 `version.json`/`pack.mcmeta`），抓到 10 处**门禁覆盖不到**的缺陷，已全部修正。

**会让照抄代码出错的 4 处**：

1. `fabric/1.21.11/.cursor/skills/mc-ai.md`：`Goal` 写成「7 个抽象方法」；javap @ yarn 1.21.11+build.6 实际只有 `canStart()` 抽象，其余 6 个是 concrete。已改为「只有 `canStart()` 抽象」。
2. `fabric/1.21.11/.cursor/skills/mc-cloth-config.md` 路线 B：用了 `Text.literal` 但 import 面缺 `net.minecraft.text.Text`。已补。
3. 同文件：`ConfigEntry` 嵌套类型写 12；jar 中央目录实际 13（11 注解 + `Gui$EnumHandler$EnumDisplayOption` 枚举 + `Gui` 类）。已改 13。
4. `fabric/1.21.11/.cursor/skills/mc-model.md`：称 `BlockModelGenerators.registerSimpleItemModel()` 两侧都没有；mojmap `net.minecraft.client.data.models.BlockModelGenerators` 实有包私有 `void registerSimpleItemModel(Block, Identifier)`。已改为「mojmap 存在但包私有，Yarn 无此名」。

**文档自相矛盾/过期的 6 处**：

5. `fabric/1.21.11/.cursor/skills/mc-potion.md`：把 `PotionContents` 与 `PotionUtil` 一起判死；`PotionUtil` 确无，但 mojmap `net.minecraft.world.item.alchemy.PotionContents` 存在（Yarn `PotionContentsComponent`）。已拆开写。
6. `fabric/1.21.11/knowledge/common/verified-api-1.21.11.md`：「未核实」段仍列 `FabricItemGroup.Builder` 方法名、`ItemGroupEvents.ModifyEntries` 方法名、`ToolMaterial` 六组件；三者已按真构件核实（8 个 builder 方法 / `modifyEntries(FabricItemGroupEntries)` / `incorrectBlocksForDrops,durability,speed,attackDamageBonus,enchantmentValue,repairItems`）。已移入「已核实（真构件 javap 补充）」。
7. `fabric/1.21.11/knowledge/common/datapack-format.md` 与 `knowledge/version-changes/1.21.x.md`：数据包格式写「未核实」；1.21.11 jar 的 `version.json` 给出 `data_major=94, data_minor=1`，jar 内原版 datapack `pack.mcmeta` 是 `min_format:[94,1]` / `max_format:94`。已改为实测值。
8. `fabric/1.19.4/.cursor/skills/mc-cloth-config.md`：TODO 说「坐标与 API 面一律未核实」，同文件 19/104/110 行又说 10.0.96 已 javap 核实。已改为「state=commented；坐标 10.0.96 已核实」。
9. 六处出处头（`mc-advancement` / `mc-ai` / `mc-effect` / `mc-enchantment` / `mc-model` / `mc-potion`）声称「只来自语料」，但正文已有 `javap @ yarn 1.21.11+build.6` 的成员。已改为「语料 + 真构件 javap」，并说明 javap 条目标注方式。
10. `mc-advancement.md` 的「telemetry 开关无证据」与同文件 145 行「开关是 `sendsTelemetryEvent()`」矛盾；`mc-multiblock.md` 指向已不存在的 Decision Flow TODO。两处已改写。

**复核边界**：以上均只改源稿/档内 knowledge，不改代码逻辑；`fabric/1.21.11` 与 `fabric/1.19.4` 镜像已刷。六道内容门 + 第 8 步 `test-scripts` 复跑全绿（mirrors / yarn-attest 红 0 / rules-api-names 红 0 / authoring-lint ok / mappings-key ok / prose-name-roster 新增 0 / step8 通过）。


## §8.32 独立审计器 `audit-content-claims` 与三类映射层缺陷

门禁只证「名字有出处 / 存在于某层」，不证「这个 FQCN 属于本档映射层」。按用户裁定把这类盲区做成独立脚本 `mcp-server/scripts/audit-content-claims.mjs`（只读、**不入门链**），4 个模块：

1. 构件索引：本档 Yarn / mojmap 合并 jar + FAPI 模块 + 外部库 jar（cloth / REI）的类名、嵌套类型、javap 成员。
2. 断言核对：`不存在` 断言、Goal 抽象方法数、嵌套类型计数、映射对照表行、`versions.json` 坐标。
3. 文档一致性：出处头、自相矛盾、悬空引用、版本字段。
4. 代码面：import 缺漏、**映射层混用**（FQCN 不在本档 Yarn 层）、可选 `--compile`（javac 真编译 + 片段包装）。

### 缺陷 A1：fabric/1.21.11 mc-ai 的 8 条 mojmap import

`fabric/1.21.11/.cursor/skills/mc-ai.md` 的 import 块逐字抄自 mojmap 参考文件：`net.minecraft.world.entity.PathfinderMob`、`...ai.goal.LookAtPlayerGoal` / `RandomLookAroundGoal` / `RandomStrollGoal` / `TemptGoal`、`net.minecraft.world.entity.animal.cow.Cow`、`net.minecraft.world.item.Items` / `...crafting.Ingredient`。本档 frontmatter 是 `mappings: yarn`。

**改动**：import 与构造表换 Yarn 名（`PathAwareEntity` / `LookAtEntityGoal` / `LookAroundGoal` / `WanderAroundGoal` / `CowEntity` / `net.minecraft.item.Items`）；`TemptGoal` 按 javap 改成第 3 参 `Predicate<ItemStack>` 的 `stack -> stack.isOf(Items.WHEAT)`；属性块改 `DefaultAttributeContainer.Builder` + `EntityAttributes.*`；映射表补 `Items` / `Ingredient` / `Attributes` 三行（这三行已用 `data/_yarn-mojmap-pairs/` 对 1.16.5–1.21.11 逐档 join 核过）。

**出处**：1.21.11 合并 jar 中央目录存在 `entity/mob/PathAwareEntity`、`entity/ai/goal/{WanderAroundGoal,LookAtEntityGoal,LookAroundGoal,TemptGoal}`、`entity/passive/CowEntity`、`item/Items`、`recipe/Ingredient`、`entity/attribute/EntityAttributes`；`javap` 给出 `TemptGoal(PathAwareEntity,double,Predicate<ItemStack>,boolean)`、`WanderAroundGoal(PathAwareEntity,double)`、`LookAtEntityGoal(MobEntity,Class<? extends LivingEntity>,float)`、`LookAroundGoal(MobEntity)`、`DefaultAttributeContainer$Builder.add(RegistryEntry<EntityAttribute>,double)`。

### 缺陷 A2：同一文件的两个 mojmap 成员名（类名换对后仍抄不出）

只换类名还不够：`registerGoals()` / `goalSelector.addGoal(int, Goal)` 都是 mojmap 成员名。1.21.11 Yarn 合并 jar 的 `javap`：`MobEntity` 只有 `protected void initGoals()`，`GoalSelector` 只有 `public void add(int, Goal)`；没有 `addGoal` / `registerGoals`。**这句话是拼成完整类真编译时抓到的**（`cannot find symbol: method addGoal`），import 检查与静态规则都看不到。

**改动**：标题/正文/属性 TODO 改成 `initGoals()` + `add(int, Goal)`；新增一段完整 Yarn 写法（mojmap 原文块保留并标注）；映射表加两行成员对照，并注明「成员名只按 1.21.11 javap 核过，未做 13 档 join」。

### 缺陷 B：fabric/1.21.8 与 1.21.10 mc-gametest 的整段 mojmap 代码

两档服务端测试代码块用 `net.minecraft.gametest.framework.GameTestHelper`、`net.minecraft.world.level.block.Blocks`、`assertBlockPresent`、`succeed`、`setBlock`，并断言「本档没有 TestContext / expectBlock / complete」。这与本档 `mappings: yarn` 冲突，也与同文件末尾的映射表（`GameTestHelper → TestContext`）自相矛盾。

**改动**：代码块换 `net.minecraft.test.TestContext` / `net.minecraft.block.Blocks` / `expectBlock` / `complete` / `setBlockState`；改写「本档没有 TestContext」的相反断言与 TODO 清单；保留 mojmap→Yarn 对照表并注明上游页面是 mojmap。

**出处**：1.21.8 / 1.21.10 合并 jar 不存在 `net/minecraft/gametest/framework/GameTestHelper.class`，存在 `net/minecraft/test/TestContext.class`；`javap` 实测 `expectBlock(Block,int,int,int)`、`complete()`、`setBlockState(int,int,int,Block)`；FAPI `fabric-gametest-api-v1` 的 `CustomTestMethodInvoker` 方法参数在 intermediary 是 `class_4516`（即 `TestContext`），`@GameTest` 注解存在于 `net.fabricmc.fabric.api.gametest.v1`。

**真编译**：上述 4 个块（1.21.8 / 1.21.10 × 服务端/客户端）用本档 Yarn 合并 jar + `F:/MOD_TEST/dev/fabric-<ver>/build/loom-cache/remapped_working` 里同组的 46 个 Yarn 重映射 FAPI jar，`javac` 全部 0 退出；`mc-ai` 的 Goal 注册 + 属性块拼成完整 `MiniGolemEntity` 后同样 0 退出。

### 检出方法（可复用）

`checkLayerMixups`：对每个 java 围栏的 `import net.minecraft.*`，在本档 Yarn 索引里查该 FQCN —— 有则跳过；Yarn 层没有、而 mojmap 层有（1.21.11）或 `data/_yarn-mojmap-pairs/yarn-mojmap-<ver>.json` 的 mojmap→Yarn 对照表里有 ⇒ 判红，并给出 Yarn 建议名。

**本轮补掉的漏检**：该规则最初只认「本档 mojmap 合并 jar」，而本机只有 1.21.11 有；其余 12 个 Yarn 档被静默跳过。改用 pairs 表后，13 个 Yarn 档全部实跑（26.1.2 无 Yarn 层，按设计跳过）。

### 本轮读数

- `--all` 静态：fix 前 `fail=8`（A1）→ 补 A2/B 后 `fail=0 / unverifiable=6`（6 条为缺构件，不能判不存在）。
- `--all --compile`：fix 前 `fail=6`（含 3 条 REI 路径未接 + 3 条 gametest）→ fix 后 `fail=0 / unverifiable=21`。
- 已知边界：① 层混用检查只扫 `import` 行，无 import 的裸简单名无法可靠判归属，只能靠真编译或人工 javap；② FAPI 模块缓存 jar 是 mojmap 重映射件，与本档 Yarn 合并 jar 不同层，`cannot access <FAPI 类>` 一律归「不可判定」，要真编译须改用各档 `remapped_working` 的 Yarn 件；③ 含 `...` 占位的教学片段跳过编译。

## §8.33 多平台扩面：FAPI 包名缺陷与构件覆盖修正

§8.32 的检查器只覆盖 `fabric/`。本轮按用户要求扩到全部平台树，并修正了三处「看着绿、其实没判」的覆盖漏洞。

### 构件面扩面（`artifactSet`）

| 平台 | 判据构件 | 期望层 |
| --- | --- | --- |
| fabric / quilt（≤1.21.11） | 本档 Yarn 合并 jar + mojmap 合并 jar；缺失时依次回退 `F:/MC_GAME/_oracle-jars/mc/minecraft-<v>-yarn-build.*.jar`、`F:/MC_GAME/fabric-<v>/.gradle/loom-cache/<v>/**/minecraft-project-@-mapped.jar` | yarn |
| fabric 26.x | `F:/MC_GAME/fabric-<v>/.gradle/loom-cache/minecraftMaven/**/*merged*.jar`（已去混淆）；FAPI 模块版本由 umbrella POM 解析 | mojmap |
| neoforge | `F:/MOD_TEST/dev/neoforge-<v>/build/moddev/artifacts/*-merged.jar` + fancymodloader loader jar | mojmap |
| forge / rift | `_mapped_official_` / `_mapped_parchment_`（mojmap）或 `_mapped_snapshot_`（MCP）+ fmlcore / forgespi / fmlloader | 随构件层 |
| forge 1.7.10–1.11.2 / liteloader / modloader | 无 mapped jar 时读 `data/<platform>_<v>/mappings/joined.srg|tsrg` 的 MCP 类名表 | mcp |
| bedrock | 无 Java 构件，只跑 provenance / contradiction / dangling 三项 | — |

三个具体修正：

1. **TSRG 解析**：`loadMcpNames` 原来只认 `joined.srg` 的 `CL:` 行，1.13.2 的 `joined.tsrg` 是「顶格 `obf named` + 缩进成员」格式，导致 rift 的 MCP 名表为 0。补 TSRG 解析后 rift/1.13.2 读到 4027 个类名。
2. **同版本 forge 表回退**：liteloader / rift 没有自己的 `mappings/` 目录；MCP 名是 MC 版本属性，改为回退 `data/forge_<v>/mappings`（liteloader 三档分别读到 2541 / 2980 / 3344 个类名）。
3. **精确 FAPI 件**：`helpers` 目录里可能残留上一次构建（另一 MC 版本）的 jar，且 `modules-2` 里是 intermediary 层件。改为搜四个根（`MOD_TEST/dev` 与 `MC_GAME` 各自的 `build/loom-cache/remapped_working` 与 `.gradle/loom-cache/remapped_mods`），优先 `remapped.*`，否则按版本标签过滤；26.1.2 的模块件无 MC 标签，改由 umbrella POM（`fabric-api-<ver>+26.1.2.pom`）解析精确模块版本。编译类路径只用本档精确 remapped 件，索引面才用全局件做类名存在性检查。

### 缺陷 C：`ClientPlayNetworking` 的包名（fabric 1.16.5–1.21.11）

九个档的 `06-networking` 规则 / `mc-networking` 技能 / 代码模式都写 `import net.fabricmc.fabric.api.networking.v1.ClientPlayNetworking`。本机 `fabric-<v>` 的 Loom 缓存（`build/loom-cache/remapped_working` 或 `.gradle/loom-cache/remapped_mods`）里，`fabric-networking-api-v1` 的类实际在 `net/fabricmc/fabric/api/client/networking/v1/ClientPlayNetworking.class`：1.14.4（1.0.1）/ 1.16.5（1.0.5）/ 1.17.1（1.0.14）/ 1.18.2（1.0.24）/ 1.19.4 / 1.20.1 / 1.20.4 / 1.21.1 / 1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11 全部一致。另扫 16 个 `fabric-networking-api-v1` 模块版本（1.0.1+ 起），全部 `old=0 / new=1`，没有旧包形态。

**改动**：18 个源文件改成 `...api.client.networking.v1.ClientPlayNetworking`（1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 / 1.21.3 各 rule+skill；1.21.1 rule+code-patterns；1.21.11 rule+version-changes）。1.14.4 的文档用 v0 `ClientSidePacketRegistry`，没有这个 import，未改。

### 缺陷 D：fabric 1.14.4 / 1.16.5 / 1.17.1 的缺 import

新增的 Yarn 构件让这三档第一次真正跑上 `checkImports`，抓出四处：

- `fabric/1.14.4/.cursor/skills/mc-capability.md`：`AttackEntityCallback` 回调返回 `ActionResult.PASS`，但没有 `import net.minecraft.util.ActionResult;`（1.16.5 / 1.17.1 同文同缺）。
- `fabric/1.14.4/.cursor/rules/06-networking.mdc`：`Identifier` 与 `ServerPlayerEntity` 都是裸用无 import。

出处：`minecraft-1.14.4-yarn-build.18.jar` / `minecraft-1.16.5-yarn-build.10.jar` / 1.17.1 的 `minecraft-project-@-mapped.jar` 中央目录含 `net/minecraft/util/ActionResult`、`net/minecraft/util/Identifier`、`net/minecraft/server/network/ServerPlayerEntity`。

### 缺陷 E：forge 1.16.5 渲染器类名（`LivingRenderer` / `BipedArmorLayer`）

1.16.5 的 mapped jar（`forge-1.16.5-36.2.34_mapped_official_1.16.5.jar`）中央目录只有 `net/minecraft/client/renderer/entity/LivingRenderer.class` 与 `.../layers/BipedArmorLayer.class`；`LivingEntityRenderer` / `HumanoidArmorLayer` 是 1.17+ 的名字。该档四处写错：`skills/mc-entity/SKILL.md`（代码块 / Decision / 常见错误）、`.cursor/rules/04-entity.mdc` 渲染器示例、`code-patterns/03-entity-patterns.md` 示例（同时把 armor layer 写成 `HumanoidArmorLayer`）、`knowledge/antipatterns/entity.md`（标题与「正确」示例自相矛盾）。另 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 的 `knowledge/antipatterns/entity.md` 有一处同源拷贝误伤：标题写「LivingEntityRenderer（不存在）」，但该档该类存在，示例真正对比的是「原始类型 vs 带泛型」。标题已改为「渲染器漏写泛型参数（原始类型）」。

### 本轮读数（57 档）

- 静态 + 编译合计：`fail=0 / unverifiable=22`；22 条全在 `compile` 腿，成分为：缺上下文常量 `MOD_ID`、跨加载器 porting 示例（architectury / FabricLoader / NeoForge import 不在本档类路径）、含 `...` 占位片段、示例包 `com.example.examplemod`。
- 档位覆盖：fabric 14、forge 15、neoforge 10、quilt 10、liteloader 3、rift 1、modloader 3、bedrock 1。fabric 14 档现在全部有本档游戏 jar；1.16.5 / 1.17.1 / 26.1.2 的 FAPI 也已有精确件（1.17.1 50 个模块，26.1.2 由 POM 解析）。
- 编译支撑件补齐：`netty-buffer/common/codec`、`guava`、`org.jetbrains:annotations`、`org.jspecify:jspecify`（1.21.11 的 `PigEntity` 父链带 JSpecify 注解，缺它会让 javac 报 `cannot access Nullable`）。

### 覆盖边界量化（本轮实测）

| 平台 | java 围栏 | 含 import | 可编译（import+class） |
| --- | --- | --- | --- |
| fabric | 1394 | 78 | 32 |
| forge | 2265 | 40 | 21 |
| neoforge | 150 | 5 | 2 |
| rift | 3 | 3 | 2 |
| quilt / liteloader / modloader / bedrock | 0 | 0 | 0 |

code 级检查（缺 import、层混用、真编译、FAPI import 存在性）只作用于含 import 的 126 个围栏；其余约 3686 个 java 围栏不含 import，只有 prose 级检查（不存在断言、矛盾、悬空引用、映射对照表）。这是内容形态的限制：多数示例是片段而非完整类，无法可靠判定裸简单名的归属。`knowledge/libs/**`、`common_skill/**`、`community_knowledge/**` 不在本审计器扫描面内；bedrock 的 JSON / Molang 由 `validate_bp_json` / `validate_addon_manifest` 等工具负责。

### 仍存边界（未静默）

- **modloader 三档无 MCP 名表、无构件** ⇒ 只跑 provenance / contradiction / dangling（三档 `.cursor` 下 Java 围栏数均为 0，当前不损失 Java 面检出）。
- **forge 1.7.10–1.11.2 无 mapped jar** ⇒ 只按 MCP 类名表判存在性与缺 import，不能真编译（F/D 盘只找到 Forge universal 件，没有 mapped MC jar；五档 Java 围栏数均为 0，当前不损失编译覆盖）。
- **成员名（`initGoals` / `add`）仍只按 1.21.11 核过**，未做逐档 join；成员名缺陷靠真编译兜底。

## §8.34 片段补全编译（`--complete` / `--fragment`）与三处可见性/构造器缺陷

§8.33 的代码腿只编译「自带 import 且完整类」的 126 个围栏；其余约 3686 个 java 围栏只有 prose 级检查。本轮把「取片段 → 补全 → 编译」做成同一审计器的模式：

- `--complete`：对每个 java 围栏补 `MOD_ID` / `MOD_NAME` 字面量、`ExampleMod.LOGGER` → `LOGGER` + slf4j 字段、按本档层唯一性自动补 import（JDK 常用类 + expected/api/fapi/external 层），再把片段包进 `class __Frag` 编译。`__Frag` 类型不匹配、缺抽象方法、缺 super 构造一律归「不可判定」；只有落在已解析类型上的成员名/签名错误、可见性错误才判红。
- `--fragment <file> --packs <档>`：单片段入口，复用同一套补全与编译，输出 compile findings；退出码 1 = 有 fail。
- 误报治理：跳过 `porting/`、反例块、前 8 行声明 mojmap/参考文件的块；只取**第一条 error 块**（javac 常在 400 字符内续报次生错误，曾把 `MyNetworking` 未知变量误判成成员名缺陷）；第三方 shadowed/relocated 类不进索引（Cloth Config 内嵌 toml 的 `Identifier` 曾让 `net.minecraft.util.Identifier` 变成歧义）；`jdkMap` 先于 `JDK_COMMON`（否则 `CompletableFuture` 永远不补 import）。
- 类路径收窄：只保留非 FAPI 底座 + 片段真正用到的类所在 jar；此前每个片段挂全档 50+ 个 FAPI 模块，冷缓存下单次 javac 可卡十几秒。

### 新抓到的内容缺陷（fabric/1.21.11）

1. **`ItemGroups.INGREDIENTS` 是 private**：`ItemGroups` 的 18 个常量在本档构件里全部 `private static final`，示例却直接引用；改为 `RegistryKey.of(RegistryKeys.ITEM_GROUP, Identifier.ofVanilla("ingredients"))`，并改正文「常量全部具名、类型都是 RegistryKey」的错误说法。`javac` 复跑 fail=0。
2. **`World.isClient` 是 private 字段**：1.21.10 / 1.21.11 的 `javap` 显示 `private final boolean isClient` + `public boolean isClient()`；1.21.3 / 1.21.4 / 1.21.8 及更早仍是 public 字段（所以不能全档替换）。改 1.21.11 的 rules 05/08、skills/mc-events、code-patterns 01/02 共 6 处为 `isClient()`。
3. **`MyTool extends Item` 缺构造器**：1.21.11 的 `Item` 只有 `Item(Item.Settings)`，`knowledge/antipatterns/item.md` 的「正确方案」隐式 `super()` 编译失败；补 `MyTool(Item.Settings settings) { super(settings); }`。同一模式在 1.14.4–1.21.3 八个档的「正确方案」里都存在，已一并补。

### 新抓到的内容缺陷（其他 fabric 档）

4. **1.17.1 `.saturation(1.0f)` 不存在**：本档 `FoodComponent.Builder` 只有 `hunger(int)` / `saturationModifier(float)`；「正确方案」改为 `saturationModifier`。
5. **1.18.2 `Screen.onClose()` 不存在**：本档 `Screen` 只有 `close()`（1.16.5 / 1.17.1 才有 `onClose()`，不能全档替换）；rules 10-gui 与 skills/mc-gui 两处改 `close()`。
6. **1.18.2 `conditionsFromItem` / `hasItem` 是 private**：`RecipeProvider` 里这两个 helper 在 1.18.2 是 `private static`，子类不能调；1.19.4+ 才变 `protected`。示例改用 `InventoryChangedCriterion.Conditions.items(Items.DIAMOND)`（public static），并改正文。另：1.17.1 的 `RecipeProvider` 不在本档 project mapped jar 里，未复跑。
7. **1.20.4 `renderBackground(DrawContext)` 不存在**：本档要求四参 `renderBackground(DrawContext, int, int, float)`；rules 10-gui 改为四参。
8. **1.20.4 mc-model 的 mojmap 参考块**：`Level` / `Player` / `InteractionResult` / `InteractionHand` / `SoundSource` / `setBlockAndUpdate` / `mayBuild` 全是 mojmap；已按本档 Yarn 改为 `World` / `PlayerEntity` / `ActionResult` / `Hand` / `SoundCategory` / `setBlockState` / `allowModifyWorld`。
9. **1.21.1 Block 回调签名**：`Block.onBreak` 返回 **`BlockState`**（不是 void）；`Block.onUse` 在本档**不再有 `Hand` 参数**；`Item.Settings` 没有 `maxDamageIfAbsent`（改 `maxDamage`）。code-patterns 01/02 已改。
10. **1.21.1 实体基类**：`MyEntity extends Mob` 但用 `WanderAroundFarGoal`（要 `PathAwareEntity`）与 `FollowParentGoal`（要 `AnimalEntity`）；改为 `extends PathAwareEntity` 并删掉动物专用的 `FollowParentGoal`。
11. **1.21.1 `LootTable.Builder.pool`**：本档签名是 `pool(LootPool.Builder)`，不是 `pool(Consumer<...>)`；示例改为 `new LootPool.Builder().with(...)`。
12. **缺 import（不是内容错误，但示例不可直接编译）**：`mc-command` / `mc-fabric-api` 的 `CommandRegistrationCallback` 代码块补 `CommandManager` / `EntityArgumentType` / `ServerPlayerEntity` / `Text`；`code-patterns/05` 补 `Identifier` / `LootPool` / `ItemEntry` / `Items`。补 import 后 `checkImports` 会把整块当「完整块」检查，这也是它们此前未暴露的原因。

### forge / neoforge / quilt 的复跑

- `--all --complete`（43 包：forge 15 + neoforge 10 + quilt 10 + liteloader 3 + rift 1 + modloader 3 + bedrock 1）：`fail=81 / unverifiable=1278`。
- 81 条的主因不是 81 个独立内容错误：`super.onLoad()` / `super.setRemoved()` / `super.load()` 等片段方法被包进 `__Frag` 后 `super` 指向 Object，属补全器误报（已把 `this.` / `super.` / 裸调用统一降为不可判定）；`Properties` 被补成 `net.minecraftforge.common.property.Properties`（已加 `BlockBehaviour.Properties` 上下文优先）；其余按根因修：`MyEntity extends Mob` → `PathfinderMob`（1.17.1–1.20.4 共 11 个文件）、`hurtAndBreak` 的 Consumer 收到的是实体不是槽位（1.19.4–1.20.4 三档）、`ForgeAdvancementProvider` 的构造参数与 `AdvancementGenerator` 接口（1.20.1/1.20.4）。
- 复跑 `--packs forge/1.20.1 --complete`：`fail=2`（`super.trigger` 片段误报 + datagen provider 结构）→ 修完 **`fail=0 / unverifiable=182`**。
- forge 1.13.2–1.16.5 / neoforge / quilt 未逐档复跑；这些档的 81 条里仍可能有真缺陷，不能按 1.20.1 的绿外推。

### 本轮读数

- `--packs fabric/1.21.11 --complete`：修前 `fail=17 / unverifiable=115` → 修完 `fail=0 / unverifiable=51`。
- `--packs fabric/1.14.4 --complete`：`fail=0 / unverifiable=42`（修掉 `MyNetworking` 误报后）。
- `--packs fabric/1.17.1,fabric/1.18.2 --complete`：`fail=0`（1.18.2 recipe / GUI / MyTool 修完）。
- `--packs fabric/1.19.4,fabric/1.20.1,fabric/1.20.4,fabric/1.21.1,fabric/1.21.3,fabric/1.21.11 --complete`：`fail=0 / unverifiable=284`。
- `--packs fabric/1.16.5,fabric/1.21.4 --complete`：`fail=0 / unverifiable=45`。
- 至此 fabric 14 档全部复跑绿：1.14.4 / 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 / 1.21.1 / 1.21.3 / 1.21.4 / 1.21.11 为显式复跑；1.21.8 / 1.21.10 / 26.1.2 在本轮全量跑中本就 0 fail 且未改内容。
- 全量 fabric `--all --complete`：修前 `fail=6 / unverifiable=512`；6 条已按上述根因修完。
- `--fragment` 正反例：`!world.isClient` → fail（`isClient has private access in World`）；`!world.isClient()` → `findings: []`。
- `--selftest`：21 臂。
- 审计器仍未入门链、未提交。

### 仍未覆盖

- 片段没有 import 且没有任何可唯一解析的 MC/FAPI 类 ⇒ 跳过（无上下文）；`__Frag` 内的 `this` 成员、缺抽象方法/构造器的部分类归不可判定。
- 编译腿不能替代真机 / GameTest：可见性、成员名、构造器能抓；逻辑、注册、事件时机抓不到。
- 26.1.2 的 FAPI 模块件在 `modules-2` 是未 remap 件，`cannot access ... bad class file` 一律不可判定；本档没有做精确 remap 件接入。
- forge 1.13.2–1.16.5 / neoforge / quilt 的全量复跑未做；只复跑了 forge 1.20.1。

## §8.35 全档复跑（57 档）与 7 条 fail 修复

首轮 `--all --complete`（fabric/forge/neoforge/quilt/liteloader/rift/modloader/bedrock，共 57 档）：`fail=7 / unverifiable=1818`。7 条全部落在 fabric/1.14.4（1）与 forge/1.14.4（2）/1.16.5（1）/1.17.1（1）/1.18.2（2）。

1. **fabric/1.14.4 `hitEntity` / `damageItem` 不是 Yarn 名**：`knowledge/antipatterns/item.md:67` 的「正确方案」用了 Forge/MCP 名。本档 `minecraft-1.14.4-yarn-build.18.jar` javap：Item 是 `postHit(ItemStack, LivingEntity, LivingEntity)`，ItemStack 是 `damage(int, T, Consumer<T>)`。改为 `postHit` + `stack.damage(1, attacker, entity -> { })`。
2. **forge/1.14.4 `onBlockExploded` 不存在**：`.cursor/rules/02-block.mdc:136`。本档 `_mapped_snapshot_20190719` javap：Block 只有 `onExplosionDestroy(World, BlockPos, Explosion)`；`onBlockExploded` 与 `wasExploded` 都不是本档签名。改方法名并改注释里的错误说法。
3. **forge/1.14.4 `Biome.Builder` 没有 `build()`**：`code-patterns/04-world-patterns.md:5`。javap 显示 `Biome$Builder` 只有 surfaceBuilder/precipitation/category/depth/scale/temperature/downfall/waterColor/waterFogColor/parent，`Biome(Builder)` 是 protected。示例改为 `MyBiome extends Biome` + `super(new Biome.Builder()...)`，注册 `MyBiome::new`。
4. **forge/1.16.5 `onPlace` 不存在、`wasExploded` 参数多一个**：`.cursor/rules/02-block.mdc:121`。本档构件里放置回调是 `setPlacedBy(World, BlockPos, BlockState, LivingEntity, ItemStack)`，`wasExploded` 是 3 参 `(World, BlockPos, Explosion)`。两处签名已改。
5. **forge/1.17.1 `hurtAndBreak` 的 Consumer 收实体**：`knowledge/antipatterns/item.md:89`。javap：`hurtAndBreak(int, T, Consumer<T>)`，lambda 参数是持有者实体，不是 EquipmentSlot；`slot -> attacker.getItemBySlot(slot)` 编译失败。改为 `entity -> { }`，并改注释。
6. **forge/1.18.2 两处 `Shift` 是注释被补成 import**：`mc-gui/SKILL.md:44`（`// Shift-click transfer logic`）与 `10-gui.mdc:75`（`// Shift-点击转移物品`）。补全器的 autoImport 把注释里的 `Shift` 当成类名，补了 `DensityFunctions.Shift`（private），于是报 `has private access` 并判红。autoImport 现在先剥离注释与字符串再取标识符；`--selftest` 加两臂（注释/字符串不补、代码里的仍补）。修正后这两块因 `MY_MENU` / `MyMenuTypes` 是片段外项目类，归 unverifiable，不再 fail。

复跑读数：

- `--packs fabric/1.14.4,forge/1.14.4,forge/1.16.5,forge/1.17.1,forge/1.18.2 --complete` → `fail=0 / unverifiable=615`。
- 第二轮 `--all --complete`（57 档）→ `fail=0 / unverifiable=1821`。
- `--selftest` → OK（23 臂）。
- `assert-skill-mirrors` → ok；`assert-skill-yarn-attest` → ok；`assert-skill-mappings-key` → ok；`assert-scaffold-rules-conflict` → ok；第 8 步 `test-scripts.mjs` → exit 0。

仍未覆盖：1821 条 unverifiable 是片段外上下文/类路径缺口（项目自定义类、缺抽象方法、`__Frag` 内 this/super），未逐条人工审；forge 1.16.5 的 `_mapped_official_` 构件实际是 MCP 类名，层标注偏差只影响 prose 层检查，不影响本轮 fail 判定。

## §8.36 1821 条 unverifiable 分诊：4 类判据缺口 + 11 处内容缺陷

> ⚠️ **本节末尾「4 类判据缺口已修」的说法当时是夸大的**：实测为 2 类完全修好（`-sourcepath`、MixinExtras）、2 类有残留（支撑件类 274→21、mojmap 判据只在有 mojmap 件的档成立）。3 个残留已在 **§8.38** 补掉并逐条复核，结论以 §8.38 为准。

上一轮留下的 1821 条 `unverifiable` 按「首条 error」分 17 桶逐桶核完（逐档计数表见 `temp/unverifiable-triage-20261018.md`，**不随仓库发布**，gitignore）。**结论：没有成片的内容缺陷**；主产出是查明 4 类工具侧判据缺口。

### 4 类判据缺口（工具侧）

1. **加载器支撑件不在 classpath**。`@SubscribeEvent`(88 条) / `@Mixin`(87) / `Dist`(35) / `IEventBus`(15) / `Nullable`(17) / `JsonObject`(6) 一律 `cannot find symbol`。反证：这些类从不进 MC 合并 jar（实测 `forge-1.20.1-47.4.0_mapped_official_1.20.1.jar` 9723 条目里 `distmarker`/`eventbus`/`com/google/gson` 各 0 条），而 `javap -cp eventbus-6.0.5.jar net.minecraftforge.eventbus.api.SubscribeEvent` 证明它们真实存在。修法：`supportJarsFor()` 逐档按该版本 userdev `config.json` 的 `libraries` 取件（`1.15.2→eventbus 2.2.1 / 1.16.5→4.0.0 / 1.17.1→5.0.3 / 1.19.4→6.0.3 / 1.20.1→6.0.5 / 1.20.4→6.2.27`），单开 `support` 层只喂补全器、**不参与存在性判定**。

2. **`javac` 缺省 `-sourcepath` = `-classpath`，去编 jar 内嵌 `.java`**。报错形态
   `neoforge-…-merged.jar(/net/neoforged/neoforge/registries/DeferredRegister.java):35: error: package net.neoforged.bus.api does not exist`
   把因果讲反了：该 merged.jar 20815 条目里 **7492 个 `.java`**，javac 顺着 classpath 把它们当成输入源码。四组对照（同一 jar、同一源）：原样 3648 条错误全来自 jar 内 `.java` → **只加空 `-sourcepath`、一个依赖都不补：exit 0** → 补 8 个依赖仍 1640 条同形态 → 依赖+空 sourcepath：exit 0。**补依赖治不了，钉死源码查找面才能。**

3. **mojmap 参考围栏被当本档 Yarn 面编译**。`fabric/1.21.11` 4 条（`MobEffect`/`ResourceKey`/`AdvancementHolder`/`BlockModelGenerators`）。反证：四件都写 `### ⚠️ 映射口径：本档语料是 mojmap` + 逐名对照表；yarn 1.21.11 jar 实测 `MobEffect` 0 命中/`StatusEffect` 有、`ResourceKey` 0/`RegistryKey` 有、`AdvancementHolder` 0/`AdvancementEntry` 有、`BlockModelGenerators` 0/`BlockStateModelGenerator` 有。判据双条件（披露段 + 逐名对照表 + mojmap-only 名），**收紧而非放宽**：条数不变（仍 50），只是判读标注为「参考围栏」。

4. **MixinExtras 注解不在 Mixin 本体里**。第二轮全量抓到唯一 1 条 **fail**：`fabric/1.21.1/code-patterns/04-mixin-patterns.md:157` 的 `@Local(ordinal = 0)` 被补成 Mixin 内部枚举 `LocalVariableDiscriminator$Context$Local`，报 `incompatible types: Context.Local cannot be converted to Annotation`。根因：`@Local`/`@Share`/`@Cancellable` 来自 **MixinExtras**（`io.github.llamalad7:mixinextras-*`），Mixin 本体没有。修法两条（都不动内容）：① `pickMixinextrasJar()` 把 `mixinextras-fabric`/`mixinextras-neoforge` 加进 fabric/quilt 支撑件（缓存实测 `0.3.5/0.4.1/0.5.4/0.5.5` 都含 `com/llamalad7/mixinextras/sugar/Local.class`）；② `isAnnotationEntry()` 在 class 文件层读 `ACC_ANNOTATION(0x2000)|ACC_INTERFACE(0x0200)`，先剔除「同名但不是注解」的嵌套类候选再挑唯一解（实测 `Local.class`=true、`LocalVariableDiscriminator$Context$Local.class`=false）。复跑：`fabric/1.21.1` 63→**52、`fail=0`**（原 fail 消失，未变成另一条 unverifiable）。

### 11 处内容缺陷（6 类根因，逐条 javap）

| 档 | 文件:行 | javap 反证 | 修法 |
| --- | --- | --- | --- |
| 1.14.4 | `mc-sound/SKILL.md:66-70` | `SoundEvents.BLOCK_STONE_*` 在；`Sounds` 类不存在；`SoundType(float,float,SoundEvent×5)` 收裸 `SoundEvent` | `SoundEvents.BLOCK_STONE_*` |
| 1.19.4 | `mc-sound/SKILL.md:68-72` | `net.minecraft.sounds.Sounds` **找不到**；`SoundEvents.STONE_BREAK` 在 | `SoundEvents.STONE_*` |
| 1.20.1 | `mc-sound/SKILL.md:68-72` | 同上 | 同上 |
| 1.20.4 | `mc-sound/SKILL.md:68-72` | 同上 | 同上 |
| 1.19.4 / 1.20.1 | `mc-recipe/SKILL.md:148-151` | `RecipeProvider(PackOutput)` **仅单参**，无 `(PackOutput,…)` 重载 | 构造器改单参 |
| 1.17.1 | `code-patterns/01-block-patterns.md:15` | `BlockBehaviour$Properties` 只有 `of(Material)`/`of(Material,DyeColor)`/`of(Material,MaterialColor)`/`of(Material,Function)`，**无零参** | `of()` → `of(Material.STONE)` |
| 1.20.1 / 1.20.4 | `code-patterns/04-world-patterns.md:30` | `Structure$StructureSettings` = `public final class … extends java.lang.Record` | `extends Structure` + `super(settings)` |
| 1.14.4 | `08-client-server.mdc:185` / `03-entity-patterns.md:21` | `EntityDataManager` **非泛型**；泛型在 `DataParameter<T>` | `DataParameter<Integer>` |
| 1.13.2 | `mc-recipe/SKILL.md:33` | `IRecipe extends IForgeRecipe`，**无类型形参** | `implements IRecipe` |

**判为误报（不改内容）**：`Z` 桶 109 条逐条读围栏 = 反例 8 / 片段 96 / 伪代码 10；`M` 桶 51 条方法名候选全部核完 **0 条真缺陷**（`getUpdateTag`/`saveWithoutMetadata`/`load`/`setLevel`/`setRemoved`/`registerAttributes` 等 javap 逐档证**确实存在**，报错只因片段被包进 `class __Frag` 后 `super.xxx()` 宿主不是原类）。

### 复跑读数

- **全量 `--all --complete`（57 档）：`fail=0 / unverifiable=1685`**（基线 1821，**−136**；`info=0`，57 档全部跑过，35.4 min）。报告 `D:/mc-skill-temp/audit-triage-final-20261018/report.json`。降幅集中在 support 层补齐的档：`forge/1.20.1` / `1.20.4` / `1.17.1` 各 −11、`forge/1.19.4` −10、`forge/1.18.2` −9、`forge/1.16.5` −6、`fabric/1.21.1` −11（含 mixinextras 那条 fail），fabric 多数档 −5。
- 定向（`support` 层生效后逐档 `--complete`，全 `fail=0`）：`forge/1.13.2` 63→**59**、`1.14.4` 140→**136**、`1.17.1` 165→**154**、`1.19.4` 168→**158**、`1.20.1` 183→**172**、`1.20.4` 180→**169**。
- `--sourcepath` 修复：`neoforge/1.21.10` 2→**0**、`neoforge/1.21.11` 5→**3**（剩 3 条是 `ExampleMod.MODID`/`BLOCKS` 项目上下文）。
- mojmap 分类：`fabric/1.21.11` 50→**45**、`1.21.10` 9→**5**、`1.21.4` 7→**4**、`1.21.8` 7→**4**，全 `fail=0`。

### 仍未覆盖 / 已知边界

- **13 条围栏未闭合**（`mc-potion*` 6 + `mc-item/SKILL.md` 7）：markdown 围栏边界写错（`mc-potion` 花括号 +1、`mc-item` 圆括号 −1），**不是 API 错**，本轮只记账不改。
- **rift/1.13.2 的 3 条** `org.dimdev.rift.*`：本机无 rift 构件，不硬判。
- **fabric/26.1.2 的 17 条**：FAPI 未 remap 件，`cannot access … bad class file` 一律不可判（与 §8.35 同边界）。
- 剩余 **1685 条**全部保留 `unverifiable`（A 系上下文缺口 1009 / B 片段 95 / C1+C2 占位 222 / D 构件 21 / E 包装 1 / K 候选 128（含 7 条 REF 参考围栏）/ M 方法名 83 / T 构件 1 / Z 待读 125；合计 1685）。**`unverifiable` 不等于「无缺陷」**：其中能判的 11 处已修，4 类判据缺口里 2 类完全修好、2 类的残留已在 §8.38 补掉，其余是本档构件回答不了（上下文/片段）或本机没有能回答它的构件。
- `--selftest` 23 臂→**55 条断言**，配 10 条投毒自证（删 `-sourcepath` / 指向仓库正文 / 不建空目录 / support 混进 API 层 / `supportJarsFor` 返回空 / `mergeSupportIndex` 掏空·不记 layer·不并 bySimple / runPack 不调它 / `pickImportCandidate` 不优先 API / mixinextras 缺失 / `@Local` 被认成非注解），全部变红、还原返绿。

## §8.37 围栏未闭合修复：28 条（含审计器结构性盲区的 15 条）

§8.36 把 13 条「围栏未闭合」记进未做清单；本轮修完，并由独立全仓扫描又找出**同类 15 条**，合计 **28 条**。全仓 `21385` 个 ```java 围栏现净深度全部为 0。

### 两类形态与判据

1. **potion ×6：花括号 +1**。围栏里 `public class ExampleModPotions implements ModInitializer {` 开了类，正文到字段 `0)));` 就闭栏，类的 `}` 丢了。出处（只读 `data/`）：类闭合 `}` 都在**列 0** —— `1.21.1` `ExampleModPotions.java` 开 15 / 闭 39；`1.21.4` `FabricDocsReferencePotions.java` 开 16 / 闭 40；`1.21.8` 同文件 开 18 / 闭 42；`1.21.10` `ExampleModPotions.java` 开 18 / 闭 42；`1.21.11` 开 19 / 闭 43。
   ⚠️ `1.21.4` / `1.21.8` 的参考件**文件名不同**（`FabricDocsReferencePotions.java`，与 Skill 围栏里的类名一致）；按 `ExampleModPotions.java` 找会误报「不存在」（假否定）。

2. **mc-item ×7：圆括号 −1**。需闭合的括号只有 3 个（`ITEMS.register(` / `new Item(` / `.food(`），而 `.build())` 已顺手闭了 `.food(`，后面却还有 `        )` / `    )` / `);` 三个 ⇒ 多一个。按缩进对齐（列 0 / 4 / 8）应删**列 8** 那行。

3. **knowledge ×15：花括号 +1**。`public enum MyTier implements (IItemTier|Tier) {` 开了枚举，两条注释后直接闭栏，`}` 丢了。反证是**回归而非刻意截断**：`forge/1.14.4/knowledge/antipatterns/item.md:36-39` 与 `:45-48` 同段代码**带 `}`**。

### 为什么审计器只报 13

`audit-content-claims.mjs` 的 `if (/❌|错误示例|反例|不要这样写|忘记导入/.test(f.content)) continue;` 把反例围栏**整块跳过** ⇒ 那 15 条永远不进 javac。**审计器对「反例块的语法完整性」是结构性盲的**，这类缺陷只能靠独立的「围栏配平」扫描兜底。

### 复跑读数

- 12 个受影响档 `--complete`：`fail=0 / unverifiable=1155`，**条数与修前完全相同**。13 条里 12 条 claim 由 `编译失败（片段不完整/缺上下文）` 变为 `编译失败（类路径/依赖缺口）`（`fabric/1.21.11` 第二条行号 `:43`→`:44`）；1 条（`mc-potion.md:28`）修前修后都是 `mojmap 参考围栏`。
- 证据示例：`fabric/1.21.1 mc-potion.md:27` → `ExampleModPotions is not abstract and does not override abstract method onInitialize() in ModInitializer`；`forge/1.19.4 mc-item:115` → `symbol: variable ITEMS`。
- 15 条 knowledge 修完后**审计器读数不变**（仍在 `❌` 跳过面内），不充作「修好 N 条 finding」。
- 全仓扫描（跳过 `data/`、`temp/`、投毒夹具）：`files=15258 · fences=35217 · java=21385 · bad=0`。独立复核（teammate）扫到 15262 / 35219 / 21387，`bad` **正好同一批 15 条**（同文件同行同深度），两个独立实现互证。
- 门：`--selftest` OK（55 条断言）· `assert-skill-mirrors` ok · `assert-skill-yarn-attest` exit 0 · `assert-skill-mappings-key` ok · `assert-scaffold-rules-conflict` ok · `test-scripts.mjs` exit 0。

### 未做

- `bugfix_list.md:669` 孤儿围栏（裸 ``` 到 EOF 未闭）：该文件未被 git 跟踪、非内容源稿、mtime 2026-10-11，不属本轮面。
- 投毒夹具 `mcp-server/_debug_gate_selftest/.../90-poison.mdc` 按设计不配平。
- potion 围栏未补 `onInitialize()`（该围栏定位是「只展示字段」，方法体另有独立围栏）；剩余 `not abstract and does not override onInitialize` 属片段不完整，如实留 unverifiable。

## §8.38 §8.36 四类缺口的收尾：补掉 3 个残留（并修掉自己引入的 1 个误判）

§8.36 说「4 类判据缺口全部已修」是**夸大**。复核后实际：**2 类完全修好**（`-sourcepath` = `-classpath` 去编 jar 内嵌 `.java`；MixinExtras 注解不在 Mixin 本体）、**2 类有残留**（加载器支撑件 274→21；mojmap 参考围栏只在「本档 artifacts 真有 mojmap 层」时成立）。本节补掉 3 个残留。

### 残留① `Collection` 4 条 / `BiConsumer` 6 条 —— `jdkMap` 漏项

`mc-gametest` 的 `public static Collection<TestFunction> exampleTests()` 报 `symbol: class Collection`。查 `jdkMap` 23 个键：有 `Collections` 无 `Collection`，有 `Consumer` 无 `BiConsumer`。两者都是**不同的类**，纯漏项。只补报告里实证到的这两个（不从记忆加清单）。

### 残留② `Nullable` 17 条 —— 多注解候选被「歧义不猜」挡住

支撑件里同时有 `org.jetbrains.annotations.Nullable` / `org.jspecify.annotations.Nullable` / `javax.annotation.Nullable` ⇒ `distinct.length !== 1` ⇒ 永不补 import ⇒ javac 走不下去，片段里更深的真错误看不到。
修法（**最终版 = 按本档 MC 真实引用择优**）：只在**注解位**（`@Name`）开择优 ——
1. 先用 `isAnnotationEntry` 在 class 文件层确认「真是注解」；
2. 只从**本轮真在编译类路径上**的候选里挑（`cpSet = jarPaths + auxJars`，与 `compileOnce` 同口径）；
3. 按 `annotationRefCountsInJar` 统计的**本档 MC 件引用次数**择优（在 class 常量池里数 `L<fqcn>;`，按 jar 缓存，惰性触发）；
4. 本档零引用或并列最高才退到包序 `ANNOTATION_PKG_ORDER`；仍定不下来返回 `null`（继续不猜）。

**为什么改成按本档真实引用**：硬编码包序等于拿外部约定盖过本档实况。实测同一注解在各档的真实分布完全相反 ——

| 档 | `org.jetbrains` | `org.jspecify` | `javax.annotation` |
| --- | ---: | ---: | ---: |
| forge/1.20.1 | 253 | 0 | 1406 |
| forge/1.16.5 | 0 | 0 | 1143 |
| forge/1.14.4 | 0 | 0 | 1000 |

⇒ 旧档 MC 自己的主流注解是 **`javax.annotation.Nullable`**（jetbrains 为 0）。所以必须把 `com.google.code.findbugs:jsr305` 放进通用支撑件（只进编译面、不进存在性判定），否则「按真实引用择优」在那些档会退化成包序、等于失效。修前 `forge/1.16.5` 选 jetbrains（本档 0 引用），修后选 `javax.annotation.Nullable`（本档 1143 引用）——**`AUDIT_DEBUG_IMPORT=Nullable` 实测**。

**读数：判据换了依据，数值不变** —— 全量 57 档仍是 `fail=0 / unverifiable=1685`，残留读数 `Collection` 0 / `BiConsumer` 0 / `Nullable` 0 / mojmap-only 0，`REF` 17，与硬编码包序版**逐档完全一致**（无任何档条数变化）。如实记账：这次改的是**依据的来源**（外部约定 → 本档构件），不是结论。

**这是编译面择优，不是归属断言。**

### 残留③ `fabric/1.21.10 mc-advancement:61` —— mojmap 判据缺第二出处

`fabric/1.21.11` 的 artifacts 有 `layer=mojmap` 1 个 jar（loom layered 件）；`fabric/1.21.10` 只有 `yarn/api/fapi/external` ⇒ 层判据在该档**结构上永不成立**。
第二出处：仓库自带 `data/_yarn-mojmap-pairs/yarn-mojmap-<ver>.json`（1.21.10 有 9476 对）。实测 `AdvancementHolder`/`MobEffect`/`ResourceKey`/`BlockModelGenerators` 是 mojmap-only，`Advancement`/`StatusEffect`/`RegistryKey`/`BlockStateModelGenerator` 两侧都有。

### 本轮自己引入又修掉的误判（记在这里，别重犯）

为让「纯类型声明位」的名字也能抽到（`AdvancementHolder getDirt = …` 后面跟空格，老三种抽取形态一个都抓不到），候选抽取放开成「全部大写标识符」。结果 `fabric/1.21.10 mc-gametest:71` 被误判成参考围栏 —— `import java.lang.reflect.Method;` 的 **`Method` 撞上 MC 里某个叫 `Method` 的 mojmap 类**，而那段是纯 Yarn 代码（`TestContext` yarn-only）。**误判后果是「不编译」，会掩盖真错误，比漏判更坏。**
修法：① 剔除「显式从 `java.*`/`javax.*`/`jakarta.*`/`jdk.*`/`sun.*` import 的简单名」；② `JDK_COMMON` 补 `Method`/`Field`/`Constructor`/`Modifier`。修后 `fabric/1.21.10` 从 10 条回到 **9** 条。
**教训：放宽启发式必须逐条复核新增结果 —— 那次总数只 +1，光看数字看不出来。**

### 读数

- 全量 57 档：**`fail=0 / unverifiable=1685`**（修前同为 1685）。只有 2 档条数变：`fabric/1.20.4` 41→42、`forge/1.20.1` 172→171。
- 残留定向：`Collection` 4→**0**、`BiConsumer` 6→**0**、`Nullable` 17→**0**、mojmap-only 名仍报错 1→**0**。
- `mojmap 参考围栏` 7→**17**（10 条是从「编译失败（类路径/依赖缺口）」改判，**不是新增 finding**）。**17 条逐条复核：各取其围栏原文列出触发的 mojmap-only 名，17/17 都有真触发名，0 条站不住。**
- `--selftest` 55→**70 条断言**；**投毒自证 9 条全红、还原返绿**。其中一条是发现「假臂」的关键：首版撞名臂用 `Method` 断言，而 `Method` 已被 `JDK_COMMON` 兜住 ⇒ 去掉 import 过滤也不红（投毒报 `GREEN(BAD)`），改成拿 mojmap-only 名当被 import 目标才真测到机制。**教训：selftest 臂必须投毒验一次，不投毒的臂等于没写。**
- 门：`assert-skill-mirrors` ok · `assert-skill-yarn-attest` exit 0 · `assert-skill-mappings-key` ok · `assert-scaffold-rules-conflict` ok · `test-scripts.mjs` exit 0。

### 未做

- `BiFunction` / `UnaryOperator` / `Comparator` / `Iterable` / `Runnable` 等 JDK 名未主动补进 `jdkMap`（判据是「报告里有实证才补」）。
- 包序 `jetbrains > javax` 是编译面约定，不是归属断言；若日后要按「本档 MC 真实引用」择优，需逐档扫件内注解引用。
- `isAnnotationFqcn` 只对注解位候选惰性调用，未给全索引建注解位图（上万类全量判定太贵）。

## §8.39 P1 三条与 P2 三项的收尾（2026-10-20）

### P1-A `declared` 取错文本（审计读数错，不是内容缺陷）

`compileBlocks` 的 `declared` 原本扫**原始围栏文本**（`/\b(?:class|interface|enum|record)\s+([A-Z]\w*)/g`），于是围栏顶部
「本档构件核实」注释里的 `public interface IRecipe` / `public class DataParameter<T>` 被当成「围栏内已声明」
⇒ `autoImport` 跳过补 import ⇒ javac 报 `cannot find symbol`（`forge/1.13.2 mc-recipe:32`、`forge/1.14.4 08-client-server.mdc:182`）。

修法：`declared` 改走 `stripCommentsAndStrings(f.content)`。selftest 新增 11k 三臂：注释里的声明不算、真声明仍算、字符串里的不算。

### P1-B `Structure` 只改 extends 没实现抽象方法

`javap` 实测 1.20.1 与 1.20.4 的 `Structure` 都有**两个**抽象方法：

```
protected abstract Optional<Structure$GenerationStub> findGenerationPoint(Structure$GenerationContext);
public abstract StructureType<?> type();
```

只写 `extends` + 构造函数 ⇒ `MyStructure is not abstract and does not override abstract method type() in Structure`，**仍不能编译**。
修法：两个 `04-world-patterns.md` 的围栏改成 `public abstract class MyStructure extends Structure`，注释里列出两个抽象方法签名与「具体子类必须实现」。
未补真 `type()` 的理由：`StructureType.register` 在 1.20.1 是 **private**，写真 `type()` 还要配套 `Codec` 与注册链，会把这个围栏从「最小形态说明」撑成半篇教程。

### P2 支撑件近似（编译面近似会让 unverifiable 被低估）

| 项 | 老实现 | 实测真值 | 现在 |
| --- | --- | --- | --- |
| forge eventbus / forgespi | 前缀表，跨轴拿 2.2.1 顶 0.9.3 / 1.0.0 | 逐档实读 9 份 userdev `config.json`：1.13.2→0.9.3 / 1.14.4→1.0.0 / 1.15.2→2.2.1 / 1.16.5→4.0.0 / 1.17.1·1.18.2→5.0.3 / 1.19.4→6.0.3 / 1.20.1→6.0.5 / 1.20.4→6.2.27 | `FORGE_EVENTBUS_EXACT` + `pickModuleJarSameAxis()`：**跨轴一律不给**，同轴顶替记账 |
| neoforge fancymodloader loader | `pickModuleJar(..., {})` ⇒ 全档取最新 12.0.8 | 1.20.4→2.0.17 / 1.20.6→3.0.45 / 1.21.1→4.0.43 / 1.21.3→5.0.8 / 1.21.5→7.0.13 / 1.21.8→9.0.18 / 1.21.10→10.0.32 / 1.21.11→10.0.36 / 26.1→11.0.15 | `NEO_LOADER_VER` 逐档钉；删掉无效的 `core` 调用（缓存无此 artifact，`@Mod` 实测在 `loader` 件里） |
| mixinextras | 1.21.1 取最低 0.3.5（缺 `@Cancellable`） | 仅 4 档有本档出处：1.20.1/1.20.4→0.4.1、1.21.3/1.21.4→0.5.5 | 有出处用出处，无出处用**注解完整性下限 0.4.1**，并加 `mixinextrasHasAll()` 硬校验三件注解 |

**近似记账**：新增 `SUPPORT_APPROX` 设施，报告顶层输出 `supportApproximations`（实测 **37 处**）并在控制台逐条打印 `[APPROX]`，不再静默。
副产品修正：`Dist` 实测**在 1.13.2 自己的 MC 件里**（`forge-1.13.2-…mapped_snapshot….jar` 含 `net/minecraftforge/api/distmarker/Dist.class`），1.13.2 不需要借 forgespi；真正缺 Dist 的是 1.14.4 / 1.17.1 / 1.18.2 / 1.20.1 / 1.20.4。

### 读数

- 全量 57 档：`fail=0 / unverifiable=**1691**`（修前 1685）。
- **+6 不是回归**：`forge/1.13.2` 59→63（+4）、`forge/1.14.4` 136→140（+4）、`forge/1.20.1` 171→170（−1）、`forge/1.20.4` 169→168（−1）。前两档的 +4 各自来自**撤掉跨轴 eventbus/forgespi 假支撑件后真实暴露的依赖缺口**——之前是靠 2.2.1 硬顶编过去的假绿。这正是 P2 要的效果：宁可多报 unverifiable，不要假绿。
- P1 定向（前→后）：`IRecipe` 1→0、`DataParameter` 1→0、`type()@1.20.1` 1→0、`type()@1.20.4` 1→0。
- P2：跨轴 eventbus 顶替 **0 处**；`supportApproximations` 37 处逐条可查。
- `--selftest` 82→**94 条断言**；镜像已刷 2 档；门链全绿（`test-scripts.mjs` exit 0）。

### 自我更正

- 上一轮「11 处内容缺陷全部已修」**不成立**：`IRecipe` / `DataParameter` 的**内容**改动对（javap 可核），但**审计读数**没修掉。我当时只看「改动是否落地」，把「代码改了」当成「问题消了」。**同一个坑第三次**（前两次：未投毒的 selftest 假臂、`cpSet` 漏 `auxJars` 却自测全绿）。规矩改为：结论只能引用「修后重跑的定向读数」。
- `Structure` 上轮只改 `extends` 就收工，**没 javap 核抽象方法**，造出一个仍不能编译的「正确方案」——那比不修更坏，因为它看起来已经修好。**内容源稿改动必须真编译一次**。
- 记账设施第一次又只加在 fragment 分支（全量跑出 `supportApproximations: []`），已补两分支 + 源码接线臂（`approxSites < 2` 判红）。
