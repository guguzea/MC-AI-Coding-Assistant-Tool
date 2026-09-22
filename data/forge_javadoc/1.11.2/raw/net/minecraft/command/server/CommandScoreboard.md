---
title: "CommandScoreboard"
description: "public class CommandScoreboard extends CommandBase"
package: "net/minecraft/command/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/command/server/CommandScoreboard.html"
sourceType: javadoc
---

# CommandScoreboard

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.server.CommandScoreboard

## Class signature

```java
public class CommandScoreboard extends CommandBase
```

## Constructors

- `CommandScoreboard()`

## Methods

- `protected void addObjective(ICommandSender sender, java.lang.String[] commandArgs, int argStartIndex, MinecraftServer server)`
- `protected void addPlayerScore(ICommandSender sender, java.lang.String[] p_184918_2_, int p_184918_3_, MinecraftServer server)`
- `protected void addTeam(ICommandSender sender, java.lang.String[] p_184910_2_, int p_184910_3_, MinecraftServer server)`
- `protected void applyPlayerOperation(ICommandSender sender, java.lang.String[] p_184906_2_, int p_184906_3_, MinecraftServer server)`
- `protected void applyPlayerTag(MinecraftServer server, ICommandSender sender, java.lang.String[] p_184924_3_, int p_184924_4_)`
- `protected ScoreObjective convertToObjective(java.lang.String name, boolean forWrite, MinecraftServer server)`
- `protected ScorePlayerTeam convertToTeam(java.lang.String p_184915_1_, MinecraftServer server)`
- `protected void emptyTeam(ICommandSender sender, java.lang.String[] p_184917_2_, int p_184917_3_, MinecraftServer server)`
- `protected void enablePlayerTrigger(ICommandSender sender, java.lang.String[] p_184914_2_, int p_184914_3_, MinecraftServer server)`
- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getName()`
- `protected java.util.List<java.lang.String> getObjectiveNames(boolean writableOnly, MinecraftServer server)`
- `int getRequiredPermissionLevel()`
- `protected Scoreboard getScoreboard(MinecraftServer server)`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `protected java.util.List<java.lang.String> getTriggerNames(MinecraftServer server)`
- `java.lang.String getUsage(ICommandSender sender)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
- `protected void joinTeam(ICommandSender sender, java.lang.String[] p_184916_2_, int p_184916_3_, MinecraftServer server)`
- `protected void leaveTeam(ICommandSender sender, java.lang.String[] p_184911_2_, int p_184911_3_, MinecraftServer server)`
- `protected void listObjectives(ICommandSender sender, MinecraftServer server)`
- `protected void listPlayers(ICommandSender sender, java.lang.String[] p_184920_2_, int p_184920_3_, MinecraftServer server)`
- `protected void listTeams(ICommandSender sender, java.lang.String[] p_184922_2_, int p_184922_3_, MinecraftServer server)`
- `protected void removeObjective(ICommandSender sender, java.lang.String name, MinecraftServer server)`
- `protected void removeTeam(ICommandSender sender, java.lang.String[] p_184921_2_, int p_184921_3_, MinecraftServer server)`
- `protected void resetPlayerScore(ICommandSender sender, java.lang.String[] p_184912_2_, int p_184912_3_, MinecraftServer server)`
- `protected void setDisplayObjective(ICommandSender sender, java.lang.String[] p_184919_2_, int p_184919_3_, MinecraftServer server)`
- `protected void setTeamOption(ICommandSender sender, java.lang.String[] p_184923_2_, int p_184923_3_, MinecraftServer server)`
- `protected void testPlayerScore(ICommandSender sender, java.lang.String[] p_184907_2_, int p_184907_3_, MinecraftServer server)`
