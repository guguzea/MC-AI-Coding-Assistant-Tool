# CommandEnchant

## Class signature

```java
public class CommandEnchant extends CommandBase
```

## Constructors

- `public CommandEnchant()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected java.lang.String[] getListOfPlayers()`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`

## Description

Gets the name of the command