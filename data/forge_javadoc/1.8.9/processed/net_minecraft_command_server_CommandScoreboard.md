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
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected Scoreboard getScoreboard()`
- `protected ScoreObjective getObjective(java.lang.String name, boolean edit) throws CommandException`
- `protected ScorePlayerTeam getTeam(java.lang.String name) throws CommandException`
- `protected void addObjective( ICommandSender sender, java.lang.String[] args, int index) throws CommandException`
- `protected void addTeam( ICommandSender sender, java.lang.String[] args, int index) throws CommandException`
- `protected void setTeamOption( ICommandSender sender, java.lang.String[] args, int index) throws CommandException`
- `protected void removeTeam( ICommandSender p_147194_1_, java.lang.String[] p_147194_2_, int p_147194_3_) throws CommandException`
- `protected void listTeams( ICommandSender p_147186_1_, java.lang.String[] p_147186_2_, int p_147186_3_) throws CommandException`
- `protected void joinTeam( ICommandSender p_147190_1_, java.lang.String[] p_147190_2_, int p_147190_3_) throws CommandException`
- `protected void leaveTeam( ICommandSender p_147199_1_, java.lang.String[] p_147199_2_, int p_147199_3_) throws CommandException`
- `protected void emptyTeam( ICommandSender p_147188_1_, java.lang.String[] p_147188_2_, int p_147188_3_) throws CommandException`
- `protected void removeObjective( ICommandSender p_147191_1_, java.lang.String p_147191_2_) throws CommandException`
- `protected void listObjectives( ICommandSender p_147196_1_) throws CommandException`
- `protected void setObjectiveDisplay( ICommandSender p_147198_1_, java.lang.String[] p_147198_2_, int p_147198_3_) throws CommandException`
- `protected void listPlayers( ICommandSender p_147195_1_, java.lang.String[] p_147195_2_, int p_147195_3_) throws CommandException`
- `protected void setPlayer( ICommandSender p_147197_1_, java.lang.String[] p_147197_2_, int p_147197_3_) throws CommandException`
- `protected void resetPlayers( ICommandSender p_147187_1_, java.lang.String[] p_147187_2_, int p_147187_3_) throws CommandException`
- `protected void func_175779_n( ICommandSender p_175779_1_, java.lang.String[] p_175779_2_, int p_175779_3_) throws CommandException`
- `protected void func_175781_o( ICommandSender p_175781_1_, java.lang.String[] p_175781_2_, int p_175781_3_) throws CommandException`
- `protected void func_175778_p( ICommandSender p_175778_1_, java.lang.String[] p_175778_2_, int p_175778_3_) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected java.util.List<java.lang.String> func_147184_a(boolean p_147184_1_)`
- `protected java.util.List<java.lang.String> func_175782_e()`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`

## Description

Gets the name of the command