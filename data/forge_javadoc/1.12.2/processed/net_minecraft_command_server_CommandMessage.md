# CommandMessage

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.server.CommandMessage

## Class signature

```java
public class CommandMessage extends CommandBase
```

## Constructors

- `CommandMessage()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.util.List<java.lang.String> getAliases()`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`