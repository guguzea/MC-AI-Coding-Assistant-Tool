# CommandMessage

## Class signature

```java
public class CommandMessage extends CommandBase
```

## Constructors

- `public CommandMessage()`

## Methods

- `public java.util.List<java.lang.String> getAliases()`
- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`