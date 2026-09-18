---
title: "CommandScoreboard"
description: "public class CommandScoreboard extends CommandBase"
package: "net/minecraft/command/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/server/CommandScoreboard.html"
sourceType: javadoc
---

# CommandScoreboard

## Class signature

```java
public class CommandScoreboard extends CommandBase
```

## Constructors

- `public CommandScoreboard()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected Scoreboard getScoreboard( MinecraftServer server)`
- `protected ScoreObjective convertToObjective(java.lang.String name, boolean forWrite, MinecraftServer server) throws CommandException`
- `protected ScorePlayerTeam convertToTeam(java.lang.String name, MinecraftServer server) throws CommandException`
- `protected void addObjective( ICommandSender sender, java.lang.String[] commandArgs, int argStartIndex, MinecraftServer server) throws CommandException`
- `protected void addTeam( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void setTeamOption( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void removeTeam( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void listTeams( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void joinTeam( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void leaveTeam( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void emptyTeam( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void removeObjective( ICommandSender sender, java.lang.String name, MinecraftServer server) throws CommandException`
- `protected void listObjectives( ICommandSender sender, MinecraftServer server) throws CommandException`
- `protected void setDisplayObjective( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void listPlayers( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void addPlayerScore( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void resetPlayerScore( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void enablePlayerTrigger( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void testPlayerScore( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void applyPlayerOperation( ICommandSender sender, java.lang.String[] args, int startIndex, MinecraftServer server) throws CommandException`
- `protected void applyPlayerTag( MinecraftServer server, ICommandSender sender, java.lang.String[] args, int startIndex) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `protected java.util.List<java.lang.String> getObjectiveNames(boolean writableOnly, MinecraftServer server)`
- `protected java.util.List<java.lang.String> getTriggerNames( MinecraftServer server)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
