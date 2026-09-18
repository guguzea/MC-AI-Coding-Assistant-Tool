# AdvancementCommand

## Class signature

```java
public class AdvancementCommand extends CommandBase
```

## Constructors

- `public AdvancementCommand()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
- `public static Advancement findAdvancement( MinecraftServer server, java.lang.String id) throws CommandException`