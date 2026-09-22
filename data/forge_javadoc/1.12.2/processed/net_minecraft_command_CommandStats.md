# CommandStats

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandStats

## Class signature

```java
public class CommandStats extends CommandBase
```

## Constructors

- `CommandStats()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getName()`
- `protected java.util.List<java.lang.String> getObjectiveNames(MinecraftServer server)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`