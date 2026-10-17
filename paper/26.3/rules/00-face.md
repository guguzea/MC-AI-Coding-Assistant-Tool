# 00 — Paper 服务端面（Paper 26.3）

**这一面不是模组平台的第 N 档。** 四处结构性不对齐（照抄模组规则必错）：

| 维度 | 模组面 | 本面 |
|---|---|---|
| 载体 | `gradlew runClient` | **`gradlew runServer`**（没有客户端） |
| API 层 | 直接打 `net.minecraft.*` | Bukkit/Paper **抽象层**（正常插件代码不碰 `net.minecraft.*`） |
| 生命周期 | `@Mod` + 事件总线 | **`plugin.yml` + `JavaPlugin#onEnable`** |
| 逐档 javap 改写表 | 核心资产 | **零适用**（插件开发者不需要 mappings） |

## 入口（处方）

```java
public final class MyPlugin extends JavaPlugin {
    @Override public void onEnable()  { /* … */ }
    @Override public void onDisable() { /* … */ }
}
```

出处：`javadoc org_bukkit_plugin_java_JavaPlugin.md:40`（`getLogger()`）；本档其余条目各自带出处。

## 已核实（2026-10-15 **本次实测**，非推断 —— 详表见 `../rules.meta.json`）

- **JDK 25 是底线**：`paper-api-26.3.build.178-stable.jar` 的 class file version = **69.0** ⇒ Java 25。用 JDK 21 编会报 `class file has wrong version 69.0, should be 65.0`。
- **classpath 至少三件**：`paper-api` + `adventure-api` + `adventure-key`。只放 `paper-api` 时报 `class file for net.kyori.adventure.key.Namespaced not found`（Paper 侧 `CommandSender` 继承 Adventure 的 `Audience`）。
- **`plugin.yml` 的 `api-version: '26.3'` 被 Paper 26.3-190 接受**（真机跑，无加载期报错）。
- **服务端发行件**只能走 `fill.papermc.io/v3` —— `api.papermc.io/v2` 已 **sunset**（HTTP **410**，body `{"ok":false,"error":"sunset"}`）。
- 依赖坐标 `io.papermc.paper:paper-api`（`repo.papermc.io`）；版本串 `26.3.build.178-stable` **与 Javadoc 站 `asOfVersion` 逐字相符**，且是 maven 版本列表里的真实条目。

## 本档的证据口径（重要）

- 出处都指到本仓语料：签名面 `data/spigot_stable/spigot-javadoc/stable/processed/<fqcn 扁平化>.md`、`data/paper-api_stable/paper-javadoc/stable/processed/`；教程正文 `data/paper_stable/paper-docs/stable/`（**CC BY-SA 4.0**）。
- **本档不复述教程原文**（避免 ShareAlike 外溢），只写结论 + 出处指针。
- ⚠ **两个签名面只有签名、没有描述散文**（实测 `org_bukkit_event_EventHandler.md` 无描述段）⇒ 凡「某某该怎么用」的道理，**只有在本次实测过的情况下才写**，并标明条件；否则写进「未核实」。

## 未核实（明写，别当已知）

- 本档**未逐个覆盖**各事件类的字段/方法（01-events 已给两条已核例子作范式：`PlayerEvent.md:15` / `PlayerJoinEvent.md:14`）—— 其余要用就查：`get_doc_full platform=spigot id=stable/<fqcn 扁平化>`。⚠ **注意签名页只列本类声明的成员**：`getPlayer()` 在父类 `PlayerEvent` 上，不在具体事件类上（我先前引错过一次）。
- Paper 的**历史档**：**实测（2026-10-15）`jd.papermc.io/paper/26.3` · `/1.21.4` · `/1.20.4` 全 HTTP 200 可达** —— 但**本仓只落了 `26.3`**。⇒ 这是**本仓的覆盖缺口**（不是"上游没有"），与 fabric 那 7 档「上游从来没有 docs 树」**性质不同** —— **可以补抓，只是没抓**。
## 服务端面的自测强度分级（**按能力定** · 2026-10-16 用户裁定）

**为什么不套模组面那根轴**：模组面 `PLAYTEST_VERIFIED_TIER` 按 `platform × version × mappings` 定，而**服务端面没有 `mappings`**（Bukkit 抽象层，插件代码不碰 `net.minecraft.*`）⇒ 同轴套不上 ⇒ **本面按「能力」定**。

**证据强度五档**（低档不成立时，高档不得声称）：

| 档 | 含义 | 判据 |
|---|---|---|
| **E1 静态** | 签名/官方出处已核 | 语料或官方页的 `文件:行`（出处门可解析） |
| **E2 编译** | 真构件编译过 | `javac` rc=0（classpath 实测 6 件） |
| **E3 真机·手动触发** | 真服务端跑通，但触发是**手动**的 | marker + 真机日志 |
| **E4 真机·自发** | 触发由服务端/玩家**自发**（无人工 `callEvent`） | marker + 真机日志 |
| **E5 真机·跨进程** | 跨进程重启后仍成立 | 两阶段：写→停服→新进程读回 |

**能力 × 当前最高档**（每条都能追到 marker）：

| 能力 | 最高档 | 证据 |
|---|---|---|
| 权限·编程式（4 常量真值表 / ctor / `getChildren`） | **E3** | `v-permission.ok` |
| 权限·声明式（`true`/`op`/`false`/`not op`） | **E3** | `v-perm-declared.ok` · `v-perm-declared-more.ok` |
| 权限·**非法字面量**（否定结论） | **E3** | `v-perm-permission-lit.FAIL` · `v-perm-numeric-lit.FAIL` + Bukkit `is invalid` 栈 |
| 物品栏本体（createInventory / set-get / `addItem` 溢出） | **E3** | `v-inventory.ok` |
| **GUI 交互**（open / click / close） | **E4** | `v-inv-open/click/close.ok` —— ⚠ 起先是**人点**；2026-10-16 起**driver 自点**也成立（客户端侧 `gui class=ContainerScreen clicked=true`） |
| **放置（右键放置方块）** | **E4（driver 自放）** | `v-pdc-place.ok` —— 由驱动器在客户端**自动完成真实放置**（无需人）。实现路径与三条坑见 **`09-traps.md` 的 T11**：`setDown` 驱动不了动作键 → 走 `KeyMapping.click` → 仍不行 → 走 `gameMode.useItemOn` + **自算射线 `player.pick`**（`client.hitResult` 在连服档是冻住的） |
| 事件·手动派发链 | **E3** | `v-event.ok` |
| 事件·**自发**（`ServerTickStartEvent`） | **E4** | `v-event-tick.ok` |
| 事件·**玩家自发**（`PlayerJoinEvent`） | **E4** | `v-player-join.ok` |
| 事件·控制台路径（stdin） | **E3** | `v-event-stdin.ok` |
| PDC·同进程（World / ItemStack） | **E3** | `v-pdc.ok` · `v-pdc-itemstack.ok` |
| PDC·**跨重启**（World / Chunk / **TileState**） | **E5** | `v-pdc-persist.ok` · `v-pdc-chunk.ok` · `v-pdc-tilestate.ok` |
| PDC·跨 holder 不复制（**官方原形态**：放成方块带 `TileState`） | **E4** | `v-pdc-place.ok` —— 手上物品侧 `on-item`、放置出的方块侧 **`null`**（与 `api__pdc.md:226/:228` 一致） |
| PDC·跨 holder 不复制（`ItemStack`→`Item` 实体形态） | **E3** | `v-pdc-crossholder.ok`（**另一形态**，与官方那条不等价） |
| PDC·**Entity 跨重启** | **未达成** | `v-pdc-entity-persist.FAIL`（实体数=0，原因未定） |
| 调度器·同步 `Consumer` 重载 | **E3** | `v-scheduler-consumer.ok` |
| 调度器·**异步**（`runTaskAsynchronously` / `…TimerAsynchronously`） | **E3** | `v-scheduler-async.ok` · `v-scheduler-async-timer.ok` |
| 文本组件·发控制台 | **E3** | `v-text-sent.ok`（落点 = 服务端日志） |
| 文本组件·**发真人玩家**（明文 / `MiniMessage` / 可点击悬停） | **E4** | `v-chat-sent.ok` · `v-chat-clickable.ok`（落点 = **客户端日志**） |
| 命令·Brigadier 跨版本 | **E1** | 两版件类清单 + javadoc 形参名 |
| `plugin.yml`·字段与加载顺序 | **E1** | 官方页逐节（`###` 全覆盖） |
| 起实例必备配置 | **E3** | 各次真机跑（`09-traps.md` 的 T9/T10） |

⚠ **本表只填"已达成的最高档"**；**低档不因高档存在而免检**（到 E4 了仍要过 E2 编译）。
- ~~服务端侧的权限/物品栏等在真机上的行为~~ —— **2026-10-15 已全部真机验证**。**含真 26.3 客户端接入后验的玩家类事件**：`PlayerJoinEvent` · `InventoryOpenEvent` · **`InventoryClickEvent`（人工点击，`getAction()` 实测出现 `NOTHING`/`PICKUP_ALL`/`PLACE_ALL` 三个不同值）** · `InventoryCloseEvent` · **真人玩家的权限判定**（非 op 玩家：`default: true` → true、`default: op` → false）；以及 **`World` 与 `Chunk` 的 PDC 跨进程重启**。证据在各篇的「已真机核」段与 `09-traps.md` 的 **T9**（含起实例的必备配置清单）。
