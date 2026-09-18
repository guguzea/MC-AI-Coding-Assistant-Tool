# ICommand

## Class signature

```java
public interface ICommand extends java.lang.Comparable< ICommand >
```

## Methods

- `java.lang.String getName()`
- `java.lang.String getUsage( ICommandSender sender)`
- `java.util.List<java.lang.String> getAliases()`
- `void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `boolean checkPermission( MinecraftServer server, ICommandSender sender)`
- `java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos targetPos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`