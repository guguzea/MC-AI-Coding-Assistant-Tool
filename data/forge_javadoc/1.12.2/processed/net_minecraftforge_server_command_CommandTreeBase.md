# CommandTreeBase

## Class signature

```java
public abstract class CommandTreeBase extends CommandBase
```

## Constructors

- `public CommandTreeBase()`

## Methods

- `public void addSubcommand( ICommand command)`
- `public java.util.Collection< ICommand > getSubCommands()`
- `public ICommand getSubCommand(java.lang.String command)`
- `public java.util.Map<java.lang.String, ICommand > getCommandMap()`
- `public java.util.List< ICommand > getSortedCommandList()`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`

## Description

Base class for commands that has subcommands. E.g. /team settings set [value] settings is subcommand of team and set is subcommand of settings