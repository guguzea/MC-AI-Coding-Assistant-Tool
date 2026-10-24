# yarn-mappings.sqlite = 「类名存在性」合法来源（五条边界）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「第三步 · yarn-mappings.sqlite」的**详细内容落点**。
> 根纲保留「它只证名字存在、不证用法」这条定性；这里存五条越界即失效的边界、
> `assert-skill-yarn-attest` 的四条判据与两条收紧、以及四态读法。

### yarn-mappings.sqlite = 「类名存在性」合法来源

`data/fabric_<ver>/mappings/yarn-mappings.sqlite` 是 Fabric/Quilt 档的**第二出处**，但边界就五条，越过即失效：

1. **只证存在，不证用法**。它能回答「该版本 Yarn 里有没有 `GoalSelector` 这个名字」，回答不了「怎么调、参数是什么、返回什么」。签名/流程/为什么仍须 `search_fabric_docs` 或反编译源码（`get_minecraft_source`，需 JDK 17+）。**拿到 `found` 就当会写，是本门要拦的原罪。**
2. **只含 vanilla 名，不含 Fabric API**。`net.fabricmc.fabric.api.*` 不在 Yarn 映射里 ⇒ Fabric API 类名仍只能走本档语料（`search_fabric_docs` / `get_fabric_doc_full`），查不到就留 `// TODO(未核实)`。
3. **它能认出"不是本档 Yarn 名"，认不出"那是 mojmap 名"**。`MobEffect` / `Level` / `ServerLevel` / `ResourceLocation` 在该档 sqlite 里 0 命中，而 Yarn 对应名（`StatusEffect` / `World` / `ServerWorld` / `Identifier`）都有类 —— sqlite 只会说"没这个名"，说不了名字的来源 ⇒ 门另持一张 `MOJMAP_ONLY` 名表。
4. **Fabric 语料本身就是 mojmap 写的**：`data/fabric_<v>/reference/<v>/build.gradle` 钉 `mappings loom.officialMojangMappings()`。⇒ **「本档语料逐字命中」这条腿会替 mojmap 名背书**。抄语料进 Yarn 工程前必须换名并以 Yarn 源码核签名；Skill 正文引用 mojmap 原名时**必须**带「`### ⚠️ 映射口径：本档语料是 mojmap`」披露块并逐名点名，否则门红。
5. **文件名里的 yarn 会骗人**：`data/forge_<ver>/mappings/yarn-mappings.sqlite` 实为 `forge-srg`（6 档）/ `tsrg`（1.13.2）/ `mcp-csv`（1.14.4、1.15.2）——`classes.named` 装的是 MCP `func_/field_` 名，`intermediary` 列与 `named` 逐行相同（无信息）；且 **1.14.4 / 1.15.2 的 classes/methods/fields 三表 0 行**（meta 里的计数只落在 `searge_*` 表）。⇒ 门读 `meta.mappingEra` 并要求三表真有行；**禁止**按文件名去 forge 档取 Yarn 名。

执行：`node mcp-server/scripts/assert-skill-yarn-attest.mjs`（清单 = `mcp-server/scripts/skill-yarn-attest.files.txt`，只收 `fabric/` 已补正文的源稿）。Forge 档不走本门（那里没有 Yarn 名可查），改按「该标识符在本档 `data/forge_<ver>/**` 原文里逐字出现」核，查无即 `// TODO(未核实)`。判据四条：围栏代码块内标识符须「本档语料逐字命中」**或**「本档 yarn 映射命中」；负例行（同行带 禁止/未核实/零命中）不判红；命中 `MOJMAP_ONLY` 且本档映射查无的名字**必须**在披露块里点名。**两条收紧**：① 语料侧的**注释行不算出处**（上游页里被注释掉的旧示例、javadoc 续行、`<!-- -->` 段常留着早已失效的类名）；② 映射腿按**四态**读（`absent` / `unreadable` / `era` / `zero-rows` / `ok`），库**存在但读不动** ⇒ 主门直接红并点名 `SQLITE-UNREADABLE`（读失败不得塌成「查无此名」），且 `MOJMAP_ONLY` 那道否决腿的判据是「映射腿有没有**证出**该名」而非「能不能读」⇒ 毁库/清空库不再能关执法。已挂在 `test-scripts.mjs` §#17，带 `--selftest` 40 组夹具与真文件两臂。补正别人写的 Skill 时把该文件追加进清单即可。
