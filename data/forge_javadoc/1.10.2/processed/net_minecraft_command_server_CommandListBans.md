# CommandListBans

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.server.CommandListBans

## Class signature

```java
public class CommandListBans extends CommandBase
```

## Constructors

- `CommandListBans()`

## Methods

- `boolean checkPermission(MinecraftServer server, ICommandSender sender)`
- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`