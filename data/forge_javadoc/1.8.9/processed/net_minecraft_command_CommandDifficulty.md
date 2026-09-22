# CommandDifficulty

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandDifficulty

## Class signature

```java
public class CommandDifficulty extends CommandBase
```

## Constructors

- `CommandDifficulty()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `protected EnumDifficulty getDifficultyFromCommand(java.lang.String p_180531_1_)`
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked