# CommandShowSeed

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandShowSeed

## Class signature

```java
public class CommandShowSeed extends CommandBase
```

## Constructors

- `CommandShowSeed()`

## Methods

- `boolean canCommandSenderUseCommand(ICommandSender sender)` — Returns true if the given command sender is allowed to use this command.
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked