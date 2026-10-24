# Fabric ≤1.21.11：讲解基线 = Yarn，Mojmap 作对照列

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「第三步 · Fabric ≤1.21.11：讲解基线」的**详细内容落点**。
> 根纲保留裁定本身与「基线 = Yarn / mojmap 作对照列」这条定性；这里存派生对照表的出处、
> 读侧取数与生成器的写盘纪律、以及 `mappings:` 键的闸门。

### Fabric ≤1.21.11：讲解基线 = Yarn，Mojmap 作对照列（2026-09-20 用户裁定①）

不是「收敛到 mojmap」，也不是「只教 Yarn 不提 mojmap」：

- **基线**：`fabric/<v>/scaffold` 与各档 `verified-api-<v>.md` 用 Yarn 名（1.21.4 / 1.21.8 / 1.21.10 三档核实表通篇 `CustomPayload.Id` / `PacketCodec`，0 个 mojmap 名）。维护老模组、写 Skill、答签名 → 一律按 Yarn 落笔。
- **对照列**：上游 Fabric 文档页正文是 **mojmap 写法**（`GuiGraphics` / `PoseStack` / `ResourceLocation` / `StreamCodec`）。看到它们是**口径差异，不是另一套 API**；回本档代码要换名。逐件对照写在每件 Skill 正文的「`### ⚠️ 映射口径：本档语料是 mojmap`」块里。
- **对照数据出处**：Mojang `client.txt` ⋈ `data/fabric_<v>/mappings/yarn-mappings.sqlite` 的 **obf 短名 join**。**原始 `client.txt` 仍不入库**——它被 `.gitignore` 排除，文件头许可证「may not redistribute the mappings complete and unmodified」。**按它 join 出的派生对照表已发布进仓库**：`data/_yarn-mojmap-pairs/`（逐档 `yarn-mojmap-<v>.json` + `index.json` + `yarn-mojmap-pairs-provenance.json`，逐件 sha 钉在后者；表里只有 `obf / mojmap / yarn` 三个类名与两侧 FQCN，不含成员名，也不是任何上游文件的原样拷贝）。读侧默认取这份 —— `mcp-server/scripts/assert-skill-mappings-key.mjs`（leg2）与 `assert-cross-layer-names.mjs` 按「仓库副本 → `$MC_SKILL_CACHE/yarn-mojmap-pairs` → tmpdir」取第一个真有 `index.json` 的落点，显式 `--pairs-dir` 一律照办；生成器 `build-yarn-mojmap-pairs.mjs` **仍只写缓存、从不写仓库**（要更新仓库副本按该目录 provenance 的 `refreshHint` 人工复制）。⇒ 干净 clone 现在判得了「键值 ↔ 正文实名」这条腿，但**Skill 正文里继续只写逐件用到的少数名字，不得整段抄表**。档数与类名对计数见 `CORPUS_PROVENANCE.md` §5。
- ⚠️ **「Loom 新版本默认 mojmap、不必再声明 `yarn_mappings`」是错的**：mappings 一行必须显式写；官方模板用 `loom.officialMojangMappings()` 那是**显式改用 mojmap**，而 `migrateMappings --mappings` 的默认值反而是 `net.fabricmc:yarn:<version>:v2`（`develop_porting_mappings_loom` 「Other Configurations」）。
- **闸**：含闭合围栏代码的 Skill 源稿必须声明非空 `mappings:` 键 —— `mcp-server/scripts/assert-skill-mappings-key.mjs`（挂在 `test-scripts.mjs` 默认门链）。键值与正文实名的一致性腿仍开账（台账 `skill-mappings-value-matches-code`）。
