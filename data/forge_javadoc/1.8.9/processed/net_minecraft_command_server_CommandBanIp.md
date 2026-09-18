# CommandBanIp

## Class signature

```java
public class CommandBanIp extends CommandBase
```

## Constructors

- `public CommandBanIp()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public boolean canCommandSenderUseCommand( ICommandSender sender)`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected void func_147210_a( ICommandSender p_147210_1_, java.lang.String p_147210_2_, java.lang.String p_147210_3_)`

## Description

Returns true if the given command sender is allowed to use this command.