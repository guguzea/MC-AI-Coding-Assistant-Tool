# CommandGameRule

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandGameRule

## Class signature

```java
public class CommandGameRule extends CommandBase
```

## Constructors

- `CommandGameRule()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`
- `static void notifyGameRuleChange(GameRules rules, java.lang.String p_184898_1_, MinecraftServer server)`