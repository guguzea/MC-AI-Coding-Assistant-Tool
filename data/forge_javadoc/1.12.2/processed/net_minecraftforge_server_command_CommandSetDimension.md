# CommandSetDimension

## Class signature

```java
public class CommandSetDimension extends CommandBase
```

## Constructors

- `public CommandSetDimension()`

## Methods

- `public java.lang.String getName()`
- `public java.util.List<java.lang.String> getAliases()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `public int getRequiredPermissionLevel()`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`