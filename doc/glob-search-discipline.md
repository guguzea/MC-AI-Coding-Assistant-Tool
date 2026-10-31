# 检索纪律：在 data/** 下按目录搜索必须显式给 glob

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「⚠⚠ 检索纪律」的**实验与取证落点**。
> 根纲保留两条规矩（必须给 glob；否定性断言前必须逐文件复核）；这里存四组对照实验、
> 已排除项与那次假否定事故的完整经过。

### ⚠⚠ 检索纪律：在 `data/**` 下按目录搜索**必须显式给 `glob`**

**这是调用姿势问题，不是检索工具坏了**（2026-10-15 四组对照实测；下表是该日的读数，工具行为若变以当次实测为准 —— 结论「给 glob」在复测前照样执行）：

| 实验 | 路径 | `glob` | 结果 |
|---|---|---|---|
| A | `data/paper_stable/paper-docs/stable/processed` | **不传** | **0 命中**（假） |
| C | 同上 | `*.md` | **44 命中** |
| E | 同上 | `*`（裸星号） | **44 命中** |
| D | `paper/26.3/rules`（**不在** `data/` 下） | 不传 | **10 命中**（正常） |

同一目录、同一词（`Bukkit`）——⇒ **变量只有 `glob`**，与 pattern 是否含中文或 `|` 无关（含中文的 `MONITOR|EventPriority|监听器|priority` 带 `glob` 时照样命中 4 个文件）。**只在 `data/**` 下发作**（`data/` 下疑似有默认过滤或整目录剪枝；**具体机制未核实**，此处只报实测）。另已排除 `.gitignore`：`git check-ignore -v <该面文件>` = **exit 1（未忽略）**。

> ⚠️ **复现状态（2026-10-30）**：本轮复核时同目录同词带/不带 `glob` **未复现**上表差异（两档读数一致；具体读数与机制未核实）。**纪律保留**：这条规矩的依据是「假否定比『未核实』更糟」这类代价，不是「当前一定有 bug」；在 `data/**` 下做目录搜索仍请显式给 `glob`，做否定性断言仍须逐文件复核。旁证：本节读者可用任意检索手段核该目录里含 `Bukkit` 的 `.md` 件数（2026-10-30 盘上实测 28 / 67 件）。

**两条规矩**：

1. **在 `data/**` 下做目录搜索，必须显式给 `glob`**（`*.md` 或 `*`）。不给就可能拿到**假的 0 命中**。
2. **做否定性断言（"本仓没有 X"）之前，必须逐文件复核** —— 不能只凭一次目录搜索。2026-10-15 我据一次假 0 命中把「`MONITOR` 只能观测不能改」写成"本仓无从核实"，而官方在 `data/paper_stable/paper-docs/stable/processed/api__event-api__event-listeners.md:100-103` 有**逐字说明**（"The `MONITOR` priority is used to monitor the event, but not change it."）。**假否定比"未核实"更糟：它会把有出处的结论删掉。**

已核实边界（引用前先核，别外推）：driver **真代码**覆盖 = `PLAYTEST_VERIFIED_TIER`（`mcp-server/src/generators/playtest-driver.ts`，**唯一真源、随逐档 javap 取证扩面 —— 正文不数档**；逐版本清单直接读该表）。

- **验证强度三等**：① **真机跑通** = 26.x 十档（fabric 5 + neoforge 5）；② **真构件编译验证**（javap 取证 + `javac` 对**真** jar，JDK 8 腿覆盖 `fabric 1.14.4`/`1.16.5` 与 `forge 1.12.2`/`1.13.2`/`1.14.4`/`1.15.2`/`1.16.5`）——**编译验证 ≠ 真机验证**；③ **替身腿** —— **「替身只证签名形状，不证类存在」**，判某类在该版存不存在必须拿真构件。
- **能力天花板（分路线读，别当整条链的上限）**：
  - **driver 路线 = 玩家级**（`temporary_client_tick_driver` / `in_jvm_player_agent`，仅 `PLAYTEST_VERIFIED_TIER` 内的档）：真按键原语 `forward` / `back` / `left` / `right` / `jump` / `sneak` / `sprint` / `attack` / `use`（`playtest-driver.ts` 的 `press()`）+ 步骤 `move` / `goto` / `break` / `gui` / `look` / `scan` / `shot` / `assert` ⇒ **走位 / 跳跃 / 挖掘 / GUI 交互在 driver 档上都做得到**。
  - **桥路线 = 命令级**（`external_bridge` / `playtest_bridge`）：发聊天包、**不是键位输入** ⇒ 读数 / 观察 + `/tp` `/setblock` 这类命令可用（受实例 op 约束）；**走位 / 跳跃 / 挖掘耗时 / 碰撞 / GUI 点击测不了 —— 这一条只限定桥路线**。桥路线现成件覆盖 `BRIDGE_MOD_TARGETS`（`forge 1.7.10–1.12.2` 六档 + `rift 1.13`/`1.13.2` + `modloader 1.6.4`，**正文不数档**，以数组现读为准）；动作 10 个、恰好覆盖 `playtest_bridge await` 的 5 个 condition（**动作名与 `params` 键名以工具源码 `src/playtest-bridge/index.ts` 的 `probe()` 为准**），不可用动作按档 fail-closed（`1.7.10` 聊天、`1.9.4–1.12.2` `use_item`、`rift` 聊天 + `use_item`、`modloader` 全部）。`liteloader 1.12.2` = hybrid 档（vanilla/Forge 面与 `forge 1.12.2` 同表）；纯 litemod 不在本链；`quilt` 全族只有 javap / 派生面、无编译验证。表外平台 / 版本一律结构壳（须先取证）。
- **会改变判断的 API 事实**：`fabric` 全族 1.19.4 以下**没有客户端消息事件** ⇒ `goto parsed` 只走 latest.log 兜底、解析不到 fail-closed 判红；**26.2+ 两处 API 变化**（`getMainRenderTarget()` 删 ⇒ `Screenshot.grab(client,false)`；`Minecraft.screen`/`setScreen` 删 ⇒ `client.gui.screen()`/`client.gui.setScreen(x)`）由 `apply26xxShared` 按 `m26(version)>=2` 分支处理；客户端**实体只在追踪范围（≈48 格）内可见** ⇒ 实体断言要靠近目标，方块证据不受此限。三平台生成物含中文注释 ⇒ 编译**必须** `-encoding UTF-8`。

逐档改写表、命名层差异、字段名对照与**逐轮取证史**见 `community_knowledge/authored/ingame-playtest-automation.md`（那是「口径与坑位」的家）。

交付格式：聊天只给三件（文末「§交付汇报」）；判档、主档四块 / 维护档六块、受管面清单与两档硬约束在 [`REPORT-FORMAT.md`](./REPORT-FORMAT.md)，编号块正文落 [`DELIVERY_LOG.md`](./DELIVERY_LOG.md)。
