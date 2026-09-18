# CommandTime

## Class signature

```java
public class CommandTime extends CommandBase
```

## Constructors

- `public CommandTime()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected void setTime( ICommandSender p_71552_1_, int p_71552_2_)`
- `protected void addTime( ICommandSender p_71553_1_, int p_71553_2_)`

## Description

Adds (or removes) time in the server object.