# 实验开关分层

世界实验开关的 **NBT 键名未核实**（不要写死 `level.dat experiments.gametest`）。pack JSON **打不开**玩家世界的「Beta APIs」。与规则 07 / 09 同一口径。

| 层 | 写什么 | 哪里 | 核实状态 |
|----|--------|------|----------|
| Pack 能力 | capabilities（chemistry / editorExtension / experimental_custom_ui / raytraced / pbr；Learn **未列出** script_eval） | manifest.json | Learn pack-manifest |
| Script 模块 | dependencies 里 @minecraft/server 的 beta | BP manifest | Learn scripting intro |
| 世界实验 | 游戏 UI「Beta APIs」；level.dat 键名**未核实** | 世界设置 | **未核实** — 禁止当官方键名输出 |

Learn（须带 `view=minecraft-bedrock-stable`）：

- Experimental Features Toggle：https://learn.microsoft.com/en-us/minecraft/creator/documents/experimentalfeaturestoggle?view=minecraft-bedrock-stable
- Pack manifest：https://learn.microsoft.com/en-us/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable
- Script API introduction：https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/introduction?view=minecraft-bedrock-stable

wiki.bedrock.dev/nbt/enabling-experiments 仅作对照，**不得**把 wiki 键名当已核实 API。
