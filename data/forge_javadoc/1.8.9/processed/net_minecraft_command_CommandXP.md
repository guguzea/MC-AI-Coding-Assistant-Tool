# CommandXP

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandXP

## Class signature

```java
public class CommandXP extends CommandBase
```

## Constructors

- `CommandXP()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected java.lang.String[] getAllUsernames()`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `boolean isUsernameIndex(java.lang.String[] args, int index)` — Return whether the specified command parameter index is a username parameter.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked