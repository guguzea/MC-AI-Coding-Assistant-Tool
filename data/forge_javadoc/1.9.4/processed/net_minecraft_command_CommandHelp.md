# CommandHelp

## Class signature

```java
public class CommandHelp extends CommandBase
```

## Constructors

- `public CommandHelp()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public java.util.List<java.lang.String> getCommandAliases()`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected java.util.List< ICommand > getSortedPossibleCommands( ICommandSender sender, MinecraftServer server)`
- `protected java.util.Map<java.lang.String, ICommand > getCommandMap( MinecraftServer server)`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`