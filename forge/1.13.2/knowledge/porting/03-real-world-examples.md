# 真实参考与出处（Forge 1.13.2 档）

> 本文件只列 **本仓 CLI / 语料里实际出现过** 的参考。凡是无法在本仓核实的「1.13 时代开源项目」一律不写名字——1.13.2 档没有可信的多 Loader 案例可给。
> 逐条出处见 `temp/` 证据日志。DOCS = `data/forge_1.13.2/forge-docs/1.13.2/processed/`。

---

## 1. 权威长文（首选）

| 参考 | 用途 | 证据 |
|------|------|------|
| NeoForge Primer 1.12 → 1.14（`https://docs.neoforged.net/primer/docs/1.14/`，MIT / williewillus） | 扁平化（metadata→blockstates、Item/Block 拆分、assets↔data、lang JSON、Tags 取代 OreDictionary、Data Fixers、Containers、Particles）唯一系统化说明 | `get_migration_guide --route=1.12->1.14`（toc + 各 section 正文） |
| 本仓 1.13.x 官方文档语料 | 逐页全文 | `search_forge_docs --version=1.13.2` → `get_forge_doc_full --id=1.13.2/<page>`（如 `1.13.2/concepts_registries`、`1.13.2/blocks_states`、`1.13.2/networking_simpleimpl`、`1.13.2/utilities_tags`、`1.13.2/models_files`、`1.13.2/conventions_loadstages`） |

> ⚠️ 语料的 `url` 字段写作 `https://docs.readthedocs.net/en/1.13.x/...`，与本仓其他档记录的域名不一致 → **不要**把该 URL 直接当可访问链接给用户，取正文只走 `get_forge_doc_full`。

---

## 2. 官方工具链 / 骨架

| 参考 | 用途 | 证据 |
|------|------|------|
| 官方 MDK `forge-1.13.2-25.0.223-mdk.zip`（`https://maven.minecraftforge.net/net/minecraftforge/forge/1.13.2-25.0.223/forge-1.13.2-25.0.223-mdk.zip`） | 1.13.2 工程基线：ForgeGradle `3.+`、Gradle `4.9`、`sourceCompatibility '1.8'`、`mappings channel=snapshot version=20180921-1.13` | `mcp-server/data/mdk-checksums.json:545-552`（`id: forge-1.13.2-forgegradle`）；本包 `scaffold/build.gradle:2,10,22,25`、`scaffold/gradle.properties:5-13`、`scaffold/gradle/wrapper/gradle-wrapper.properties:6` |
| `download_official_mdk`（默认 dryRun，先看 URL 再确认落盘） | 拉官方 MDK 到 `$MC_SKILL_CACHE` | 根 `AGENTS.md` 工具表 |
| 本包 `scaffold/`（含 `META-INF/mods.toml` 模板、`pack.mcmeta`） | 1.13.2 `mods.toml` 字段实证：`modLoader="javafml"`、`loaderVersion`、`[[dependencies.*]] modId="forge"/"minecraft" + versionRange + side="BOTH"` | `scaffold/src/main/resources/META-INF/mods.toml:1,2,12,14,16,20,23` |
| ForgeGradle Cookbook（`https://forgegradle.readthedocs.org/en/latest/cookbook/`） | `build.gradle` 定制；文档明确「不要改 buildscript{}」 | DOCS/gettingstarted.md:22,26；`gradlew build` 产物在 `build/libs`（:38）、`runClient` / `runServer`（:39-40） |

---

## 3. 文档内点名的可打开示例（都是 1.13.x 语料原文引用的）

| 示例 | 用在哪 | 证据 |
|------|--------|------|
| `BlockFlowerPot.getActualState()` | 在 `getActualState` 里读 TileEntity 时的 `ChunkCache` 安全判断范式 | DOCS/blocks_states.md:96 |
| ProjectE `CustomConversionMapper`（`https://github.com/sinkillerj/ProjectE/blob/5efac2656a0f4fbe50f0030fb354940033092d2b/src/main/java/moze_intel/projecte/emc/mappers/customConversions/CustomConversionMapper.java#L72-L98`） | 用 `IResourceManager.getAllResourceLocations` 遍历 `data/` 子目录（尊重数据包级联/覆盖） | Primer §Data packs |
| Forge 调试 mod 的动画资源（`forgedebugmodelanimation:block/rotatest@default`、armature/ASM JSON） | 1.13 的 `.animation` / `.tc` JSON 模型动画格式实例 | DOCS/animation_armature.md:3（"taken from the forge debug mod"）、DOCS/animation_asm.md:76,177-187 |
| `MinecraftForge` 1.14.x 测试代码 `ContainerTypeTest.java`（`https://github.com/MinecraftForge/MinecraftForge/blob/1.14.x/src/test/java/net/minecraftforge/debug/misc/ContainerTypeTest.java`） | 容器/`ContainerType` 写法参考 | Primer §Containers。**注意：链接指向 `1.14.x` 分支，1.13.2 适用性未核实** → 只当思路参考，签名需回本档语料复核 |
| `lang2json` 在线转换器（`https://tterrag.com/lang2json/`）与 `ichttt/MCLang2Json`（`https://github.com/ichttt/MCLang2Json`） | `.lang` → JSON 批量转换（1.12→1.13 必做） | Primer §Lang changes |
| 文档内引用维基页：`Data_pack`、`Resource_pack`、`Model#Block_models`、`Language#Available_languages` | 数据包总览、资源包总览、原版模型 JSON 定义、可用 locale 清单 | Primer §Data packs；DOCS/concepts_resources.md:3、models_files.md:21、concepts_internationalization.md:11 |

---

## 4. 本仓内可直接引用的落地件

| 位置 | 用途 |
|------|------|
| `forge/1.13.2/.cursor/rules/01-registry.mdc` … `10-gui.mdc` | 本档正面教程（注册 / 方块 / 物品 / 实体 / 事件 / 网络 / datagen / 客户端-服务端 / 反模式 / GUI） |
| `forge/1.13.2/knowledge/version-changes/1.13.x.md` | 1.13–1.16.5 与 1.17+ 命名分段表（`TileEntity`、`NBTTagCompound`、`Container`/`ContainerType`、`ItemGroup`、`world.isRemote`）；注意其 `Block.Properties.create(Material)` 与 `mapping_channel=mcp` 两点和官方语料冲突，见 `00-porting-guide.md` §冲突 |
| `forge/1.13.2/knowledge/antipatterns/*.md` | 按症状查（registry / item / block / entity / events / networking / gradle） |
| `forge/1.13.2/code-patterns/*.md` | 本档短片段（block / item / entity / world / datagen） |
| `knowledge/patterns/examples/cube-all-resources.md` | 通用「blockstate + block model + item model + 贴图」四件套示范（跨版本可用） |
| `data/forge-porting/breaking-changes/1.12.2-1.14.4.json` | 1.12→1.14 自动差异线索（自述不代表完整 API 变更） |
| 邻档 `forge/1.14.4/knowledge/porting/`、`forge/1.15.2/knowledge/porting/` | 只有当用户目标 ≥ 1.14.4 时才读；**禁止**据此给 1.13.2 写 `DeferredRegister` |

---

## 5. 明确不适用 / 未核实（防止误引）

- **Architectury / MultiLoader-Template / create-multiloader-addon-template / Firmament / Forge Config API Port**：这些在邻档 `forge/1.15.2/knowledge/porting/03-real-world-examples.md:9-15` 列出，面向 Fabric + (Neo)Forge 现代多 Loader；本仓**没有** 1.13.2 的 Fabric/Quilt/NeoForge 档（`ls data` 里 fabric 最早 1.14.4），它们是否支持 1.13.2 **未核实** → 不要在 1.13.2 工程里当模板推荐。
- **`mc-mod-porter`**：其知识库覆盖 1.19.4 → 26.1（`forge/1.16.5/knowledge/porting/02-version-migration.md:5`），不含 1.13.2。
- **同代其他 Loader**：仓内只有 `rift/1.13.2` 一档与 1.13.2 同期；Rift 的方法名只能来自该档核实表，禁止用 Fabric 记忆填写（根 `AGENTS.md` §6）。
