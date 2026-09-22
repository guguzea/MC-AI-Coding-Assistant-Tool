---
title: "ServerScoreboard"
description: "public class ServerScoreboard extends Scoreboard"
package: "net/minecraft/scoreboard"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/scoreboard/ServerScoreboard.html"
sourceType: javadoc
---

# ServerScoreboard

**Inheritance:** java.lang.Object → net.minecraft.scoreboard.Scoreboard → net.minecraft.scoreboard.ServerScoreboard

## Class signature

```java
public class ServerScoreboard extends Scoreboard
```

## Constructors

- `ServerScoreboard(MinecraftServer mcServer)`

## Methods

- `boolean addPlayerToTeam(java.lang.String player, java.lang.String newTeam)` — Adds a player to the given team
- `void broadcastTeamCreated(ScorePlayerTeam playerTeam)` — This packet will notify the players that this team is created, and that will register it on the client
- `void func_178820_a(java.lang.String p_178820_1_, ScoreObjective p_178820_2_)`
- `void func_96513_c(ScorePlayerTeam playerTeam)`
- `void func_96516_a(java.lang.String p_96516_1_)`
- `void func_96536_a(Score p_96536_1_)`
- `void func_96547_a(ScoreboardSaveData p_96547_1_)`
- `java.util.List<Packet> func_96548_f(ScoreObjective p_96548_1_)`
- `void func_96549_e(ScoreObjective p_96549_1_)`
- `java.util.List<Packet> func_96550_d(ScoreObjective p_96550_1_)`
- `int func_96552_h(ScoreObjective p_96552_1_)`
- `protected void markSaveDataDirty()`
- `void onObjectiveDisplayNameChanged(ScoreObjective p_96532_1_)`
- `void onScoreObjectiveAdded(ScoreObjective scoreObjectiveIn)` — Called when a score objective is added
- `void onScoreObjectiveRemoved(ScoreObjective p_96533_1_)`
- `void removePlayerFromTeam(java.lang.String p_96512_1_, ScorePlayerTeam p_96512_2_)` — Removes the given username from the given ScorePlayerTeam.
- `void sendDisplaySlotRemovalPackets(ScoreObjective p_96546_1_)`
- `void sendTeamUpdate(ScorePlayerTeam playerTeam)` — This packet will notify the players that this team is updated
- `void setObjectiveInDisplaySlot(int p_96530_1_, ScoreObjective p_96530_2_)` — 0 is tab menu, 1 is sidebar, 2 is below name
