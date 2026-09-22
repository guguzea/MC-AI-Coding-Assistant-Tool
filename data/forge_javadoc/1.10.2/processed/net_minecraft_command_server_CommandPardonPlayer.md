# CommandPardonPlayer

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.server.CommandPardonPlayer

## Class signature

```java
public class CommandPardonPlayer extends CommandBase
```

## Constructors

- `CommandPardonPlayer()`

## Methods

- `boolean checkPermission(MinecraftServer server, ICommandSender sender)`
- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`