# CommandListBans

## Class signature

```java
public class CommandListBans extends CommandBase
```

## Constructors

- `public CommandListBans()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public boolean checkPermission( MinecraftServer server, ICommandSender sender)`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos targetPos)`