# CommandGameMode

## Class signature

```java
public class CommandGameMode extends CommandBase
```

## Constructors

- `public CommandGameMode()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected WorldSettings.GameType getGameModeFromCommand( ICommandSender p_71539_1_, java.lang.String p_71539_2_) throws CommandException , NumberInvalidException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected java.lang.String[] getListOfPlayerUsernames()`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`

## Description

Gets the name of the command