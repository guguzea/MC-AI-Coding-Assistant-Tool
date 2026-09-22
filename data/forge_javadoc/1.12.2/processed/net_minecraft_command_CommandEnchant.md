# CommandEnchant

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandEnchant

## Class signature

```java
public class CommandEnchant extends CommandBase
```

## Constructors

- `CommandEnchant()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`