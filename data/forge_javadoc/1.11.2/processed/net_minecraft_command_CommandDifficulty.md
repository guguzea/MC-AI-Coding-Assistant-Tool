# CommandDifficulty

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandDifficulty

## Class signature

```java
public class CommandDifficulty extends CommandBase
```

## Constructors

- `CommandDifficulty()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `protected EnumDifficulty getDifficultyFromCommand(java.lang.String difficultyString)`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`