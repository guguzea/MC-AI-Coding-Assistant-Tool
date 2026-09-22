# CommandGameRule

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandGameRule

## Class signature

```java
public class CommandGameRule extends CommandBase
```

## Constructors

- `CommandGameRule()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `static void func_175773_a(GameRules p_175773_0_, java.lang.String p_175773_1_)`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked