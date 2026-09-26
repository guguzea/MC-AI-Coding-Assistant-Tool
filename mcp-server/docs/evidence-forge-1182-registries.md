# 证据记录 · Forge 1.18.2 `ForgeRegistries` 静态字段名（32 字段全分母 · 双机制互证）

- **as-of**：2026-09-24 取证；**2026-09-25 抽成 tracked**（此前只在 gitignored `temp/ralph-20260922/evidence-forge-1182-registries.md`，`git ls-files` = 0 ⇒ 仓内不可复核；本文件 = 纳管版，32 字段名单为 2026-09-25 重跑补全）。
- **用户授权原文**（取证当时）：「jar 你自己去下载，反编译和你下载的模组，临时文件存放路径 `D:\mc-skill-temp`，JAVA17 `G:\JAVA17\jdk-17.0.12_windows-x64_bin\jdk-17.0.12`」。
- **目的**：终结本仓挂了两轮的 `未核实`：`forge/1.18.2` 四张表把 `FLUIDTYPES` 当 1.18.2 正名、而 `mc-fluid/SKILL.md:22/:102` 禁它（R118⑤ / R119②③ / R120③ / 第 22 轮 L 清单）。
- **证据档位**：本条属「**用户自备/官方构件逐字**」档（jar 在盘、sha256 可复核），高于 `AGENTS.md` 现记的「外部-only」。

## 1. 两个**互相独立**的取证机制（结论一致）

### 机制 A —— 读一手源码（本机 Gradle 缓存，非下载）
- 文件：`C:\Users\zzrCN\.gradle\caches\forge_gradle\maven_downloader\net\minecraftforge\forge\1.18.2-40.1.80\forge-1.18.2-40.1.80-sources.jar` 内 `net/minecraftforge/registries/ForgeRegistries.java`（157 行；`unzip -p` 到 stdout，**未写入仓库**）。
- 版本：**1.18.2-40.1.80**（来源 = 本仓 scaffold 真机构建留下的 ForgeGradle 缓存）。
- 静态字段声明（`:57-:95`，逐字）与下 §2 名单同集；关键行：
  - `:58  public static final IForgeRegistry<Fluid> FLUIDS = RegistryManager.ACTIVE.getRegistry(Keys.FLUIDS);`
  - `:64  public static final IForgeRegistry<EntityType<?>> ENTITIES = …getRegistry(Keys.ENTITY_TYPES);`
  - `:67  public static final IForgeRegistry<MenuType<?>> CONTAINERS = …getRegistry(Keys.CONTAINER_TYPES);`
- **全文 grep `FLUID` 只有两行**（`:58` 字段 + `:104` 的 `Keys.FLUIDS`）⇒ **既没有 `FLUIDTYPES`，也没有 `FLUID_TYPES`**。

### 机制 B —— javap 读编译类（用户下载的另一个 build）
- 构件：`https://maven.minecraftforge.net/net/minecraftforge/forge/1.18.2-40.3.12/forge-1.18.2-40.3.12-universal.jar`
  → `D:\mc-skill-temp\forge-jar\`（2,557,647 B；**sha256 `d699e54a6a7bbe31efb40d39c21cc2425dc0648590350bcc85a39943ff729da0`**）。
- 版本选定依据：`maven-metadata.xml`（211,570 B）里 `1.18.2-40.*` 共 **158** 个唯一 build，`sort -V` 最高 = **1.18.2-40.3.12**。
- 命令：`javap -p -classpath <jar> net.minecraftforge.registries.ForgeRegistries` ⇒ rc=0、stderr **0 字节**、输出 41 行，其中 `public static final` 注册表字段 **32 个**（**29 个直接 `IForgeRegistry<…>` + 3 个 `Supplier<IForgeRegistry<…>>`**）。
- **2026-09-25 tracked 化时重跑**（同 jar / 同命令）：`fields=32` 逐字复现，名单见 §2。
- ⇒ 两个不同 build（40.1.80 源码 ↔ 40.3.12 编译类）、两种不同机制（读源 ↔ 读字节码）互证。

## 2. 32 字段全名单（javap 全分母，2026-09-25 重跑逐字）

前 29 个（`IForgeRegistry<…>` 直接形态，按 javap 原序，只留字段名与类型实参）：

`BLOCKS` · `FLUIDS` · `ITEMS` · `MOB_EFFECTS` · `SOUND_EVENTS` · `POTIONS` · `ENCHANTMENTS` · `ENTITIES` · `BLOCK_ENTITIES` · `PARTICLE_TYPES` · `CONTAINERS` · `PAINTING_TYPES` · `RECIPE_SERIALIZERS` · `ATTRIBUTES` · `STAT_TYPES` · `PROFESSIONS` · `POI_TYPES` · `MEMORY_MODULE_TYPES` · `SENSOR_TYPES` · `SCHEDULES` · `ACTIVITIES` · `WORLD_CARVERS` · `FEATURES` · `CHUNK_STATUS` · `STRUCTURE_FEATURES` · `BLOCK_STATE_PROVIDER_TYPES` · `FOLIAGE_PLACER_TYPES` · `TREE_DECORATOR_TYPES` · `BIOMES`

另 3 个（`Supplier<IForgeRegistry<…>>` 形态）：`DATA_SERIALIZERS` · `LOOT_MODIFIER_SERIALIZERS` · `WORLD_TYPES`

按名字过滤 `FLUIDTYPES\|FLUID_TYPES` ⇒ **0**（rc=1）；`grep -i fluid` 全输出**只**命中 `FLUIDS` 一行。即「无流体类型注册表」是在 **32 个字段的全分母**上测出来的，不是抽查。
（旁注：`PAINTING_TYPES` 的实参是 1.18.2 的 `Motive`；`CONTAINERS` 的实参是 `MenuType` —— `Keys.CONTAINER_TYPES` 只是 key 名。）

## 3. 裁定（已落地的结论）

1. **`ForgeRegistries.FLUIDTYPES` 在 1.18.2 不存在** ⇒ 四张表把它写成 1.18.2 正名是**事实错**（已改）：`forge/1.18.2/knowledge/antipatterns/registry.md:130` / `knowledge/common/glossary.md:44` / `knowledge/version-changes/1.18.x.md:30` / `scaffold/README_AI.md:211`（四处均已写入「1.18.2 无流体类型注册表」与证据行）。
2. **`FLUID_TYPES` 在 1.18.2 也不存在** ⇒ 修法**不是**改名成 `FLUID_TYPES`。正确结论：1.18.2 **没有「流体类型」注册表**；流体注册表叫 `FLUIDS`；`FLUID_TYPES`（配 `FluidType`）是 **1.19+** 才有。
3. **`mc-fluid/SKILL.md:22/:102` 的禁令与 `ForgeRegistries.FLUIDS` 处方都被证实为对**（`:51/:85/:112` 同）⇒ 与四张表的冲突**判给禁令侧**。
4. 顺带钉死的三条：`ENTITIES` 是 1.18.2 正名（`ENTITYTYPES` 任何版本不存在，支持 R32/R106 与 F146）；`BLOCK_ENTITIES`/`SOUND_EVENTS`/`PARTICLE_TYPES`/`PAINTING_TYPES` **都带下划线**；`CONTAINERS` 是 1.18.2 正名（`MENU_TYPES` 是 1.20.x 侧的另一档事，别顺手改）。

**执行状态（2026-09-25 复核）**：四张表已改；`mcp-server/scripts/assert-forge-1182-registry-consts.mjs` 已于 2026-09-24（Ralph 第 24 轮）重签 —— `FLUIDTYPES` 的 `holds` **6 → 10**、`verdict:'absent'`、`to` 不参与断言（`:41`/`:91` 注释）；该门在 `test-scripts.mjs` 真跑清单内。

## 4. 边界（别拿别的路当复核入口）

`query_loader_api` / `ingest_loader_api` 的摘要面 `fields` 恒 0 且不含 `ForgeRegistries`（第 22 轮 scout 复述、本仓实测）⇒ **不能靠 ingest 复现本结论**，只能靠 javap/读源这条路。

## 5. 复核入口（任何人可重跑；构件路径为用户机上既有物）

```powershell
# 机制 A：读源（如果 Gradle 缓存还在）
unzip -p "C:/Users/zzrCN/.gradle/caches/forge_gradle/maven_downloader/net/minecraftforge/forge/1.18.2-40.1.80/forge-1.18.2-40.1.80-sources.jar" net/minecraftforge/registries/ForgeRegistries.java
# 机制 B：读字节码（期望 fields=32、FLUIDTYPES|FLUID_TYPES 0 命中）
"G:/JAVA17/jdk-17.0.12_windows-x64_bin/jdk-17.0.12/bin/javap.exe" -p -classpath "D:/mc-skill-temp/forge-jar/forge-1.18.2-40.3.12-universal.jar" net.minecraftforge.registries.ForgeRegistries
# 构件可再下载（sha256 见 §1 机制 B）
```

出处：`temp/ralph-20260922/evidence-forge-1182-registries.md`（原件，gitignored）+ 2026-09-25 重跑补全；登记面见 `mcp-server/docs/knowledge-coverage-sweep-20260924.md` §2。
