# 实验开关分层

| 层 | 写什么 | 哪里 |
|----|--------|------|
| Pack 能力 | capabilities（script_eval 等） | manifest.json |
| Script 模块 | dependencies 里 @minecraft/server 的 beta | BP manifest |
| 世界实验 | experiments.gametest=1 | level.dat / 游戏 UI「Beta APIs」 |

Learn（须带 `view=minecraft-bedrock-stable`）：

- Experimental Features Toggle：https://learn.microsoft.com/en-us/minecraft/creator/documents/experimentalfeaturestoggle?view=minecraft-bedrock-stable
- Pack manifest：https://learn.microsoft.com/en-us/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable
- Script API introduction：https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/introduction?view=minecraft-bedrock-stable

wiki.bedrock.dev/nbt/enabling-experiments 仅作对照，类名以 Learn 为准。
