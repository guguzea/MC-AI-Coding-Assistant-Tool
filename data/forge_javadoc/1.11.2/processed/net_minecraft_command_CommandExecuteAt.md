# CommandExecuteAt

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandExecuteAt

## Class signature

```java
public class CommandExecuteAt extends CommandBase
```

## Constructors

- `CommandExecuteAt()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`