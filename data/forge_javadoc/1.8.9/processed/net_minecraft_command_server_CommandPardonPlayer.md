# CommandPardonPlayer

## Class signature

```java
public class CommandPardonPlayer extends CommandBase
```

## Constructors

- `public CommandPardonPlayer()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public boolean canCommandSenderUseCommand( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`

## Description

Returns true if the given command sender is allowed to use this command.