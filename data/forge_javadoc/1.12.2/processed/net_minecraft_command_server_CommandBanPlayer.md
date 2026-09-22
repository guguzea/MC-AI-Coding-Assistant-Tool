# CommandBanPlayer

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.server.CommandBanPlayer

## Class signature

```java
public class CommandBanPlayer extends CommandBase
```

## Constructors

- `CommandBanPlayer()`

## Methods

- `boolean checkPermission(MinecraftServer server, ICommandSender sender)`
- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`