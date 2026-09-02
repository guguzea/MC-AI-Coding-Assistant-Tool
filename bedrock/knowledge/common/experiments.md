# 实验开关分层

世界实验的 NBT 结构已核实：`level.dat` → `experiments` compound → 每个功能一个 **byte tag，值 1**（关闭 = 删掉该 byte tag）。游戏 UI「Beta APIs」对应键名 **`gametest`**。出处 = wiki.bedrock.dev/nbt/enabling-experiments（2026-09-02 取）——**社区权威（Bedrock OSS），非 Microsoft Learn 官方**。pack JSON **打不开**玩家世界的「Beta APIs」。与规则 07 / 09 同一口径。

| 层 | 写什么 | 哪里 | 核实状态 |
|----|--------|------|----------|
| Pack 能力 | capabilities（chemistry / editorExtension / experimental_custom_ui / raytraced / pbr；Learn **未列出** script_eval） | manifest.json | Learn pack-manifest |
| Script 模块 | dependencies 里 @minecraft/server 的 beta | BP manifest | Learn scripting intro |
| 世界实验 | `experiments` compound 里的 byte tag（值 1；关闭 = 删 tag）；「Beta APIs」= `gametest` | 世界设置 UI；Minecraft Education / BDS 无 GUI → 手改 `level.dat` | 社区权威（wiki.bedrock.dev，2026-09-02）**非 Learn 官方** — 键名只作手工分诊，禁止当官方 API 输出 |

Learn（须带 `view=minecraft-bedrock-stable`）：

- Experimental Features Toggle：https://learn.microsoft.com/en-us/minecraft/creator/documents/experimentalfeaturestoggle?view=minecraft-bedrock-stable
- Pack manifest：https://learn.microsoft.com/en-us/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable
- Script API introduction：https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/introduction?view=minecraft-bedrock-stable

wiki.bedrock.dev/nbt/enabling-experiments（2026-09-02 取）= 上面「世界实验」行的出处。页内证据：表头 `Feature Name (In-Game) | Feature Name (NBT)`，`Beta APIs | gametest` 在该页 1.21.120 / 1.21.110 / 1.21.100 三张表中各出现一次；页内另写明世界带实验加载后会自动出现 `experiments_ever_used` 与 `saved_with_toggled_experiments` 两个 byte tag（不是人手写的）。该站是 Bedrock OSS 社区站，页脚自陈与 Microsoft 无隶属关系：**键名只用于手工改 `level.dat` 分诊，不得当作官方 API 规范写进 pack 文档**；API 仍以 Learn / `search_bedrock_docs` 为准。
