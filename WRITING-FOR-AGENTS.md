# 作者规范 — 怎么写给 agent 读的文档

**管什么**：动笔（或改动）以下任一面时先读本篇 —— 根 `AGENTS.md`、平台树 `.cursor/rules/*.mdc` 与各档 `AGENTS.md`、Skill 源稿（`knowledge/libs/**/SKILL.md`、`.cursor/skills/`、`common_skill/`）、工作流模板体（`mcp-server/src/prompts/templates.ts`）与 `mcskill://` URI 正文、`CORPUS_PROVENANCE.md` 与社区短文。
**不管什么**：面向人的文档（`README*`、`AUTO_SETUP`）不受本篇约束，但形状尽量照 §1–§7 写。
**冲突时**：根 `AGENTS.md` 管"做什么"，`CONTRIBUTING.md` 管数据链与验证口径；本篇只管"怎么写"，三者打架以前两者为准。

---

## §0 两种负载

任何 agent 文档同时在花两种预算，落笔前先分清这份文档是谁、在什么时候读：

- **上下文负载**：文档常驻对话窗口时每轮都在花的 token/注意力。常驻面 = 根 `AGENTS.md` 与底座规则（00/01/09）——这些面的**每一行**都按"每轮都相关"标准审。
- **认知负载**：人要记住"有哪些文档、何时会取到它"。这是人类能动性的价格 —— 值得记的地方（判权、口径）花，不值得的地方（实现史、逐档读数）删或并。

`get_workflow_template` 的模板体、`knowledge/`、`community_knowledge/` 都是按需展开面，不计上下文账 —— 它们要守的是**指针质量**（见 §2），不是行数。

## §1 三级信息层级与分叉测试

文档内容只有两种：**步骤**（有序动作）与**参考**（按需查的定义/规则）。按层级放：

1. **文件内步骤** —— 主流程，按序执行；
2. **文件内参考** —— 就在同文件，按需查；
3. **指针披露的参考** —— 单独成文件，只有部分分支会取。

分叉测试是判级最干净的刀：**每个分支都要的留在原地，只有部分分支会取的推到指针后面。**

配套两条：

- **同址**：一个概念的正文、规则、注意放同一节，别撒到多处；写出来的东西应该读起来像"写给 agent 的文档"，不是像 changelog。
- **蔓延**：失败形态是"每行都活但整篇太长"。出现蔓延就降档：细则移指针文件、实现史移 `mcp-server/CHANGELOG.md` 或 `CORPUS_PROVENANCE.md`（那里是取证史的家）。

## §2 指针句

指针的可靠性取决于**措辞**，不取决于目标存不存在。一条合格的指针句三件齐：① 点名工具/路径（可直接复制的参数）；② 带触发条件（"改了 `mcp-server/src/**` 之后""用户只给模糊描述时"）；③ 给失败读数（"返回 `PACK_NOT_FOUND` 就停，禁止拿邻版顶上"）。

反例："相关规则见文档。" 正例："`activate_platform_pack action=session`（platform + 精确 MC 版本）；返回 `PACK_NOT_FOUND` ⇒ 本档无规则树，改口 `search_*_docs`，禁止读邻档 00–10。"

## §3 每步一个完成判据

每个步骤收尾于一条判据，并同时满足两个性质：

- **清晰**：能区分"做完了"与"没做完"，不给"基本 OK 即可"这种模糊边界。
- **要求度**：判据要可检查且穷尽。强判据写法："frontier 清空，没有任何分支还在被默认"、"证据三件齐（`state.json` / `exit-code.txt` / `qa.log`）且 `exit-code=0`"、"每个名字带出处或 `// TODO(未核实)`"。

按序拆段：后续步骤先别暴露 —— 一次摆十步会诱导提前完成；只在当前步完成后才该看到的细则，推到指针后面或下一节。

## §4 措辞：正向默认，负向留职，前导词优先

- **正向默认**：指令尽量说"该做什么"，而不是堆"禁止 X"。纯风格性的禁令改成正向要求（"每条出处给页 id/URL/规则编号三者之一"优于"禁止只写『最佳实践』"）。
- **负向留职（本仓库实况，Matt 原文没有）**：防幻觉与破坏性操作两类，负向是承重结构 —— 模型确实会编 API 名、确实会误删跟进料，"不得凭训练记忆补名字""禁止拿邻版 API 补全"这类**保留原形**。判据：**安全负向留职、风格负向转正**；两条都占时写成配对（先说该怎么做，再补禁止什么），不是二选一。同一禁令别在多处原样重复（重复抬高 prominence）；要钉多处行为，用"一条权威行 + 指针句"，安全语义逐字保。
- **前导词**：用模型预训练里已有的紧凑概念锚行为，比一串形容词便宜。本仓已在用的例子：`fail-closed`、`棘轮基线`、`正反臂`、`放养`、`并集，永不替换`。新文档优先复用既有前导词，别造同义新词（`tight` 就别说"紧凑"，统一用一个）。

## §5 修剪

逐行自问三件事：

1. **这条还活着吗** —— 模型本来就会做、或环境已经表达的，不配占一行。`package.json`、目录结构、钉值文件本身就是真相源；文档复述"Node >= 22.5"这种环境事实时指针给它，别手抄一份等着过期。
2. **这条有几个家** —— 同一语义单源；实现史、修订记录一律住 `mcp-server/CHANGELOG.md` / `CORPUS_PROVENANCE.md`，正文只留现行口径。
3. **分歧怎么裁** —— 按运行文档定，不按读者感觉定。拿不准一条指令有没有用，最便宜的裁决是：照文档跑一遍 agent，看行为。

## §6 位置图：什么内容放哪、谁触发

| 内容 | 去处 | 谁读 / 何时读 |
| --- | --- | --- |
| 跨平台、跨版本、纯流程 | `common_skill/<kebab>/SKILL.md` | 按需展开；装到 `~/.agents/skills/` 后全会话可触发 |
| 平台 × 版本开发知识 | 平台树 `.cursor/rules/` + `knowledge/` + 各档 `AGENTS.md` | session 注入（默认 00/01/09，topics/task 追加） |
| 库模组用法 | `knowledge/libs/<组>/mc-<name>/SKILL.md` 源稿 | 按组映射直读，不落平台镜像（例外是档内工程稿，如 cloth 标记行） |
| 工作流人在环清单 | `templates.ts` 模板体 | `get_workflow_template` 按需 |
| 实务口径与坑位 | `community_knowledge/authored/` | `search_community_docs` 按需 |
| 数据链、门、取证史 | `CONTRIBUTING.md` / `mcp-server/CHANGELOG.md` / `CORPUS_PROVENANCE.md` | 维护会话按需 |
| 每轮都相关的铁律 | 根 `AGENTS.md` | 常驻 —— 只准放"每轮都可能用到"的行 |

**两层调用**（编排与纪律分开）：编排型 = 用户点名触发、只负责调用与止损；纪律型 = 任务匹配时可被模型自取。编排型不调用另一个编排型；纪律型可被编排型调用。**本仓实况**：宿主没有 Matt 的 `disable-model-invocation` 硬闸，"用户点名"靠 description 的触发词 + 正文 `边界` 节软约束 —— description 必须三件齐：**干什么 / 什么触发 / 什么时候不触发**（反例："帮助开发模组。" 正例：`mc-grill` 的 description）。

**新增 `common_skill/` 技能三处同步**（漏一处 = 宿主与工具面脱钩）：源稿本身、`mcp-server/src/prompts/templates.ts` 模板体 + `mcp-server/src/wave/register.ts` 名单 + `mcp-server/src/platform-pack/session.ts` `TASK_SPECS` 登记、本机拷贝安装。拷贝纪律只有一条：先改源稿，再拷贝刷新；出现不一致以源稿为准重拷。`mcskill://skill/<名字>` 登记由盘派生，新增源稿自动可达。

## §7 出处形状（本仓铁底线，Matt 原文没有）

给 agent 读的文档里，每个 API 名、版本口径、计数，要么带可核出处（`search_*_docs` 命中页 id、语料 `路径:行`、`query_loader_api`、用户自备 jar），要么留 `// TODO(未核实)`；计数带分母 + 口径 + as-of。查文档的入口按平台走 `search_forge_docs` / `search_fabric_docs` / `search_neoforge_docs` / `search_docs`。数据链读法的权威在 `CONTRIBUTING.md` §数据链口径，本篇不重抄。

## §8 新增/改动文档 checklist（步骤 + 完成判据）

1. **定负载定位置** —— 先回答"谁读、每轮读还是按需读"，按 §6 位置图选去处；常驻面内容逐行过"每轮都相关"测试。
2. **写正文** —— 步骤/参考分级（§1），每步完成判据齐清晰与要求度（§3），指针句三件齐（§2），风格禁令正向化、安全禁令配对写（§4）。
3. **出处关** —— 全文名字逐个给出处或 `// TODO(未核实)`（§7）。
4. **登记与同步** —— Skill 源稿含闭合围栏代码的，frontmatter 声明非空 `mappings:`（门：`mcp-server/scripts/assert-skill-mappings-key.mjs`）；改 `.cursor/rules` 正文后刷镜像面（`scripts/sync-skills.ps1`，门：`assert-skill-mirrors`）；新平台/新受管目录命中根 `AGENTS.md` §交付汇报的受管清单时同步该行；新增 `common_skill/` 技能走完 §6 的三处同步。
5. **跑门链** —— 动了 `mcp-server/scripts/**` 或 `scripts/**` 后收口必跑 `cd mcp-server && node test-scripts.mjs`；只动 prose 至少跑 `node test-core.mjs`。新加的门必须带 `--selftest` 正反臂（投毒必红、摘掉必绿）。本篇执法面 = `mcp-server/scripts/assert-authoring-lint.mjs`（J1 frontmatter / J2 过期路径 / J3 纯负向棘轮；基线与豁免同目录）。
6. **记账** —— 改工具面（`mcp-server/src/**`）在同轮 `mcp-server/CHANGELOG.md` 落一条批次；纯文档改动可免。
7. **自审读** —— 通读一遍：一个**零本会话记忆**的接手 agent 照这份文档执行，会在哪一行猜？猜的位置全部改掉。

**整篇完成的判据**：第 1–7 步全部可打勾，且文档本身读起来像写给 agent 的文档 —— 没有实现史、没有重复语义、没有只靠读者脑补的指针。

## §9 本篇的来源与边界

形状改编自 mattpocock/skills 仓库 productivity 桶的 writing-for-agents 技能正文（2026-10-09 读取核对）。三处他没写、本仓另加的：**出处形状**（§7，防幻觉是本仓第一失败模式）、**安全负向留职**（§4 例外段，他一律反对负向，我们两类负向是承重结构）、**登记/同步/门链**（§8 第 4–6 步，我们的执法面）。
**边界**：本篇不判"写什么"（设计权在用户）、不替代 `CONTRIBUTING.md` 的验证纪律、不覆盖平台规则里"本档 API 逐件写法"（那些以本档语料为准）。
