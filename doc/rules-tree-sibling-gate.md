# 规则树面兄弟门（assert-rules-api-names）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「第三步 · 规则树面另有一道兄弟门」的**实现细节落点**。
> 根纲保留「给规则树新增类名前先跑本门」这条铁律；这里存判据、分工、棘轮与执法面。

### 规则树面另有一道兄弟门

`node mcp-server/scripts/assert-rules-api-names.mjs`。它**不读清单**——直接扫 `fabric/<ver>/.cursor/rules/*.mdc` 全部 154 件；棘轮基线 `mcp-server/scripts/rules-api-names-baseline.json`，豁免台账 `mcp-server/scripts/rules-api-names.exemptions.txt`（六列 TAB，`basis` 只许 `corpus:<路径>:<行>` / `mapping:<档>` / `fapi-roster` / `user-approved:<L号>` 四形，条数上界 0 且只许降）。

- **判据**：围栏内类名在**本档** yarn 映射查无 ∧ intermediary 等价类给出本档正解 ∧ 处强类型位 ∧ ¬限定名右段 ∧ ¬箭头简写行 ∧ 锚唯一 ∧ 非 Fabric API 碰撞名 ⇒ 红【RENAME-STALE】，红行自带「本档该叫 X ｜ 锚 class_N ｜ 跨档版本链」。真树现 0 红。
- **与 `assert-skill-yarn-attest` 的分工**：那道门管**技能源稿**的「名字有没有出处」，本门管**规则树**的「名字跟没跟丢版本」；两门映射腿共用 `mcp-server/scripts/_lib/api-name-collector.mjs`，四态读法（`absent` / `era` / `zero-rows` / `unreadable` / `ok`）与「读失败不得塌成查无此名」同口径。**Forge 档不走本门**（那里没有 Yarn 名可查）。**quilt 档同样不走本门**：两门都只扫 `fabric/`；要接 quilt 面，前置是**先建出处**（quilt-loader 的 sources jar ＋ 一个不借邻版的坐标源），不是先扩门。
- **执法面**：挂在 `mcp-server/test-scripts.mjs` §#23，除真树 rc=0 外另有八臂活证（旧名必红 / 只换标识符必绿 / 奇偶不闭合围栏必红并逐件点名 / 从键集齐全的基线里删一条地板键必红 / FAPI 与 vanilla 同名类必须被第二否决源挡下 等）。缺基线、地板跌破同样判红；摘要件**在盘但解析不动** ⇒ 按来源分别点名 `[FAPI-SUMMARY-UNREADABLE]` / `[LOADER-SUMMARY-UNREADABLE]`（不得塌成「该档没有 FAPI 名」）。门自带 `--selftest` 与 `--measure-floors`（只打印建议值，**绝不自动写基线**）。
- **给规则树新增类名前先跑本门**。桶 4 / 桶 5（本版没有的名字与切词器噪音）不判红，走 `--queue=<绝对路径>` 出 TSV 人工审；**桶5 不收编进豁免**：收编要么造上千条假红，要么给「豁免条数上界 0 且只许降」开永久口子 ⇒ 门改为自印三分类读数当切词器健康度看，**不进 rc、不进基线、不作判据**。
- **改 `.cursor/rules` 正文后必须刷 7 面镜像**：`powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sync-skills.ps1 -TargetDir <平台>/<档>`（该脚本会同步写入，并**删除**目标镜像目录里源稿已不存在的多余 skill/rule/command 文件）。不刷 ⇒ `assert-skill-mirrors` 真实跑档红（该门真跑已挂进 `test-scripts.mjs` 的 `REAL_RUN_GATES`）。

门的分片史、逐档读数与旧口径作废记录见 `mcp-server/CHANGELOG.md`。
