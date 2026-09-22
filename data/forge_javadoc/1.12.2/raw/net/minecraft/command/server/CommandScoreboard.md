---
title: "CommandScoreboard"
description: "public class CommandScoreboard extends CommandBase"
package: "net/minecraft/command/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/server/CommandScoreboard.html"
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
- `protected void addPlayerScore(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void addTeam(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void applyPlayerOperation(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void applyPlayerTag(MinecraftServer server, ICommandSender sender, java.lang.String[] args, int startIndex)`
- `protected ScoreObjective convertToObjective(java.lang.String name, boolean forWrite, MinecraftServer server)`
- `protected ScorePlayerTeam convertToTeam(java.lang.String name, MinecraftServer server)`
- `protected void emptyTeam(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void enablePlayerTrigger(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getName()`
- `protected java.util.List<java.lang.String> getObjectiveNames(boolean writableOnly, MinecraftServer server)`
- `int getRequiredPermissionLevel()`
- `protected Scoreboard getScoreboard(MinecraftServer server)`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `protected java.util.List<java.lang.String> getTriggerNames(MinecraftServer server)`
- `java.lang.String getUsage(ICommandSender sender)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
- `protected void joinTeam(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void leaveTeam(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void listObjectives(ICommandSender sender, MinecraftServer server)`
- `protected void listPlayers(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void listTeams(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void removeObjective(ICommandSender sender, java.lang.String name, MinecraftServer server)`
- `protected void removeTeam(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void resetPlayerScore(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void setDisplayObjective(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void setTeamOption(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
- `protected void testPlayerScore(ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server)`
