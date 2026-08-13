# 实验开关分层

| 层 | 写什么 | 哪里 |
|----|--------|------|
| Pack 能力 | capabilities（script_eval 等） | manifest.json |
| Script 模块 | dependencies 里 @minecraft/server 的 beta | BP manifest |
| 世界实验 | experiments.gametest=1 | level.dat / 游戏 UI「Beta APIs」 |

Learn: Experimental Features Toggle。wiki.bedrock.dev/nbt/enabling-experiments。
