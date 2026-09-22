# CommandListPlayers

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.server.CommandListPlayers

## Class signature

```java
public class CommandListPlayers extends CommandBase
```

## Constructors

- `CommandListPlayers()`

## Methods

- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked