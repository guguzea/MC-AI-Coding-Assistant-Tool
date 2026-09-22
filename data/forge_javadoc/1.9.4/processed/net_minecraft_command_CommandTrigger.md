# CommandTrigger

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandTrigger

## Class signature

```java
public class CommandTrigger extends CommandBase
```

## Constructors

- `CommandTrigger()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`