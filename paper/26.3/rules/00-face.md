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
- 服务端**自测强度分级**的形状（本仓没有服务端版 `PLAYTEST_VERIFIED_TIER`）
- ~~服务端侧的权限/物品栏等在真机上的行为~~ —— **2026-10-15 已全部真机验证**。**含真 26.3 客户端接入后验的玩家类事件**：`PlayerJoinEvent` · `InventoryOpenEvent` · **`InventoryClickEvent`（人工点击，`getAction()` 实测出现 `NOTHING`/`PICKUP_ALL`/`PLACE_ALL` 三个不同值）** · `InventoryCloseEvent` · **真人玩家的权限判定**（非 op 玩家：`default: true` → true、`default: op` → false）；以及 **`World` 与 `Chunk` 的 PDC 跨进程重启**。证据在各篇的「已真机核」段与 `09-traps.md` 的 **T9**（含起实例的必备配置清单）。
