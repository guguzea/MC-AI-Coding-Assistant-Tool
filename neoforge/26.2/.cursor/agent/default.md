# NeoForge 26.2 — 11 条齐（证据 = 官方 MDK + sources jar）

> 本档 `00–10` **11 条齐**，但**证据是官方 MDK 模板 + NeoForge 26.2.0.93 sources jar**（as-of 2026-10-31；该 jar 版本是当时的取证锚，不是本档钉值），不是 docs 正文（上游 `/docs/26.2/` 仍 404，本仓 manifest 记 `available=false` / `httpStatus=404`）。
> 与 26.3 的对拍结论在 `09-anti-patterns.mdc` 的比较表里：`DeferredRegister` 仅 javadoc 差异、`PayloadRegistrar` 逐字节一致、**`GatherDataEvent` 两版结构不同 ⇒ 07 单独写**、SDL 是 26.2→26.3 的改动（26.2 没发生）。

**禁止**把 26.1 的 01–10 当 26.2，也**禁止**把这些当官方文档结论抄给用户。

## 事实面（2026-10-31 实测）

| 项 | 值 |
|---|---|
| 构件 | `net.neoforged:neoforge:26.2.0.93`（2026-10-31 复验 maven `releases` 的 `maven-metadata.xml`：26.2 线最新非 beta；`26.2.0.57` 起脱离 `-beta`）；本档钉值 2026-10-31 由模板值 `26.2.0.59` 对齐到 `26.2.0.93` |
| 官方 MDK | `MDK-26.2-ModDevGradle@d1c748fd`、`MDK-26.2-NeoGradle@15955d03`（`mdk-checksums.json` 已 pin，archive sha256 实测与 pin 一致） |
| 主文档 | **无**（`/docs/26.2/` 404） |
| primer | `data/neoforge_primers/26.2.md`（26.1→26.2，只讲 vanilla 类改动） |
| 本机验证 | 本档 scaffold 零改动副本 `gradlew build` → **BUILD SUCCESSFUL in 2m 52s**；另跑 3 轮复核（含 **NFRT 全链零缓存重算**：`recompile` 真编 7055 个 MC 源文件）全部通过、jar 同 sha。边界：只覆盖 `:build`，未跑 runClient / runServer |
| 工具链 | Java 25 · Gradle wrapper 9.2.1 · MDG **2.0.148**（2026-10-31 由 2.0.143 统一升级；插件门户与 neoforged maven 两处 `maven-metadata.xml` 均含 2.0.148） · `neo_version=26.2.0.93` |

## 规则里的 Java 调用已真编译验证（2026-10-31）

把 04/06/07 的调用原样写进官方 MDK 工程（`MDK-26.2-ModDevGradle@d1c748fd`）的 `probe/Probe.java`，`gradle compileJava` → **BUILD SUCCESSFUL in 2m 44s**（首次拉 26.2 依赖；Gradle 9.8.1 + JDK 25）。26.2 的 datagen 入口 `event.getGenerator().getVanillaPack(includeDev).addProvider(ProbeProvider::new)` 也一起编过（这是与 26.3 唯一不同的调用形态）。

**未核清单已清零**：26.2 的 provider 入口形态、`Factory.create(PackOutput)` 由框架传参、`DataGeneratorConfig` 不可达、Screen 渲染回调（两版一致，26.x 无 `GuiGraphics` 类）全部核过。

## 配置 / 工作流

同根纲：`mc-config` 走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`。
`get_workflow_template` 只在完整流程时调。
