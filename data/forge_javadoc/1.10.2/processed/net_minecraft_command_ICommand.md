# ICommand

## Class signature

```java
public interface ICommand extends java.lang.Comparable< ICommand >
```

## Methods

- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage( ICommandSender sender)`
- `java.util.List<java.lang.String> getCommandAliases()`
- `void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `boolean checkPermission( MinecraftServer server, ICommandSender sender)`
- `java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`