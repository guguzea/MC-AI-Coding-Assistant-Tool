# ForgeCommand

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraftforge.server.command.ForgeCommand

## Class signature

```java
public class ForgeCommand extends CommandBase
```

## Constructors

- `ForgeCommand()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender icommandsender)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`