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
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected WorldBorder getWorldBorder(MinecraftServer server)`