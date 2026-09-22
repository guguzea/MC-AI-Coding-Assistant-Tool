# CommandWorldBorder

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandWorldBorder

## Class signature

```java
public class CommandWorldBorder extends CommandBase
```

## Constructors

- `CommandWorldBorder()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`
- `protected WorldBorder getWorldBorder(MinecraftServer server)`