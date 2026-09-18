# CommandTP

## Class signature

```java
public class CommandTP extends CommandBase
```

## Constructors

- `public CommandTP()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos targetPos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`