# CommandServerKick

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandServerKick

## Class signature

```java
public class CommandServerKick extends CommandBase
```

## Constructors

- `CommandServerKick()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked