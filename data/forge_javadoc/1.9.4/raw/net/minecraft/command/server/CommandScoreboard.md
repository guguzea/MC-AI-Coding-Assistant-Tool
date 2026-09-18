---
title: "CommandScoreboard"
description: "public class CommandScoreboard extends CommandBase"
package: "net/minecraft/command/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/server/CommandScoreboard.html"
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

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected Scoreboard getScoreboard( MinecraftServer server)`
- `protected ScoreObjective convertToObjective(java.lang.String name, boolean forWrite, MinecraftServer server) throws CommandException`
- `protected ScorePlayerTeam convertToTeam(java.lang.String p_184915_1_, MinecraftServer server) throws CommandException`
- `protected void addObjective( ICommandSender sender, java.lang.String[] p_184908_2_, int p_184908_3_, MinecraftServer server) throws CommandException`
- `protected void addTeam( ICommandSender sender, java.lang.String[] p_184910_2_, int p_184910_3_, MinecraftServer server) throws CommandException`
- `protected void setTeamOption( ICommandSender sender, java.lang.String[] p_184923_2_, int p_184923_3_, MinecraftServer server) throws CommandException`
- `protected void removeTeam( ICommandSender sender, java.lang.String[] p_184921_2_, int p_184921_3_, MinecraftServer server) throws CommandException`
- `protected void listTeams( ICommandSender sender, java.lang.String[] p_184922_2_, int p_184922_3_, MinecraftServer server) throws CommandException`
- `protected void joinTeam( ICommandSender sender, java.lang.String[] p_184916_2_, int p_184916_3_, MinecraftServer server) throws CommandException`
- `protected void leaveTeam( ICommandSender sender, java.lang.String[] p_184911_2_, int p_184911_3_, MinecraftServer server) throws CommandException`
- `protected void emptyTeam( ICommandSender sender, java.lang.String[] p_184917_2_, int p_184917_3_, MinecraftServer server) throws CommandException`
- `protected void removeObjective( ICommandSender sender, java.lang.String p_184905_2_, MinecraftServer server) throws CommandException`
- `protected void listObjectives( ICommandSender sender, MinecraftServer server) throws CommandException`
- `protected void setDisplayObjective( ICommandSender sender, java.lang.String[] p_184919_2_, int p_184919_3_, MinecraftServer server) throws CommandException`
- `protected void listPlayers( ICommandSender sender, java.lang.String[] p_184920_2_, int p_184920_3_, MinecraftServer server) throws CommandException`
- `protected void addPlayerScore( ICommandSender sender, java.lang.String[] p_184918_2_, int p_184918_3_, MinecraftServer server) throws CommandException`
- `protected void resetPlayerScore( ICommandSender sender, java.lang.String[] p_184912_2_, int p_184912_3_, MinecraftServer server) throws CommandException`
- `protected void enablePlayerTrigger( ICommandSender sender, java.lang.String[] p_184914_2_, int p_184914_3_, MinecraftServer server) throws CommandException`
- `protected void testPlayerScore( ICommandSender sender, java.lang.String[] p_184907_2_, int p_184907_3_, MinecraftServer server) throws CommandException`
- `protected void applyPlayerOperation( ICommandSender sender, java.lang.String[] p_184906_2_, int p_184906_3_, MinecraftServer server) throws CommandException`
- `protected void applyPlayerTag( MinecraftServer server, ICommandSender sender, java.lang.String[] p_184924_3_, int p_184924_4_) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `protected java.util.List<java.lang.String> getObjectiveNames(boolean p_184926_1_, MinecraftServer server)`
- `protected java.util.List<java.lang.String> getTriggerNames( MinecraftServer server)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
