# CommandTime

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandTime

## Class signature

```java
public class CommandTime extends CommandBase
```

## Constructors

- `CommandTime()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected void incrementAllWorldTimes(MinecraftServer server, int amount)`
- `protected void setAllWorldTimes(MinecraftServer server, int time)`