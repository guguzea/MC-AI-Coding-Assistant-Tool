# CommandHelp

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandHelp

## Class signature

```java
public class CommandHelp extends CommandBase
```

## Constructors

- `CommandHelp()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `java.util.List<java.lang.String> getCommandAliases()`
- `java.lang.String getCommandName()` — Gets the name of the command
- `protected java.util.Map<java.lang.String, ICommand> getCommands()`
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `protected java.util.List<ICommand> getSortedPossibleCommands(ICommandSender p_71534_1_)`
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked