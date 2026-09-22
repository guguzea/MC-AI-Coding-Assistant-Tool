# ForgeCommand

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraftforge.server.command.CommandTreeBase → net.minecraftforge.server.command.ForgeCommand

## Class signature

```java
public class ForgeCommand extends CommandTreeBase
```

## Constructors

- `ForgeCommand()`

## Methods

- `void addSubcommand(ICommand command)`
- `boolean checkPermission(MinecraftServer server, ICommandSender sender)`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.lang.String getUsage(ICommandSender icommandsender)`