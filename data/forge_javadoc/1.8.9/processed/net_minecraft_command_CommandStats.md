# CommandStats

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandStats

## Class signature

```java
public class CommandStats extends CommandBase
```

## Constructors

- `CommandStats()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected java.lang.String[] func_175776_d()`
- `protected java.util.List<java.lang.String> func_175777_e()`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `boolean isUsernameIndex(java.lang.String[] args, int index)` — Return whether the specified command parameter index is a username parameter.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked